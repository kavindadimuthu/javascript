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

'use client';

import {Organization, TokenResponse} from '@asgardeo/node';
import {useRouter} from 'next/navigation';
import {FC, useEffect, useRef} from 'react';
import useAsgardeo from '../../../contexts/Asgardeo/useAsgardeo';

export interface OrganizationContextControllerProps {
  /**
   * Children to render inside the organization context.
   */
  children: React.ReactNode;
  /**
   * Whether the source (parent) provider is currently signed in.
   * Passed from the server component at render time.
   */
  isParentSignedIn: boolean;
  /**
   * ID of the target organization to authenticate with.
   */
  targetOrganizationId: string;
  /**
   * Bound server action to perform the organization context switch.
   * Pre-bound with childInstanceId and sourceInstanceId by the server component.
   */
  switchOrganizationContext: (organization: Organization) => Promise<TokenResponse>;
}

/**
 * Client-side controller for the organization context.
 *
 * Detects when the parent is signed in but this child org context is not, then
 * automatically triggers a server-side organization_switch token exchange using
 * the provided server action. After the exchange succeeds it calls `router.refresh()`
 * to cause Next.js to re-render the server component tree with the new session.
 */
const OrganizationContextController: FC<OrganizationContextControllerProps> = ({
  targetOrganizationId,
  isParentSignedIn,
  switchOrganizationContext,
  children,
}: OrganizationContextControllerProps) => {
  const {isSignedIn, isLoading} = useAsgardeo();
  const router = useRouter();
  const hasAuthenticatedRef = useRef<boolean>(false);
  const isAuthenticatingRef = useRef<boolean>(false);

  /**
   * Trigger the organization context switch when:
   * - The parent provider IS signed in.
   * - This child context is NOT yet signed in.
   * - No switch is currently in progress.
   */
  useEffect(() => {
    const performOrganizationContextSwitch = async (): Promise<void> => {
      // Prevent multiple simultaneous or duplicate switch attempts.
      if (hasAuthenticatedRef.current || isAuthenticatingRef.current) {
        return;
      }

      // Wait until the client-side loading state resolves.
      if (isLoading) {
        return;
      }

      // If this child context is already signed in, nothing to do.
      if (isSignedIn) {
        hasAuthenticatedRef.current = true;

        return;
      }

      // Only proceed if the parent provider is signed in.
      if (!isParentSignedIn) {
        return;
      }

      try {
        isAuthenticatingRef.current = true;

        await switchOrganizationContext({
          id: targetOrganizationId,
          name: '',
          orgHandle: '',
        });

        hasAuthenticatedRef.current = true;

        // Refresh the page so Next.js re-renders the server component tree with the
        // newly created child session cookie.
        router.refresh();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[OrganizationContextController] Organization context switch failed:', error);

        // Reset so the switch can be retried on the next render cycle.
        hasAuthenticatedRef.current = false;
      } finally {
        isAuthenticatingRef.current = false;
      }
    };

    performOrganizationContextSwitch();
  }, [isSignedIn, isLoading, isParentSignedIn, targetOrganizationId, switchOrganizationContext, router]);

  return <>{children}</>;
};

export default OrganizationContextController;
