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
import SessionManager, {SessionTokenPayload} from '../../utils/SessionManager';
import refreshTokenAction from './refreshTokenAction';

/**
 * Get a valid access token from the session cookie.
 *
 * If the stored access token is within the refresh threshold window (default 5 minutes
 * before expiry), this function will proactively call refreshTokenAction() to obtain
 * a new access token before returning it. This guarantees that the token returned
 * will not expire mid-request when used in API calls made by server components or
 * server actions.
 *
 * @returns The access token if a valid session exists, undefined otherwise
 */
const getAccessToken = async (): Promise<string | undefined> => {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  const sessionCookieName: string = SessionManager.getSessionCookieName();

  const readSession = async (): Promise<SessionTokenPayload | undefined> => {
    const rawToken: string | undefined = cookieStore.get(sessionCookieName)?.value;

    if (!rawToken) return undefined;

    try {
      return await SessionManager.verifySessionToken(rawToken);
    } catch {
      return undefined;
    }
  };

  let sessionPayload: SessionTokenPayload | undefined = await readSession();

  if (!sessionPayload) {
    return undefined;
  }

  const now: number = Math.floor(Date.now() / 1000);
  const {accessTokenExpiresAt, refreshToken} = sessionPayload;

  // Determine whether the access token needs to be refreshed.
  // - accessTokenExpired:  the token is already past its expiry
  // - nearExpiry:          the token will expire within REFRESH_THRESHOLD_SECONDS (5 min)
  //
  // We only attempt a refresh if a refresh token is present in the session.
  const accessTokenExpired: boolean = !!accessTokenExpiresAt && accessTokenExpiresAt <= now;
  const nearExpiry: boolean =
    !!accessTokenExpiresAt && accessTokenExpiresAt - now < SessionManager.REFRESH_THRESHOLD_SECONDS;

  if ((accessTokenExpired || nearExpiry) && refreshToken) {
    const result = await refreshTokenAction();

    if (result.success) {
      // Re-read the cookie: refreshTokenAction has already overwritten it with
      // fresh tokens. We must read again so we return the NEW access token.
      sessionPayload = await readSession();
    } else if (accessTokenExpired) {
      // The token is expired AND the refresh failed — the user must sign in again.
      return undefined;
    }
    // If near-expiry refresh fails but the token is still technically valid we
    // fall through and return the current (still-valid) access token.
  }

  return sessionPayload?.['accessToken'] as string | undefined;
};

export default getAccessToken;
