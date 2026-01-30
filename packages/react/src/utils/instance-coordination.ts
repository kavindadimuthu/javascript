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
 * Utility for coordinating authentication status across multiple Asgardeo instances.
 * This enables parent-child organization scenarios where sub-org providers need to
 * wait for parent authentication to complete before proceeding with token exchange.
 *
 * @example
 * ```tsx
 * // Parent organization provider (instanceId: 0)
 * <AsgardeoProvider
 *   clientId="parent-client-id"
 *   baseUrl="https://api.asgardeo.io/t/parentorg"
 *   instanceId={0}
 * >
 *   <ParentApp />
 * </AsgardeoProvider>
 *
 * // Sub-organization provider (instanceId: 1)
 * // This will automatically wait for parent (instanceId: 0) to authenticate
 * // before performing organization token exchange
 * <AsgardeoProvider
 *   clientId="parent-client-id"
 *   baseUrl="https://api.asgardeo.io/t/parentorg/o/suborg"
 *   instanceId={1}
 *   parentInstanceId={0}
 *   organizationId="sub-org-id"
 * >
 *   <SubOrgApp />
 * </AsgardeoProvider>
 * ```
 *
 * @remarks
 * The coordination mechanism uses sessionStorage to track authentication status
 * across instances. Each instance's status transitions through these states:
 * - `initializing`: Provider is mounting and initializing
 * - `authenticating`: Parent is actively signing in (OAuth flow)
 * - `authenticated`: Successfully signed in
 * - `failed`: Authentication failed
 * - `idle`: No authentication in progress
 */

const INSTANCE_STATUS_KEY = 'asgardeo-instance-status';

export type InstanceAuthStatus = 'initializing' | 'authenticating' | 'authenticated' | 'failed' | 'idle';

export interface InstanceStatus {
  instanceId: number;
  status: InstanceAuthStatus;
  timestamp: number;
}

export interface InstanceStatusMap {
  [instanceId: number]: InstanceStatus;
}

/**
 * Sets the authentication status for a specific instance.
 * @param instanceId - The instance ID to set status for
 * @param status - The authentication status
 */
export function setInstanceStatus(instanceId: number, status: InstanceAuthStatus): void {
  try {
    const allStatuses: InstanceStatusMap = getAllInstanceStatuses();
    allStatuses[instanceId] = {
      instanceId,
      status,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(INSTANCE_STATUS_KEY, JSON.stringify(allStatuses));
  } catch (error) {
    console.error(`Failed to set instance status for instance ${instanceId}:`, error);
  }
}

/**
 * Gets the authentication status for a specific instance.
 * @param instanceId - The instance ID to get status for
 * @returns The instance status or null if not found
 */
export function getInstanceStatus(instanceId: number): InstanceStatus | null {
  try {
    const allStatuses: InstanceStatusMap = getAllInstanceStatuses();
    return allStatuses[instanceId] || null;
  } catch (error) {
    console.error(`Failed to get instance status for instance ${instanceId}:`, error);
    return null;
  }
}

/**
 * Gets all instance statuses.
 * @returns Map of all instance statuses
 */
export function getAllInstanceStatuses(): InstanceStatusMap {
  try {
    const statusesJson = sessionStorage.getItem(INSTANCE_STATUS_KEY);
    return statusesJson ? JSON.parse(statusesJson) : {};
  } catch (error) {
    console.error('Failed to get all instance statuses:', error);
    return {};
  }
}

/**
 * Clears the authentication status for a specific instance.
 * @param instanceId - The instance ID to clear status for
 */
export function clearInstanceStatus(instanceId: number): void {
  try {
    const allStatuses: InstanceStatusMap = getAllInstanceStatuses();
    delete allStatuses[instanceId];
    sessionStorage.setItem(INSTANCE_STATUS_KEY, JSON.stringify(allStatuses));
  } catch (error) {
    console.error(`Failed to clear instance status for instance ${instanceId}:`, error);
  }
}

/**
 * Waits for a parent instance to complete authentication.
 * This function polls the parent instance status until it reaches
 * 'authenticated' or 'failed' state, or until the timeout is reached.
 *
 * @param parentInstanceId - The parent instance ID to wait for
 * @param timeout - Maximum time to wait in milliseconds (default: 30000)
 * @param pollInterval - Interval between status checks in milliseconds (default: 100)
 * @returns Promise that resolves to true if parent authenticated, false otherwise
 */
export async function waitForParentAuthentication(
  parentInstanceId: number,
  timeout: number = 30000,
  pollInterval: number = 100,
): Promise<boolean> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const checkParentStatus = () => {
      const elapsed = Date.now() - startTime;

      // Check timeout
      if (elapsed >= timeout) {
        console.warn(
          `Timeout waiting for parent instance ${parentInstanceId} authentication after ${timeout}ms`,
        );
        resolve(false);
        return;
      }

      const parentStatus = getInstanceStatus(parentInstanceId);

      // Parent authenticated successfully
      if (parentStatus?.status === 'authenticated') {
        console.log(`Parent instance ${parentInstanceId} authenticated successfully`);
        resolve(true);
        return;
      }

      // Parent authentication failed
      if (parentStatus?.status === 'failed') {
        console.error(`Parent instance ${parentInstanceId} authentication failed`);
        resolve(false);
        return;
      }

      // Check if parent status is stale (older than 2 minutes)
      if (parentStatus && Date.now() - parentStatus.timestamp > 120000) {
        console.warn(`Parent instance ${parentInstanceId} status is stale, considering it failed`);
        resolve(false);
        return;
      }

      // Continue polling
      setTimeout(checkParentStatus, pollInterval);
    };

    // Start checking
    checkParentStatus();
  });
}

/**
 * Checks if a parent instance is ready (authenticated).
 * This is a non-blocking check that returns immediately.
 *
 * @param parentInstanceId - The parent instance ID to check
 * @returns True if parent is authenticated, false otherwise
 */
export function isParentReady(parentInstanceId: number): boolean {
  const parentStatus = getInstanceStatus(parentInstanceId);
  return parentStatus?.status === 'authenticated';
}

/**
 * Clears all instance statuses. Useful for cleanup.
 */
export function clearAllInstanceStatuses(): void {
  try {
    sessionStorage.removeItem(INSTANCE_STATUS_KEY);
  } catch (error) {
    console.error('Failed to clear all instance statuses:', error);
  }
}
