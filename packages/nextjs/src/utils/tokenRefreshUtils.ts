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

/**
 * Result of a successful token refresh against the Asgardeo token endpoint.
 */
export interface TokenRefreshResult {
  /** New OAuth access token */
  accessToken: string;
  /** How many seconds until the new access token expires */
  expiresIn: number;
  /** New refresh token (rotation). May be absent if the server does not rotate. */
  refreshToken?: string;
  /** Space-separated scopes granted for the new access token */
  scope?: string;
}

/**
 * Parameters required to perform a refresh_token grant against Asgardeo.
 */
export interface PerformTokenRefreshParams {
  /** The Asgardeo base URL, e.g. https://api.asgardeo.io/t/{org-handle} */
  baseUrl: string;
  /** OAuth client ID */
  clientId: string;
  /** OAuth client secret */
  clientSecret: string;
  /** The refresh token received at sign-in */
  refreshToken: string;
  /** Optional space-separated scopes to request (defaults to the original scopes) */
  scopes?: string;
}

/**
 * Perform an OAuth refresh_token grant against the Asgardeo token endpoint.
 *
 * This function is intentionally kept free of any Node.js-specific APIs so that
 * it can be safely imported and called from Next.js middleware (Edge Runtime) as
 * well as from server actions (Node.js runtime).
 *
 * @param params - Refresh parameters
 * @returns The new token set, or null if the refresh failed (e.g. revoked token)
 */
export const performTokenRefresh = async (params: PerformTokenRefreshParams): Promise<TokenRefreshResult | null> => {
  const {baseUrl, clientId, clientSecret, refreshToken, scopes} = params;

  if (!baseUrl || !clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const tokenEndpoint: string = `${baseUrl}/oauth2/token`;

  const body: URLSearchParams = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    ...(scopes ? {scope: scopes} : {}),
  });

  // Encode client credentials as per RFC 6749 §2.3.1 (HTTP Basic Auth)
  const credentials: string = btoa(`${clientId}:${clientSecret}`);

  let response: Response;

  try {
    response = await fetch(tokenEndpoint, {
      body: body.toString(),
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  } catch {
    // Network error — cannot refresh, let callers fall back gracefully
    return null;
  }

  if (!response.ok) {
    // 400 invalid_grant means the refresh token is expired/revoked.
    // Any other 4xx/5xx — treat the same way: cannot refresh.
    return null;
  }

  let data: Record<string, unknown>;

  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }

  const newAccessToken: string | undefined = (data['access_token'] ?? data['accessToken']) as string | undefined;

  if (!newAccessToken) {
    return null;
  }

  return {
    accessToken: newAccessToken,
    expiresIn: (data['expires_in'] as number | undefined) ?? 3600,
    refreshToken: (data['refresh_token'] ?? data['refreshToken']) as string | undefined,
    scope: data['scope'] as string | undefined,
  };
};
