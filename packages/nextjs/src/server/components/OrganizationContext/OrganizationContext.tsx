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

import {BrandingPreference, Organization, User, UserProfile} from '@asgardeo/node';
import {AsgardeoProviderProps} from '@asgardeo/react';
import {FC, PropsWithChildren, ReactElement} from 'react';
import createOrganization from '../../actions/createOrganization';
import getAllOrganizations from '../../actions/getAllOrganizations';
import getBrandingPreference from '../../actions/getBrandingPreference';
import getCurrentOrganizationAction from '../../actions/getCurrentOrganizationAction';
import getMyOrganizations from '../../actions/getMyOrganizations';
import getSessionId from '../../actions/getSessionId';
import getSessionPayload from '../../actions/getSessionPayload';
import getUserAction from '../../actions/getUserAction';
import getUserProfileAction from '../../actions/getUserProfileAction';
import handleOAuthCallbackAction from '../../actions/handleOAuthCallbackAction';
import isSignedIn from '../../actions/isSignedIn';
import signInAction from '../../actions/signInAction';
import signOutAction from '../../actions/signOutAction';
import signUpAction from '../../actions/signUpAction';
import switchOrganization from '../../actions/switchOrganization';
import switchOrganizationContext from '../../actions/switchOrganizationContext';
import updateUserProfileAction from '../../actions/updateUserProfileAction';
import AsgardeoNextClient from '../../../AsgardeoNextClient';
import AsgardeoClientProvider from '../../../client/contexts/Asgardeo/AsgardeoProvider.js';
import OrganizationContextController from '../../../client/components/control/OrganizationContext/OrganizationContextController';
import {AsgardeoNextConfig} from '../../../models/config';
import decorateConfigWithNextEnv from '../../../utils/decorateConfigWithNextEnv';
import logger from '../../../utils/logger';
import {SessionTokenPayload} from '../../../utils/SessionManager';

/**
 * Props for the OrganizationContext server component.
 */
export interface OrganizationContextProps extends Omit<Partial<AsgardeoProviderProps>, 'organizationChain' | 'baseUrl'> {
  /**
   * Optional base URL override for the child organization context.
   * If not provided, the parent (source) instance's baseUrl is used.
   */
  baseUrl?: string;
  /**
   * Optional client ID override for the child organization context.
   * If not provided, the parent (source) instance's clientId is used.
   */
  clientId?: string;
  /**
   * Unique instance ID for this child organization context.
   * Must be different from the parent's instanceId (default: 0) and from any other
   * OrganizationContext instanceIds used in the same application.
   */
  instanceId: number;
  /**
   * Optional instance ID of the source (parent) provider to authenticate from.
   * Defaults to 0 (the root-level AsgardeoProvider).
   */
  sourceInstanceId?: number;
  /**
   * The ID of the child organization to authenticate with.
   */
  targetOrganizationId: string;
}

/**
 * A server component that establishes an independent authentication context for a child organization.
 *
 * This component mirrors the React SDK's `OrganizationContext` for Next.js App Router. It:
 * 1. Initializes a separate `AsgardeoNextClient` instance for the child organization.
 * 2. Checks if the parent (source) provider is already signed in.
 * 3. Checks if this child context already has a valid session (from a previous switch).
 * 4. If the parent is signed in but the child isn't, delegates a client-side controller to
 *    invoke the `switchOrganizationContext` server action, which performs an `organization_switch`
 *    token exchange and stores the result in a dedicated session cookie for this instance.
 * 5. If the child is already signed in, fetches its user data and renders children with a
 *    fully populated `AsgardeoClientProvider` scoped to this child org.
 *
 * @example
 * ```tsx
 * // In a Next.js Server Component:
 * import {AsgardeoProvider, OrganizationContext} from '@asgardeo/auth-nextjs/server';
 *
 * export default function Layout({children}) {
 *   return (
 *     <AsgardeoProvider baseUrl="..." clientId="..." instanceId={0}>
 *       <OrganizationContext instanceId={1} targetOrganizationId="org-abc-123">
 *         {children}
 *       </OrganizationContext>
 *     </AsgardeoProvider>
 *   );
 * }
 * ```
 */
const OrganizationContext: FC<PropsWithChildren<OrganizationContextProps>> = async ({
  instanceId,
  sourceInstanceId = 0,
  targetOrganizationId,
  baseUrl: baseUrlOverride,
  clientId: clientIdOverride,
  children,
  ...rest
}: PropsWithChildren<OrganizationContextProps>): Promise<ReactElement> => {
  // ── 1. Resolve the source (parent) config ─────────────────────────────────
  const sourceClient: AsgardeoNextClient = AsgardeoNextClient.getInstance(sourceInstanceId);

  if (!sourceClient.isInitialized) {
    logger.warn(
      `[OrganizationContext] Source instance (instanceId: ${sourceInstanceId}) is not initialized. ` +
        'Make sure OrganizationContext is nested inside an initialized AsgardeoProvider.',
    );

    return <></>;
  }

  // Safely read the source client's configuration. `getConfiguration()` internally calls
  // `this.asgardeo.getConfigData()` which accesses `authCore`. Due to a timing window
  // in `AsgardeoNextClient.initialize()` where `isInitialized` is set to `true` before
  // the underlying legacy client finishes setting up `authCore`, concurrent requests can
  // reach this point with `isInitialized = true` but `authCore` still unset. A try/catch
  // with an env-var fallback (via decorateConfigWithNextEnv) handles this gracefully.
  let sourceConfig: Partial<AsgardeoNextConfig> = {};

  try {
    sourceConfig = ((await sourceClient.getConfiguration()) as Partial<AsgardeoNextConfig>) ?? {};
  } catch {
    logger.warn(
      `[OrganizationContext] Could not read source instance config (instanceId: ${sourceInstanceId}). ` +
        'Falling back to environment variables.',
    );
    sourceConfig = decorateConfigWithNextEnv({} as AsgardeoNextConfig);
  }

  const resolvedBaseUrl: string = (baseUrlOverride ?? sourceConfig.baseUrl) as string;
  const resolvedClientId: string = (clientIdOverride ?? sourceConfig.clientId) as string;

  // ── 2. Initialize the child org's AsgardeoNextClient ──────────────────────
  const childClient: AsgardeoNextClient = AsgardeoNextClient.getInstance(instanceId);

  try {
    await childClient.initialize({
      ...sourceConfig,
      baseUrl: resolvedBaseUrl,
      clientId: resolvedClientId,
      organizationChain: {
        sourceInstanceId,
        targetOrganizationId,
      },
      ...rest,
    } as AsgardeoNextConfig);
  } catch (error) {
    logger.error(
      `[OrganizationContext] Failed to initialize child client (instanceId: ${instanceId}):`,
      error?.toString(),
    );
  }

  // ── 3. Resolve parent sign-in state ───────────────────────────────────────
  const sourceSessionPayload: SessionTokenPayload | undefined = await getSessionPayload(sourceInstanceId);
  const sourceSessionId: string =
    sourceSessionPayload?.sessionId || (await getSessionId(sourceInstanceId)) || '';
  const isParentSignedIn: boolean = sourceSessionPayload
    ? true
    : await isSignedIn(sourceSessionId, sourceInstanceId);

  // ── 4. Resolve child sign-in state ────────────────────────────────────────
  const childSessionPayload: SessionTokenPayload | undefined = await getSessionPayload(instanceId);
  const childSessionId: string =
    childSessionPayload?.sessionId || (await getSessionId(instanceId)) || '';
  const isChildSignedIn: boolean = childSessionPayload ? true : await isSignedIn(childSessionId, instanceId);

  // ── 5. Fetch child org data if signed in ──────────────────────────────────
  let user: User = {};
  let userProfile: UserProfile = {
    flattenedProfile: {},
    profile: {},
    schemas: [],
  };
  let currentOrganization: Organization = {
    id: '',
    name: '',
    orgHandle: '',
  };
  let myOrganizations: Organization[] = [];
  let brandingPreference: BrandingPreference | null = null;

  if (isChildSignedIn) {
    try {
      const userResponse = await getUserAction(childSessionId, instanceId);
      const userProfileResponse = await getUserProfileAction(childSessionId, instanceId);
      const currentOrganizationResponse = await getCurrentOrganizationAction(childSessionId, instanceId);

      if (childSessionId) {
        myOrganizations = await getMyOrganizations({}, childSessionId, instanceId);
      }

      user = userResponse.data?.user || {};
      userProfile = userProfileResponse.data?.userProfile ?? userProfile;
      currentOrganization = currentOrganizationResponse?.data?.organization as Organization;
    } catch (error) {
      logger.error(
        `[OrganizationContext] Failed to fetch child org user data (instanceId: ${instanceId}):`,
        error,
      );

      user = {};
      userProfile = {flattenedProfile: {}, profile: {}, schemas: []};
      currentOrganization = {id: '', name: '', orgHandle: ''};
      myOrganizations = [];
    }

    // Optionally fetch branding for the child org.
    if (sourceConfig?.preferences?.theme?.inheritFromBranding !== false) {
      try {
        brandingPreference = await getBrandingPreference(
          {
            baseUrl: resolvedBaseUrl,
            locale: 'en-US',
            name: sourceConfig.applicationId || sourceConfig.organizationHandle,
            type: sourceConfig.applicationId ? 'APP' : 'ORG',
          },
          childSessionId,
        );
      } catch {
        // Non-fatal; continue without branding.
      }
    }
  }

  // ── 6. Bind server actions to the child instance ──────────────────────────
  const boundSignIn = signInAction.bind(null, instanceId);
  const boundSignOut = signOutAction.bind(null, instanceId);
  const boundSignUp = signUpAction.bind(null, instanceId);
  const boundSwitchOrganization = switchOrganization.bind(null, instanceId);
  const boundGetAllOrganizations = getAllOrganizations.bind(null, instanceId);
  const boundCreateOrganization = createOrganization.bind(null, instanceId);
  const boundUpdateUserProfile = updateUserProfileAction.bind(null, instanceId);

  // Pre-bind the organization context switch action with all params resolved at render time
  // (instanceIds + the resolved child org config). Passing config here avoids calling
  // `getConfiguration()` inside the action, which is vulnerable to the authCore race condition.
  const resolvedScopes: string = Array.isArray(sourceConfig?.scopes)
    ? (sourceConfig.scopes as string[]).join(' ')
    : typeof sourceConfig?.scopes === 'string' && sourceConfig.scopes
      ? (sourceConfig.scopes as string)
      : 'openid profile';

  const boundSwitchOrganizationContext = switchOrganizationContext.bind(null, instanceId, sourceInstanceId, {
    baseUrl: resolvedBaseUrl,
    clientId: resolvedClientId,
    clientSecret: (sourceConfig as any)?.clientSecret,
    scopes: resolvedScopes,
  });

  // Bind handleOAuthCallbackAction for the child instance.
  // OrganizationContext does not participate in the OAuth redirect flow directly
  // (org switch happens via token exchange), but AsgardeoClientProvider requires this prop.
  const boundHandleOAuthCallback = handleOAuthCallbackAction.bind(null, instanceId);

  return (
    <AsgardeoClientProvider
      organizationHandle={sourceConfig?.organizationHandle}
      applicationId={sourceConfig?.applicationId}
      baseUrl={resolvedBaseUrl}
      clientId={resolvedClientId}
      signIn={boundSignIn}
      signOut={boundSignOut}
      signUp={boundSignUp}
      handleOAuthCallback={boundHandleOAuthCallback}
      signInUrl={sourceConfig?.signInUrl}
      signUpUrl={sourceConfig?.signUpUrl}
      preferences={sourceConfig?.preferences}
      user={user}
      currentOrganization={currentOrganization}
      userProfile={userProfile}
      updateProfile={boundUpdateUserProfile}
      isSignedIn={isChildSignedIn}
      myOrganizations={myOrganizations}
      getAllOrganizations={boundGetAllOrganizations}
      switchOrganization={boundSwitchOrganization}
      brandingPreference={brandingPreference}
      createOrganization={boundCreateOrganization}
      instanceId={instanceId}
    >
      <OrganizationContextController
        isParentSignedIn={isParentSignedIn}
        targetOrganizationId={targetOrganizationId}
        switchOrganizationContext={boundSwitchOrganizationContext}
      >
        {children}
      </OrganizationContextController>
    </AsgardeoClientProvider>
  );
};

export default OrganizationContext;
