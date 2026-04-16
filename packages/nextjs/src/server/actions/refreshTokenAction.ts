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

'use server';

import {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import {cookies} from 'next/headers';
import AsgardeoNextClient from '../../AsgardeoNextClient';
import {AsgardeoNextConfig} from '../../models/config';
import SessionManager, {SessionTokenPayload} from '../../utils/SessionManager';
import {TokenRefreshResult, performTokenRefresh} from '../../utils/tokenRefreshUtils';
import logger from '../../utils/logger';

/**
 * Result returned by refreshTokenAction.
 */
export interface RefreshTokenActionResult {
  /** Whether the refresh succeeded and a new session cookie has been written */
  success: boolean;
  /** Human-readable reason for failure, useful for debugging */
  error?: string;
  /**
   * When true the refresh token is expired or revoked and the caller should
   * sign the user out and redirect to the sign-in page.
   */
  redirectToSignIn?: boolean;
}

/**
 * Server action that silently refreshes the OAuth access token using the refresh
 * token stored inside the current session cookie.
 *
 * Flow:
 * 1. Read the existing session cookie and verify its JWT signature.
 * 2. Extract the refresh token from the session payload.
 * 3. Call the Asgardeo token endpoint with grant_type=refresh_token.
 * 4. On success: create a new session JWT (with the fresh access token + new
 *    refresh token if the server rotated it) and overwrite the session cookie.
 * 5. On failure (revoked/expired refresh token): clear the session cookie and
 *    signal the caller to redirect to the sign-in page.
 *
 * This action is called from:
 * - getAccessToken.ts   — lazily, just before making an API call
 */
const refreshTokenAction = async (): Promise<RefreshTokenActionResult> => {
  try {
    const cookieStore: ReadonlyRequestCookies = await cookies();
    const sessionCookieName: string = SessionManager.getSessionCookieName();
    const rawToken: string | undefined = cookieStore.get(sessionCookieName)?.value;

    if (!rawToken) {
      return {error: 'No session cookie found', success: false};
    }

    // Verify the existing JWT (signature + expiry of the session cookie itself).
    // If the session cookie has expired the user must sign in again; we cannot
    // refresh with a cookie that the browser has already discarded.
    let sessionPayload: SessionTokenPayload;

    try {
      sessionPayload = await SessionManager.verifySessionToken(rawToken);
    } catch {
      return {
        error: 'Session cookie is invalid or expired. User must sign in again.',
        redirectToSignIn: true,
        success: false,
      };
    }

    if (!sessionPayload.refreshToken) {
      return {
        error: 'No refresh token in session. User must sign in again.',
        redirectToSignIn: true,
        success: false,
      };
    }

    // Read Asgardeo client config to obtain baseUrl, clientId, and clientSecret.
    // The SDK singleton is always available in server action context (Node.js runtime).
    const client: AsgardeoNextClient = AsgardeoNextClient.getInstance();

    if (!client.isInitialized) {
      return {error: 'Asgardeo client is not initialized', success: false};
    }

    const config: AsgardeoNextConfig = await client.getConfiguration();
    const baseUrl: string | undefined = (config as any)?.baseUrl;
    const clientId: string | undefined = (config as any)?.clientId;
    const clientSecret: string | undefined = (config as any)?.clientSecret;

    if (!baseUrl || !clientId || !clientSecret) {
      return {
        error: 'Asgardeo configuration is incomplete (baseUrl, clientId, or clientSecret missing)',
        success: false,
      };
    }

    const refreshResult: TokenRefreshResult | null = await performTokenRefresh({
      baseUrl,
      clientId,
      clientSecret,
      refreshToken: sessionPayload.refreshToken,
      scopes: Array.isArray(sessionPayload.scopes)
        ? sessionPayload.scopes.join(' ')
        : (sessionPayload.scopes as string | undefined),
    });

    if (!refreshResult) {
      // null means the refresh token was rejected (expired, revoked, or network error).
      // Clear the stale session so the middleware stops treating this as authenticated.
      cookieStore.delete(sessionCookieName);

      return {
        error: 'Refresh token is expired or revoked. User must sign in again.',
        redirectToSignIn: true,
        success: false,
      };
    }

    // Build a new session JWT with the fresh tokens, preserving all identity fields
    // (sub, sessionId, organizationId, scopes) from the previous session.
    const newSessionJwt: string = await SessionManager.createSessionToken(
      refreshResult.accessToken,
      sessionPayload.sub as string,
      sessionPayload.sessionId,
      refreshResult.scope ?? (Array.isArray(sessionPayload.scopes)
        ? sessionPayload.scopes.join(' ')
        : (sessionPayload.scopes as string)),
      sessionPayload.organizationId,
      refreshResult.expiresIn,
      // Prefer the new refresh token (rotation); fall back to the original if the
      // server does not rotate.
      refreshResult.refreshToken ?? sessionPayload.refreshToken,
    );

    cookieStore.set(sessionCookieName, newSessionJwt, SessionManager.getSessionCookieOptions());

    logger.debug('[refreshTokenAction] Access token refreshed successfully.');

    return {success: true};
  } catch (error) {
    logger.error(
      `[refreshTokenAction] Unexpected error during token refresh: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );

    return {
      error: error instanceof Error ? error.message : 'Token refresh failed',
      success: false,
    };
  }
};

export default refreshTokenAction;
