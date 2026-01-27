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

import {AsgardeoBrowserConfig} from '@asgardeo/browser';

/**
 * Configuration for multi-organization workflows.
 * Use this when you need to work across multiple organizations concurrently.
 */
export interface MultiOrgConfig {
  /**
   * Enable multi-organization workflow mode.
   * When enabled, this provider can act as a parent for sub-organization providers.
   * @default false
   */
  enabled?: boolean;
  /**
   * The organization ID to switch to when this provider acts as a sub-org provider.
   * Required when `isSubOrgProvider` is true.
   */
  targetOrganizationId?: string;
  /**
   * Indicates if this provider is a sub-organization provider (nested under a parent).
   * When true, this provider will obtain its token by exchanging with the parent's token.
   * @default false
   */
  isSubOrgProvider?: boolean;
  /**
   * Callback fired when the sub-org provider successfully initializes.
   */
  onSubOrgInitialized?: () => void;
  /**
   * Callback fired when there's an error initializing the sub-org provider.
   */
  onSubOrgError?: (error: Error) => void;
  /**
   * Whether to automatically clear this sub-org session when the parent signs out.
   * @default true
   */
  clearOnParentSignOut?: boolean;
}

export interface AsgardeoReactConfig extends AsgardeoBrowserConfig {
  /**
   * Optional instance ID for multi-auth context support.
   * Use this when you need multiple authentication contexts in the same application.
   * Defaults to 0 for backward compatibility.
   */
  instanceId?: number;
  /**
   * Configuration for multi-organization workflows.
   * Use this to enable working across multiple organizations concurrently.
   *
   * @example
   * ```tsx
   * // Parent provider (root organization)
   * <AsgardeoProvider
   *   baseUrl="https://api.asgardeo.io"
   *   clientId="your-client-id"
   *   multiOrg={{ enabled: true }}
   * >
   *   <App />
   * </AsgardeoProvider>
   *
   * // Sub-organization provider (nested)
   * <AsgardeoProvider
   *   baseUrl="https://api.asgardeo.io"
   *   clientId="your-client-id"
   *   instanceId={1}
   *   multiOrg={{
   *     isSubOrgProvider: true,
   *     targetOrganizationId: "sub-org-id"
   *   }}
   * >
   *   <SubOrgComponent />
   * </AsgardeoProvider>
   * ```
   */
  multiOrg?: MultiOrgConfig;
}