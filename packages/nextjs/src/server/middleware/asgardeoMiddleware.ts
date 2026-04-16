/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {NextRequest, NextResponse} from 'next/server';
import {AsgardeoNextConfig} from '../../models/config';
import SessionManager, {SessionTokenPayload} from '../../utils/SessionManager';
import {performTokenRefresh} from '../../utils/tokenRefreshUtils';
import {
  hasValidSession as hasValidJWTSession,
  getSessionFromRequest,
  getSessionIdFromRequest,
} from '../../utils/sessionUtils';

export type AsgardeoMiddlewareOptions = Partial<AsgardeoNextConfig>;

export type AsgardeoMiddlewareContext = {
  /** Get the session payload from JWT session if available */
  getSession: () => Promise<SessionTokenPayload | undefined>;
  /** Get the session ID from the current request */
  getSessionId: () => string | undefined;
  /** Check if the current request has a valid Asgardeo session */
  isSignedIn: () => boolean;
  /**
   * Protect a route by redirecting unauthenticated users.
   * Redirect URL fallback order:
   * 1. options.redirect
   * 2. resolvedOptions.signInUrl
   * 3. resolvedOptions.defaultRedirect
   * 4. referer (if from same origin)
   * If none are available, throws an error.
   */
  protectRoute: (routeOptions?: {redirect?: string}) => Promise<NextResponse | void>;
};

type AsgardeoMiddlewareHandler = (
  asgardeo: AsgardeoMiddlewareContext,
  req: NextRequest,
) => Promise<NextResponse | void> | NextResponse | void;

/**
 * Enhanced session validation that checks both JWT and legacy sessions
 *
 * @param request - The Next.js request object
 * @returns True if a valid session exists, false otherwise
 */
const hasValidSession = async (request: NextRequest): Promise<boolean> => {
  try {
    return await hasValidJWTSession(request);
  } catch {
    return Promise.resolve(false);
  }
};

/**
 * Gets the session ID from the request cookies.
 * Supports both JWT and legacy session formats.
 *
 * @param request - The Next.js request object
 * @returns The session ID if it exists, undefined otherwise
 */
const getSessionIdFromRequestMiddleware = async (request: NextRequest): Promise<string | undefined> =>
  getSessionIdFromRequest(request);

/**
 * Asgardeo middleware that integrates authentication into your Next.js application.
 * Similar to Clerk's clerkMiddleware pattern.
 *
 * @param handler - Optional handler function to customize middleware behavior
 * @param options - Configuration options for the middleware
 * @returns Next.js middleware function
 *
 * @example
 * ```typescript
 * // middleware.ts - Basic usage
 * import { asgardeoMiddleware } from '@asgardeo/nextjs';
 *
 * export default asgardeoMiddleware();
 * ```
 *
 * @example
 * ```typescript
 * // With route protection
 * import { asgardeoMiddleware, createRouteMatcher } from '@asgardeo/nextjs';
 *
 * const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
 *
 * export default asgardeoMiddleware(async (asgardeo, req) => {
 *   if (isProtectedRoute(req)) {
 *     await asgardeo.protectRoute();
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Advanced usage with custom logic
 * import { asgardeoMiddleware, createRouteMatcher } from '@asgardeo/nextjs';
 *
 * const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
 * const isAuthRoute = createRouteMatcher(['/sign-in', '/sign-up']);
 *
 * export default asgardeoMiddleware(async (asgardeo, req) => {
 *   // Skip protection for auth routes
 *   if (isAuthRoute(req)) return;
 *
 *   // Protect specified routes
 *   if (isProtectedRoute(req)) {
 *     await asgardeo.protectRoute({ redirect: '/sign-in' });
 *   }
 *
 *   // Check authentication status
 *   if (asgardeo.isSignedIn()) {
 *     console.log('User is authenticated with session:', asgardeo.getSessionId());
 *   }
 * }, {
 *   defaultRedirect: '/sign-in'
 * });
 * ```
 */
/**
 * Attempt a token refresh entirely within the Edge Runtime using env-var credentials.
 *
 * Reads the identity fields (sub, sessionId, scopes, etc.) from the provided decoded
 * payload so that we can rebuild a new session JWT without touching the Node.js
 * SDK singleton (which is not available in the Edge Runtime).
 *
 * Returns the signed new session JWT string on success, or null on any failure.
 */
const tryRefreshInMiddleware = async (
  refreshToken: string,
  decodedPayload: SessionTokenPayload,
): Promise<string | null> => {
  const clientId: string | undefined = process.env['NEXT_PUBLIC_ASGARDEO_CLIENT_ID'];
  const clientSecret: string | undefined = process.env['ASGARDEO_CLIENT_SECRET'];
  const baseUrl: string | undefined = process.env['NEXT_PUBLIC_ASGARDEO_BASE_URL'];

  // If the app has not set env vars, skip the refresh in middleware.
  // getAccessToken() (Node.js runtime) will handle the refresh on the first API call.
  if (!clientId || !clientSecret || !baseUrl) {
    return null;
  }

  const scopes: string | undefined = Array.isArray(decodedPayload.scopes)
    ? decodedPayload.scopes.join(' ')
    : (decodedPayload.scopes as string | undefined);

  const refreshResult = await performTokenRefresh({
    baseUrl,
    clientId,
    clientSecret,
    refreshToken,
    scopes,
  });

  if (!refreshResult) {
    return null;
  }

  try {
    return await SessionManager.createSessionToken(
      refreshResult.accessToken,
      decodedPayload.sub as string,
      decodedPayload.sessionId,
      refreshResult.scope ?? scopes ?? '',
      decodedPayload.organizationId,
      refreshResult.expiresIn,
      // Prefer the rotated refresh token from the server; fall back to the original.
      refreshResult.refreshToken ?? refreshToken,
    );
  } catch {
    return null;
  }
};

const asgardeoMiddleware =
  (
    handler?: AsgardeoMiddlewareHandler,
    options?: AsgardeoMiddlewareOptions | ((req: NextRequest) => AsgardeoMiddlewareOptions),
  ): ((request: NextRequest) => Promise<NextResponse>) =>
  async (request: NextRequest): Promise<NextResponse> => {
    const resolvedOptions: AsgardeoMiddlewareOptions = typeof options === 'function' ? options(request) : options || {};

    const url: URL = new URL(request.url);
    const hasCallbackParams: boolean = url.searchParams.has('code') && url.searchParams.has('state');

    let isValidOAuthCallback: boolean = false;
    if (hasCallbackParams) {
      // OAuth callbacks should not contain error parameters that indicate failed auth
      const hasError: boolean = url.searchParams.has('error');

      if (!hasError) {
        // Validate that there's a temporary session that initiated this OAuth flow
        const tempSessionToken: string | undefined = request.cookies.get(
          SessionManager.getTempSessionCookieName(),
        )?.value;
        if (tempSessionToken) {
          try {
            // Verify the temporary session exists and is valid
            await SessionManager.verifyTempSession(tempSessionToken);
            isValidOAuthCallback = true;
          } catch {
            // Invalid temp session - this is not a legitimate OAuth callback
            isValidOAuthCallback = false;
          }
        }
      }
    }

    // ─── Session & Token Refresh ──────────────────────────────────────────────
    //
    // Strategy (executed only outside an active OAuth callback flow):
    //
    // 1. hasValidSession  → JWT signature valid AND session cookie not expired.
    //    With the new 24-hour session cookie, this stays true even after the
    //    short-lived access token (1 hour) expires.
    //
    // 2. If the session JWT is valid:
    //    a. Check accessTokenExpiresAt. If the access token has expired or is
    //       within REFRESH_THRESHOLD_SECONDS of expiring → proactive refresh.
    //    b. If refresh succeeds → store new JWT; isAuthenticated stays true.
    //    c. If refresh fails AND token is already expired → isAuthenticated = false.
    //    d. If refresh fails BUT token is still valid (near-expiry window) →
    //       keep isAuthenticated = true; getAccessToken() will retry later.
    //
    // 3. If the session JWT itself is invalid/expired (e.g. old 1-hour cookie):
    //    Decode the cookie without verification to retrieve the refresh token.
    //    Attempt a refresh. If it succeeds → new JWT, isAuthenticated = true.
    //    If it fails → isAuthenticated stays false → normal redirect to sign-in.
    //
    // ─────────────────────────────────────────────────────────────────────────

    let isAuthenticated: boolean = await hasValidSession(request);
    let sessionId: string | undefined = await getSessionIdFromRequestMiddleware(request);
    let refreshedSessionJwt: string | undefined;

    if (!isValidOAuthCallback) {
      const sessionCookieName: string = SessionManager.getSessionCookieName();
      const rawToken: string | undefined = request.cookies.get(sessionCookieName)?.value;

      if (isAuthenticated && rawToken) {
        // Session JWT is valid — check whether the access token needs refresh.
        const session: SessionTokenPayload | undefined = await getSessionFromRequest(request);

        if (session?.refreshToken && session.accessTokenExpiresAt !== undefined) {
          const now: number = Math.floor(Date.now() / 1000);
          const accessTokenExpired: boolean = session.accessTokenExpiresAt <= now;
          const nearExpiry: boolean =
            session.accessTokenExpiresAt - now < SessionManager.REFRESH_THRESHOLD_SECONDS;

          if (accessTokenExpired || nearExpiry) {
            const newJwt: string | null = await tryRefreshInMiddleware(session.refreshToken, session);

            if (newJwt) {
              refreshedSessionJwt = newJwt;
              // sessionId stays the same — only tokens changed
            } else if (accessTokenExpired) {
              // Refresh failed and the access token is already expired.
              // Treat as unauthenticated so protectRoute() can redirect to sign-in.
              isAuthenticated = false;
            }
            // If near-expiry refresh failed but token is still valid, fall through.
          }
        }
      } else if (!isAuthenticated && rawToken) {
        // The session JWT is no longer valid (e.g. 1-hour cookie from an older SDK
        // version, or the session just expired). Try to decode it without verifying
        // the signature/expiry to recover the refresh token.
        const decoded: SessionTokenPayload | null = SessionManager.decodeSessionToken(rawToken);

        if (decoded?.refreshToken) {
          const newJwt: string | null = await tryRefreshInMiddleware(decoded.refreshToken, decoded);

          if (newJwt) {
            refreshedSessionJwt = newJwt;
            sessionId = decoded.sessionId;
            isAuthenticated = true;
          }
        }
      }
    }

    // ─── Build middleware context ─────────────────────────────────────────────

    const asgardeo: AsgardeoMiddlewareContext = {
      getSession: async (): Promise<SessionTokenPayload | undefined> => {
        try {
          // Return the refreshed payload when available so the handler always sees
          // up-to-date token information.
          if (refreshedSessionJwt) {
            return await SessionManager.verifySessionToken(refreshedSessionJwt);
          }
          return await getSessionFromRequest(request);
        } catch {
          return undefined;
        }
      },
      getSessionId: (): string | undefined => sessionId,
      isSignedIn: (): boolean => isAuthenticated,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      protectRoute: async (routeOptions?: {redirect?: string}): Promise<NextResponse | void> => {
        // Skip protection if this is a validated OAuth callback - let the callback handler process it first
        // This prevents race conditions where middleware redirects before OAuth callback completes
        if (isValidOAuthCallback) {
          return undefined;
        }

        if (!isAuthenticated) {
          const referer: string | null = request.headers.get('referer');
          // TODO: Make this configurable or call the signIn() from here.
          let fallbackRedirect: string = '/';

          // If referer exists and is from the same origin, use it as fallback
          if (referer) {
            try {
              const refererUrl: URL = new URL(referer);
              const requestUrl: URL = new URL(request.url);

              if (refererUrl.origin === requestUrl.origin) {
                fallbackRedirect = refererUrl.pathname + refererUrl.search;
              }
            } catch (error) {
              // Invalid referer URL, ignore it
            }
          }

          // Fallback chain: options.redirect -> resolvedOptions.signInUrl -> resolvedOptions.defaultRedirect -> referer (same origin only)
          const redirectUrl: string = (resolvedOptions?.signInUrl as string) || fallbackRedirect;

          const signInUrl: URL = new URL(redirectUrl, request.url);

          return NextResponse.redirect(signInUrl);
        }

        return undefined;
      },
    };

    // ─── Call custom handler, then finalise the response ─────────────────────
    //
    // We no longer return early from the handler result so that we can always
    // attach the refreshed session cookie to whatever response is produced —
    // whether it is a normal NextResponse.next() or a handler-provided response.
    // The cookie is NOT set on redirect responses (which only happen when
    // isAuthenticated=false, in which case refreshedSessionJwt is undefined).

    let response: NextResponse;

    if (handler) {
      const result: NextResponse | void = await handler(asgardeo, request);
      response = result ?? NextResponse.next();
    } else {
      response = NextResponse.next();
    }

    if (refreshedSessionJwt) {
      response.cookies.set(
        SessionManager.getSessionCookieName(),
        refreshedSessionJwt,
        SessionManager.getSessionCookieOptions(),
      );
    }

    return response;
  };

export default asgardeoMiddleware;
