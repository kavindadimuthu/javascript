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

import {AsgardeoRuntimeError, CookieConfig} from '@asgardeo/node';
import {SignJWT, jwtVerify, decodeJwt, JWTPayload} from 'jose';

/**
 * Session token payload interface
 */
export interface SessionTokenPayload extends JWTPayload {
  /** Unix timestamp when the OAuth access token expires (NOT the session cookie expiry) */
  accessTokenExpiresAt?: number;
  /** Expiration timestamp of the session JWT cookie itself */
  exp: number;
  /** Issued at timestamp */
  iat: number;
  /** Organization ID if applicable */
  organizationId?: string;
  /** OAuth refresh token for obtaining new access tokens without re-authentication */
  refreshToken?: string;
  /** OAuth scopes */
  scopes: string[];
  /** Session ID */
  sessionId: string;
  /** User ID */
  sub: string;
}

/**
 * Session management utility class for JWT-based session cookies
 */
class SessionManager {
  /**
   * Lifetime of the session cookie (the JWT itself).
   * Should be >= the refresh token lifetime so the cookie persists long enough
   * to use the refresh token. Default: 24 hours.
   */
  private static readonly DEFAULT_SESSION_EXPIRY_SECONDS: number = 24 * 3600;

  /**
   * Default OAuth access token lifetime in seconds when not provided by the server.
   * Used to set accessTokenExpiresAt in the session payload.
   */
  private static readonly DEFAULT_ACCESS_TOKEN_EXPIRY_SECONDS: number = 3600;

  /**
   * How many seconds before the access token expires to proactively refresh it.
   * A 5-minute window prevents tokens from expiring mid-request.
   */
  public static readonly REFRESH_THRESHOLD_SECONDS: number = 300;

  /**
   * Get the signing secret from environment variable
   * Throws error in production if not set
   */
  private static getSecret(): Uint8Array {
    const secret: string | undefined = process.env['ASGARDEO_SECRET'];

    if (!secret) {
      if (process.env['NODE_ENV'] === 'production') {
        throw new AsgardeoRuntimeError(
          'ASGARDEO_SECRET environment variable is required in production',
          'session-secret-required',
          'nextjs',
          'Set the ASGARDEO_SECRET environment variable with a secure random string',
        );
      }
      // Use a default secret for development (not secure)
      // eslint-disable-next-line no-console
      console.warn('Using default secret for development. Set ASGARDEO_SECRET for production!');
      return new TextEncoder().encode('development-secret-not-for-production');
    }

    return new TextEncoder().encode(secret);
  }

  /**
   * Create a temporary session cookie for login initiation
   */
  static async createTempSession(sessionId: string): Promise<string> {
    const secret: Uint8Array = this.getSecret();

    const jwt: string = await new SignJWT({
      sessionId,
      type: 'temp',
    })
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    return jwt;
  }

  /**
   * Create a session cookie with user information.
   *
   * The JWT expiry (exp) is tied to the session cookie lifetime (default 24h), NOT the
   * access token lifetime. The access token expiry is stored separately in
   * `accessTokenExpiresAt` so the middleware and getAccessToken() can decide when to
   * refresh without the session cookie becoming invalid.
   *
   * @param accessToken - The OAuth access token
   * @param userId - The authenticated user's ID (becomes JWT `sub`)
   * @param sessionId - Internal session identifier
   * @param scopes - Space-separated OAuth scopes
   * @param organizationId - Optional current organization ID
   * @param accessTokenExpiresIn - How long (seconds) the access token is valid. Default 3600.
   * @param refreshToken - Optional OAuth refresh token
   * @param sessionExpirySeconds - How long (seconds) the session cookie should live. Default 24h.
   */
  static async createSessionToken(
    accessToken: string,
    userId: string,
    sessionId: string,
    scopes: string,
    organizationId?: string,
    accessTokenExpiresIn: number = this.DEFAULT_ACCESS_TOKEN_EXPIRY_SECONDS,
    refreshToken?: string,
    sessionExpirySeconds: number = this.DEFAULT_SESSION_EXPIRY_SECONDS,
  ): Promise<string> {
    const secret: Uint8Array = this.getSecret();
    const nowSeconds: number = Math.floor(Date.now() / 1000);

    const jwt: string = await new SignJWT({
      accessToken,
      accessTokenExpiresAt: nowSeconds + accessTokenExpiresIn,
      organizationId,
      ...(refreshToken ? {refreshToken} : {}),
      scopes,
      sessionId,
      type: 'session',
    } as Omit<SessionTokenPayload, 'sub' | 'iat' | 'exp'>)
      .setProtectedHeader({alg: 'HS256'})
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(nowSeconds + sessionExpirySeconds)
      .sign(secret);

    return jwt;
  }

  /**
   * Verify and decode a session token
   */
  static async verifySessionToken(token: string): Promise<SessionTokenPayload> {
    try {
      const secret: Uint8Array = this.getSecret();
      const {payload} = await jwtVerify(token, secret);

      return payload as SessionTokenPayload;
    } catch (error) {
      throw new AsgardeoRuntimeError(
        `Invalid session token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'invalid-session-token',
        'nextjs',
        'Session token verification failed',
      );
    }
  }

  /**
   * Verify and decode a temporary session token
   */
  static async verifyTempSession(token: string): Promise<{sessionId: string}> {
    try {
      const secret: Uint8Array = this.getSecret();
      const {payload} = await jwtVerify(token, secret);

      if (payload['type'] !== 'temp') {
        throw new Error('Invalid token type');
      }

      return {sessionId: payload['sessionId'] as string};
    } catch (error) {
      throw new AsgardeoRuntimeError(
        `Invalid temporary session token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'invalid-temp-session-token',
        'nextjs',
        'Temporary session token verification failed',
      );
    }
  }

  /**
   * Decode a session token without verifying its signature or expiry.
   *
   * ONLY use this in the middleware to read the refresh token from a cookie that may
   * be expired. For any security-sensitive check, use verifySessionToken() instead.
   *
   * @param token - The raw JWT string from the session cookie
   * @returns The decoded payload, or null if the token cannot be parsed
   */
  static decodeSessionToken(token: string): SessionTokenPayload | null {
    try {
      return decodeJwt(token) as SessionTokenPayload;
    } catch {
      return null;
    }
  }

  /**
   * Get session cookie options.
   * maxAge matches DEFAULT_SESSION_EXPIRY_SECONDS (24h) so the browser keeps
   * the cookie alive long enough for refresh tokens to be used.
   */
  static getSessionCookieOptions(): {
    httpOnly: boolean;
    maxAge: number;
    path: string;
    sameSite: 'lax';
    secure: boolean;
  } {
    return {
      httpOnly: true,
      maxAge: this.DEFAULT_SESSION_EXPIRY_SECONDS,
      path: '/',
      sameSite: 'lax' as const,
      secure: process.env['NODE_ENV'] === 'production',
    };
  }

  /**
   * Get temporary session cookie options
   */
  static getTempSessionCookieOptions(): {
    httpOnly: boolean;
    maxAge: number;
    path: string;
    sameSite: 'lax';
    secure: boolean;
  } {
    return {
      httpOnly: true,
      maxAge: 15 * 60,
      path: '/',
      sameSite: 'lax' as const,
      secure: process.env['NODE_ENV'] === 'production',
    };
  }

  /**
   * Get session cookie name
   */
  static getSessionCookieName(): string {
    return CookieConfig.SESSION_COOKIE_NAME;
  }

  /**
   * Get temporary session cookie name
   */
  static getTempSessionCookieName(): string {
    return CookieConfig.TEMP_SESSION_COOKIE_NAME;
  }
}

export default SessionManager;
