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

import {useContext} from 'react';
import MultiOrgContext, {MultiOrgContextProps} from './MultiOrgContext';

/**
 * Hook to access the multi-organization context.
 *
 * This hook provides access to the parent provider's context when working
 * with nested AsgardeoProviders in multi-organization workflows.
 *
 * @example
 * ```tsx
 * const {
 *   isRootProvider,
 *   availableOrganizations,
 *   validateOrganizationMembership,
 * } = useMultiOrg();
 *
 * // Check if user can access a specific organization
 * if (validateOrganizationMembership('org-123')) {
 *   // User has access to this organization
 * }
 * ```
 *
 * @returns The multi-organization context props, or null if not within a multi-org enabled provider.
 */
const useMultiOrg = (): MultiOrgContextProps | null => {
  const context = useContext(MultiOrgContext);
  return context;
};

export default useMultiOrg;
