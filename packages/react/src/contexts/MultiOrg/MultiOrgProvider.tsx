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

import {FC, PropsWithChildren, ReactElement, useCallback, useMemo, useRef, useState} from 'react';
import {Organization, TokenResponse, AsgardeoRuntimeError} from '@asgardeo/browser';
import MultiOrgContext, {MultiOrgContextProps, SubOrgSession} from './MultiOrgContext';

/**
 * Props for the MultiOrgProvider component.
 */
export interface MultiOrgProviderProps {
  /**
   * The instance ID of this provider (parent).
   */
  instanceId: number;
  /**
   * Whether the parent is currently signed in.
   */
  isParentSignedIn: boolean;
  /**
   * List of organizations the user belongs to.
   */
  availableOrganizations: Organization[];
  /**
   * The current organization of the parent provider.
   */
  parentOrganization: Organization | null;
  /**
   * Function to get the parent's access token.
   */
  getParentAccessToken: () => Promise<string>;
  /**
   * Function to exchange token for a sub-organization.
   */
  exchangeTokenForOrg: (organizationId: string) => Promise<TokenResponse | Response>;
}

/**
 * MultiOrgProvider component that manages multi-organization workflows.
 *
 * This provider acts as a bridge between parent and child AsgardeoProviders,
 * enabling nested providers to obtain organization-specific tokens through
 * token exchange with the parent provider.
 *
 * @example
 * ```tsx
 * // This is typically used internally by AsgardeoProvider when multiOrg.enabled is true
 * <MultiOrgProvider
 *   instanceId={0}
 *   isParentSignedIn={isSignedIn}
 *   availableOrganizations={myOrganizations}
 *   parentOrganization={currentOrganization}
 *   getParentAccessToken={getAccessToken}
 *   exchangeTokenForOrg={handleExchangeForOrg}
 * >
 *   {children}
 * </MultiOrgProvider>
 * ```
 */
const MultiOrgProvider: FC<PropsWithChildren<MultiOrgProviderProps>> = ({
  children,
  instanceId,
  isParentSignedIn,
  availableOrganizations,
  parentOrganization,
  getParentAccessToken,
  exchangeTokenForOrg,
}: PropsWithChildren<MultiOrgProviderProps>): ReactElement => {
  const [subOrgSessions, setSubOrgSessions] = useState<Map<string, SubOrgSession>>(new Map());
  const signOutCallbacksRef = useRef<Set<() => void>>(new Set());

  /**
   * Validates if the user belongs to a specific organization.
   */
  const validateOrganizationMembership = useCallback(
    (organizationId: string): boolean => {
      if (!availableOrganizations || availableOrganizations.length === 0) {
        return false;
      }
      return availableOrganizations.some(org => org.id === organizationId);
    },
    [availableOrganizations],
  );

  /**
   * Registers a new sub-organization provider.
   * This is called when a nested AsgardeoProvider with isSubOrgProvider=true mounts.
   */
  const registerSubOrgProvider = useCallback(
    async (organizationId: string, subInstanceId: number): Promise<TokenResponse | Response> => {
      // Validate parent is signed in
      if (!isParentSignedIn) {
        throw new AsgardeoRuntimeError(
          'Parent provider must be signed in before registering a sub-organization provider',
          'MultiOrg-RegisterSubOrg-NotSignedIn',
          'react',
          'The parent AsgardeoProvider must complete sign-in before sub-organization providers can be initialized.',
        );
      }

      // Validate organization membership
      if (!validateOrganizationMembership(organizationId)) {
        throw new AsgardeoRuntimeError(
          `User does not belong to organization: ${organizationId}`,
          'MultiOrg-RegisterSubOrg-InvalidOrg',
          'react',
          'The user is not a member of the specified organization. Ensure the user has access to this organization.',
        );
      }

      // Check if already registered
      if (subOrgSessions.has(organizationId)) {
        const existingSession = subOrgSessions.get(organizationId);
        if (existingSession?.isActive) {
          throw new AsgardeoRuntimeError(
            `Sub-organization provider for ${organizationId} is already registered`,
            'MultiOrg-RegisterSubOrg-AlreadyExists',
            'react',
            'A sub-organization provider for this organization is already active. Unregister it first or use a different organization.',
          );
        }
      }

      // Exchange token for the target organization
      const tokenResponse = await exchangeTokenForOrg(organizationId);

      // Find the organization details
      const organization = availableOrganizations.find(org => org.id === organizationId);

      // Register the session
      const session: SubOrgSession = {
        organization: organization!,
        instanceId: subInstanceId,
        isActive: true,
        createdAt: Date.now(),
      };

      setSubOrgSessions(prev => {
        const newMap = new Map(prev);
        newMap.set(organizationId, session);
        return newMap;
      });

      return tokenResponse;
    },
    [isParentSignedIn, validateOrganizationMembership, exchangeTokenForOrg, availableOrganizations, subOrgSessions],
  );

  /**
   * Unregisters a sub-organization provider.
   */
  const unregisterSubOrgProvider = useCallback((organizationId: string): void => {
    setSubOrgSessions(prev => {
      const newMap = new Map(prev);
      const session = newMap.get(organizationId);
      if (session) {
        // Mark as inactive instead of deleting to preserve history
        newMap.set(organizationId, {...session, isActive: false});
      }
      return newMap;
    });
  }, []);

  /**
   * Signs out all sub-organization providers.
   * Called when the parent provider signs out.
   */
  const signOutAllSubOrgs = useCallback((): void => {
    // Notify all subscribed callbacks
    signOutCallbacksRef.current.forEach(callback => {
      try {
        callback();
      } catch (error) {
        // Log error but continue notifying other callbacks
        console.error('Error in sub-org sign out callback:', error);
      }
    });

    // Clear all sessions
    setSubOrgSessions(new Map());
  }, []);

  /**
   * Subscribe to parent sign out events.
   * Returns an unsubscribe function.
   */
  const onParentSignOut = useCallback((callback: () => void): (() => void) => {
    signOutCallbacksRef.current.add(callback);
    return () => {
      signOutCallbacksRef.current.delete(callback);
    };
  }, []);

  const contextValue: MultiOrgContextProps = useMemo(
    () => ({
      isRootProvider: true,
      parentInstanceId: instanceId,
      isParentSignedIn,
      availableOrganizations,
      parentOrganization,
      subOrgSessions,
      registerSubOrgProvider,
      unregisterSubOrgProvider,
      validateOrganizationMembership,
      getParentAccessToken,
      signOutAllSubOrgs,
      onParentSignOut,
    }),
    [
      instanceId,
      isParentSignedIn,
      availableOrganizations,
      parentOrganization,
      subOrgSessions,
      registerSubOrgProvider,
      unregisterSubOrgProvider,
      validateOrganizationMembership,
      getParentAccessToken,
      signOutAllSubOrgs,
      onParentSignOut,
    ],
  );

  return <MultiOrgContext.Provider value={contextValue}>{children}</MultiOrgContext.Provider>;
};

export default MultiOrgProvider;
