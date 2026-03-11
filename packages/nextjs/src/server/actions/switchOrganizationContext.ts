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

import {AsgardeoAPIError, IdToken, Organization, TokenResponse, generateSessionId} from '@asgardeo/node';
import {decodeJwt} from 'jose';
import {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import {cookies} from 'next/headers';
import getAccessToken from './getAccessToken';
import getSessionId from './getSessionId';
import logger from '../../utils/logger';
import SessionManager from '../../utils/SessionManager';

/**
 * Configuration for the child organization context token exchange.
 * Passed explicitly from the server component at bind-time to avoid calling
 * `getConfiguration()` inside the action (which is prone to race conditions
 * due to `isInitialized` being set before `authCore` is ready).
 */
export interface OrganizationContextConfig {
  baseUrl: string;
  clientId: string;
  clientSecret?: string;
  scopes?: string;
}

/**
 * Server action that performs an organization context switch for multi-org scenarios.
 *
 * Unlike the regular `switchOrganization` action (which switches the current session to another org),
 * this action establishes an independent session for a child organization context by:
 * 1. Reading the source (parent) instance's access token from its session cookie.
 * 2. Using the explicitly-passed child org config (clientId, baseUrl, scopes) for the exchange.
 * 3. Making an `organization_switch` grant type token exchange directly.
 * 4. Storing the resulting token in the child instance's dedicated session cookie.
 *
 * The child org config is passed explicitly (via `.bind()` at render time) rather than
 * being read from `childClient.getConfiguration()` to avoid a race condition where
 * `AsgardeoNextClient.isInitialized` is `true` but the internal `authCore` is not yet set.
 *
 * @param childInstanceId - The instance ID of the child organization context.
 * @param sourceInstanceId - The instance ID of the source (parent) context whose token is used for exchange.
 * @param childOrgConfig - Resolved config for the child org (bound at render time).
 * @param organization - The target organization to switch to.
 * @returns The token response from the organization_switch grant.
 */
const switchOrganizationContext = async (
  childInstanceId: number,
  sourceInstanceId: number = 0,
  childOrgConfig: OrganizationContextConfig,
  organization: Organization,
): Promise<TokenResponse> => {
  try {
    const cookieStore: ReadonlyRequestCookies = await cookies();

    // Retrieve the parent (source) access token from their JWT session cookie.
    const sourceAccessToken: string | undefined = await getAccessToken(sourceInstanceId);

    if (!sourceAccessToken) {
      throw new Error(
        `Source instance (instanceId: ${sourceInstanceId}) access token not found. ` +
          'Ensure the parent AsgardeoProvider is signed in before rendering OrganizationContext.',
      );
    }

    // Validate required config (resolved and bound from OrganizationContext at render time).
    if (!childOrgConfig?.baseUrl || !childOrgConfig?.clientId) {
      throw new Error(
        `Child instance (instanceId: ${childInstanceId}) is missing required config (baseUrl / clientId). ` +
          'Ensure OrganizationContext is nested inside an initialized AsgardeoProvider or pass baseUrl and clientId explicitly.',
      );
    }

    // Get the source session ID so the child session can be correlated with the parent.
    const sourceSessionId: string | undefined = await getSessionId(sourceInstanceId);

    // Construct the token endpoint URL.
    const tokenEndpoint: string = `${childOrgConfig.baseUrl}/oauth2/token`;

    // Resolve scopes - use provided scopes or fall back to openid + profile.
    const scopes: string = childOrgConfig.scopes ?? 'openid profile';

    // Build the token exchange request body.
    const formData: URLSearchParams = new URLSearchParams({
      client_id: childOrgConfig.clientId,
      grant_type: 'organization_switch',
      scope: scopes,
      switching_organization: organization.id,
      token: sourceAccessToken,
    });

    if (childOrgConfig.clientSecret) {
      formData.set('client_secret', childOrgConfig.clientSecret);
    }

    logger.debug(
      `[switchOrganizationContext] Performing organization_switch token exchange to org: ${organization.id}`,
    );

    const response: Response = await fetch(tokenEndpoint, {
      body: formData.toString(),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      method: 'POST',
    });

    if (!response.ok) {
      const errorBody: string = await response.text();

      throw new Error(`Token exchange failed (${response.status}): ${errorBody}`);
    }

    const rawToken: any = await response.json();

    // Decode the returned ID token to extract user and organization claims.
    const idTokenPayload: IdToken = decodeJwt(rawToken.id_token) as unknown as IdToken;
    const userId: string = idTokenPayload['sub'] as string;
    const organizationId: string | undefined = (idTokenPayload['user_org'] ||
      idTokenPayload['organization_id']) as string | undefined;

    // Use the source session ID to correlate child and parent sessions, or generate a new one.
    const childSessionId: string = sourceSessionId ?? generateSessionId();

    // Sign and store the child instance session cookie.
    const sessionToken: string = await SessionManager.createSessionToken(
      rawToken.access_token,
      userId,
      childSessionId,
      rawToken.scope ?? scopes,
      organizationId,
    );

    cookieStore.set(
      SessionManager.getSessionCookieName(childInstanceId),
      sessionToken,
      SessionManager.getSessionCookieOptions(),
    );

    logger.debug(
      `[switchOrganizationContext] Organization context session established for instanceId: ${childInstanceId}`,
    );

    return {
      accessToken: rawToken.access_token,
      createdAt: Date.now(),
      expiresIn: rawToken.expires_in,
      idToken: rawToken.id_token,
      refreshToken: rawToken.refresh_token,
      scope: rawToken.scope,
      tokenType: rawToken.token_type,
    };
  } catch (error) {
    logger.error('[switchOrganizationContext] Failed to switch organization context:', error);

    throw new AsgardeoAPIError(
      `Failed to switch organization context: ${error instanceof Error ? error.message : String(error)}`,
      'switchOrganizationContext-ServerActionError-001',
      'nextjs',
      error instanceof AsgardeoAPIError ? error.statusCode : undefined,
    );
  }
};

export default switchOrganizationContext;
