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

import { FC, PropsWithChildren, useEffect, useRef } from "react";
import AsgardeoProvider, { AsgardeoProviderProps } from "../../contexts/Asgardeo/AsgardeoProvider";
import useAsgardeo from "../../contexts/Asgardeo/useAsgardeo";
import { Organization } from "packages/javascript/dist";

interface OrganizationContextProps extends Omit<AsgardeoProviderProps, 'organizationChain' | 'baseUrl'> {
  /**
   * Instance ID for this organization context. Must be unique across the app if multiple contexts are used.
   */
  instanceId: number;
  /**
   * ID of the organization to authenticate with
   */
  targetOrganizationId: string;

  /**
   * Optional source instance ID. If not provided, immediate parent provider is used as source.
   */
  sourceInstanceId?: number;
  /**
   * Optional base URL for the organization context. If not provided, it will default to the source provider's base URL.
   */
  baseUrl?: string;
}

interface OrganizationContextHandlerProps {
  /**
   * ID of the organization to authenticate with
   */
  targetOrganizationId: string;

  /**
   * Whether the source provider is signed in
   */
  isSourceSignedIn: boolean;

  /**
   * Children to render
   */
  children: React.ReactNode;
}

const OrganizationContextHandler: FC<OrganizationContextHandlerProps> = ({
  targetOrganizationId,
  isSourceSignedIn,
  children,
}) => {
  const { isInitialized, isSignedIn, switchOrganization, isLoading } = useAsgardeo();
  const hasAuthenticatedRef = useRef(false);
  const isAuthenticatingRef = useRef(false);

  /**
   * Handle the organization switch when:
   * - Current instance is initialized and NOT signed in
   * - Source provider IS signed in
   * Uses the `switchOrganization` function from the Asgardeo context.
   */
  useEffect(() => {
    const performOrganizationSwitch = async () => {
      // Prevent multiple authentication attempts
      if (hasAuthenticatedRef.current || isAuthenticatingRef.current) {
        return;
      }

      // Wait for initialization to complete
      if (!isInitialized || isLoading) {
        return;
      }

      // Only proceed if user is not already signed in to this instance
      if (isSignedIn) {
        hasAuthenticatedRef.current = true;
        return;
      }

      // CRITICAL: Only proceed if source provider is signed in
      if (!isSourceSignedIn) {
        return;
      }

      try {
        isAuthenticatingRef.current = true;
        hasAuthenticatedRef.current = true;

        // Build the organization object for authentication
        const targetOrganization: Organization = {
          id: targetOrganizationId,
          name: '', // Name will be populated after authentication
          orgHandle: '', // Will be populated after authentication
        };

        // Call the switchOrganization API from context (handles token exchange)
        await switchOrganization(targetOrganization);

      } catch (error) {
        console.error('Linked organization authentication failed:', error);
        
        // Reset the flag to allow retry
        hasAuthenticatedRef.current = false;
      } finally {
        isAuthenticatingRef.current = false;
      }
    };

    performOrganizationSwitch();
  }, [isInitialized, isSignedIn, isLoading, isSourceSignedIn, targetOrganizationId, switchOrganization]);

  return <>{children}</>;
};

const OrganizationContext: FC<PropsWithChildren<OrganizationContextProps>> = ({
  instanceId,
  baseUrl,
  clientId,
  afterSignInUrl,
  afterSignOutUrl,
  targetOrganizationId,
  sourceInstanceId,
  scopes,
  children,
  extensions,
  ...rest
}) => {
  // Get the source provider's signed-in status
  const { 
    isSignedIn: isSourceSignedIn,
    instanceId: sourceInstanceIdFromContext, 
    baseUrl: sourceBaseUrl, 
    clientId: sourceClientId
  } = useAsgardeo();

  return (
    <AsgardeoProvider
      instanceId={instanceId}
      baseUrl={baseUrl || sourceBaseUrl}
      clientId={clientId || sourceClientId}
      afterSignInUrl={afterSignInUrl}
      afterSignOutUrl={afterSignOutUrl}
      scopes={scopes}
      organizationChain={{
        sourceInstanceId: sourceInstanceId || sourceInstanceIdFromContext,
        targetOrganizationId: targetOrganizationId,
      }}
      extensions={extensions}
      {...rest}
    >
      <OrganizationContextHandler 
        targetOrganizationId={targetOrganizationId}
        isSourceSignedIn={isSourceSignedIn}
      >
        {children}
      </OrganizationContextHandler>
    </AsgardeoProvider>
  );
};

export default OrganizationContext;