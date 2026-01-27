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

import {Context, createContext} from 'react';
import {Organization, TokenResponse} from '@asgardeo/browser';

/**
 * Represents a sub-organization session managed by the parent provider.
 */
export interface SubOrgSession {
  /**
   * The organization this session belongs to.
   */
  organization: Organization;
  /**
   * The instance ID for this sub-org session.
   */
  instanceId: number;
  /**
   * Whether this sub-org session is active.
   */
  isActive: boolean;
  /**
   * Timestamp when this session was created.
   */
  createdAt: number;
}

/**
 * Props interface for the MultiOrg context.
 * This context enables parent-child communication between AsgardeoProvider instances
 * for multi-organization workflows.
 */
export interface MultiOrgContextProps {
  /**
   * Indicates if this is the root/parent provider.
   */
  isRootProvider: boolean;
  /**
   * The instance ID of the parent provider.
   */
  parentInstanceId: number;
  /**
   * Whether the parent provider is signed in.
   */
  isParentSignedIn: boolean;
  /**
   * List of organizations the user belongs to (from parent).
   */
  availableOrganizations: Organization[];
  /**
   * The current organization of the parent provider.
   */
  parentOrganization: Organization | null;
  /**
   * Map of active sub-organization sessions.
   * Key is the organization ID, value is the session info.
   */
  subOrgSessions: Map<string, SubOrgSession>;
  /**
   * Function to register a new sub-organization provider with the parent.
   * Returns the token response for the sub-organization.
   *
   * @param organizationId - The ID of the organization to switch to.
   * @param instanceId - The instance ID for the sub-org provider.
   * @returns Promise resolving to the token response.
   */
  registerSubOrgProvider: (organizationId: string, instanceId: number) => Promise<TokenResponse | Response>;
  /**
   * Function to unregister a sub-organization provider.
   *
   * @param organizationId - The ID of the organization to unregister.
   */
  unregisterSubOrgProvider: (organizationId: string) => void;
  /**
   * Function to validate if user belongs to a specific organization.
   *
   * @param organizationId - The ID of the organization to validate.
   * @returns Whether the user belongs to the organization.
   */
  validateOrganizationMembership: (organizationId: string) => boolean;
  /**
   * Get the access token for the parent provider.
   * Sub-org providers use this to exchange for their org-specific token.
   *
   * @returns Promise resolving to the parent's access token.
   */
  getParentAccessToken: () => Promise<string>;
  /**
   * Triggers sign out for all sub-org providers when parent signs out.
   */
  signOutAllSubOrgs: () => void;
  /**
   * Callback to notify when parent signs out.
   * Sub-org providers should subscribe to this.
   */
  onParentSignOut: (callback: () => void) => () => void;
}

/**
 * Context object for managing multi-organization workflows.
 * Enables nested AsgardeoProvider instances to communicate with the parent provider.
 */
const MultiOrgContext: Context<MultiOrgContextProps | null> = createContext<MultiOrgContextProps | null>(null);

MultiOrgContext.displayName = 'MultiOrgContext';

export default MultiOrgContext;
