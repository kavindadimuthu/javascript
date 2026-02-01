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

import {
  AsgardeoJavaScriptClient,
  AllOrganizationsApiResponse,
  EmbeddedFlowExecuteRequestPayload,
  EmbeddedFlowExecuteResponse,
  EmbeddedSignInFlowHandleRequestPayload,
  IdToken,
  Organization,
  SignInOptions,
  SignOutOptions,
  SignUpOptions,
  Storage,
  TokenExchangeRequestConfig,
  TokenResponse,
  User,
  UserProfile,
} from '@asgardeo/javascript';
import {AsgardeoBrowserConfig} from './models/config';
import {AsgardeoSPAClient} from './__legacy__/client';
import {HttpRequestConfig, HttpResponse} from './__legacy__/models';

/**
 * Base class for implementing Asgardeo in browser-based applications.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * This class wraps the legacy AsgardeoSPAClient internally to provide backward compatibility
 * while implementing the modern AsgardeoJavaScriptClient interface.
 *
 * @typeParam T - Configuration type that extends AsgardeoBrowserConfig.
 */
class AsgardeoBrowserClient<T = AsgardeoBrowserConfig> extends AsgardeoJavaScriptClient<T> {
  /**
   * The underlying SPA client instance that handles OAuth/OIDC operations.
   */
  protected spaClient: AsgardeoSPAClient;

  /**
   * The instance ID used for multi-auth context support.
   */
  protected _instanceId: number;

  /**
   * The current configuration.
   */
  protected _config: T | undefined;

  /**
   * Creates a new AsgardeoBrowserClient instance.
   * @param instanceId - Optional instance ID for multi-auth context support. Defaults to 0.
   */
  constructor(instanceId: number = 0) {
    super();
    this._instanceId = instanceId;
    this.spaClient = AsgardeoSPAClient.getInstance(instanceId);
  }

  /**
   * Get the instance ID for this client.
   * @returns The instance ID used for multi-auth context support.
   */
  public getInstanceId(): number {
    return this._instanceId;
  }

  /**
   * Initialize the client with the provided configuration.
   * @param config - The configuration object.
   * @param storage - Optional storage implementation.
   * @returns A promise that resolves to true when initialization is complete.
   */
  async initialize(config: T, storage?: Storage): Promise<boolean> {
    this._config = config;
    return this.spaClient.initialize(config as any);
  }

  /**
   * Re-initialize the client with updated configuration.
   * @param config - Partial configuration to update.
   * @returns A promise that resolves to true when re-initialization is complete.
   */
  async reInitialize(config: Partial<T>): Promise<boolean> {
    this._config = {...this._config, ...config} as T;
    await this.spaClient.reInitialize(config as any);
    return true;
  }

  /**
   * Get the current configuration.
   * @returns The current configuration object.
   */
  getConfiguration(): T {
    return (this.spaClient.getConfigData() ?? this._config) as T;
  }

  /**
   * Check if the SDK is currently loading.
   * Browser client does not track loading state by default.
   * @returns Always returns false for the base browser client.
   */
  isLoading(): boolean {
    return false;
  }

  /**
   * Check if the user is currently signed in.
   * @returns A promise that resolves to true if the user is signed in.
   */
  async isSignedIn(): Promise<boolean> {
    return (await this.spaClient.isSignedIn()) ?? false;
  }

  /**
   * Check if the client has been initialized.
   * @returns A promise that resolves to true if the client is initialized.
   */
  async isInitialized(): Promise<boolean> {
    return this.spaClient.isInitialized();
  }

  /**
   * Get the basic user information from the ID token.
   * @param options - Optional parameters for the request.
   * @returns A promise that resolves with the user information.
   */
  async getUser(options?: any): Promise<User> {
    const user = await this.spaClient.getUser();
    if (!user) {
      throw new Error('User not found. Please ensure the user is signed in.');
    }
    return user;
  }

  /**
   * Get the decoded ID token.
   * @param sessionId - Optional session ID.
   * @returns A promise that resolves with the decoded ID token.
   */
  async getDecodedIdToken(sessionId?: string): Promise<IdToken> {
    const idToken = await this.spaClient.getDecodedIdToken(sessionId);
    if (!idToken) {
      throw new Error('ID token not found. Please ensure the user is signed in.');
    }
    return idToken;
  }

  /**
   * Get the user profile.
   * Note: This method should be overridden by framework-specific implementations
   * to provide enhanced user profile data (e.g., SCIM2).
   * @param options - Optional parameters for the request.
   * @returns A promise that resolves with the user profile.
   */
  async getUserProfile(options?: any): Promise<UserProfile> {
    // Base implementation returns basic user info
    // Framework clients (React, Vue, etc.) can override for SCIM2 integration
    const user = await this.getUser(options);
    return {
      schemas: [],
      flattenedProfile: user,
      profile: user,
    } as UserProfile;
  }

  /**
   * Update the user profile.
   * Note: This method should be overridden by framework-specific implementations.
   * @param payload - The user profile update payload.
   * @param userId - Optional user ID.
   * @returns A promise that resolves with the updated user.
   */
  async updateUserProfile(payload: any, userId?: string): Promise<User> {
    throw new Error('updateUserProfile is not implemented in the base browser client. Use a framework-specific client.');
  }

  /**
   * Get the access token for the current session.
   * @param sessionId - Optional session ID.
   * @returns A promise that resolves with the access token.
   */
  async getAccessToken(sessionId?: string): Promise<string> {
    return this.spaClient.getAccessToken(sessionId);
  }

  /**
   * Get organizations associated with the current user.
   * Note: This method should be overridden by framework-specific implementations.
   * @param options - Optional parameters for the request.
   * @param sessionId - Optional session ID.
   * @returns A promise that resolves with the user's organizations.
   */
  async getMyOrganizations(options?: any, sessionId?: string): Promise<Organization[]> {
    // Base implementation - framework clients should override with API integration
    throw new Error('getMyOrganizations is not implemented in the base browser client. Use a framework-specific client.');
  }

  /**
   * Get all organizations available.
   * Note: This method should be overridden by framework-specific implementations.
   * @param options - Optional parameters for the request.
   * @param sessionId - Optional session ID.
   * @returns A promise that resolves with all organizations.
   */
  async getAllOrganizations(options?: any, sessionId?: string): Promise<AllOrganizationsApiResponse> {
    // Base implementation - framework clients should override with API integration
    throw new Error('getAllOrganizations is not implemented in the base browser client. Use a framework-specific client.');
  }

  /**
   * Get the current organization from the ID token.
   * @param sessionId - Optional session ID.
   * @returns A promise that resolves with the current organization or null.
   */
  async getCurrentOrganization(sessionId?: string): Promise<Organization | null> {
    try {
      const idToken = await this.getDecodedIdToken(sessionId);
      if (idToken?.org_id) {
        return {
          orgHandle: idToken.org_handle,
          name: idToken.org_name,
          id: idToken.org_id,
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Switch to a different organization.
   * @param organization - The organization to switch to.
   * @param sessionId - Optional session ID.
   * @returns A promise that resolves with the token response.
   */
  async switchOrganization(organization: Organization, sessionId?: string): Promise<TokenResponse | Response> {
    if (!organization.id) {
      throw new Error('Organization ID is required for switching organizations');
    }

    const exchangeConfig = {
      attachToken: false,
      data: {
        client_id: '{{clientId}}',
        grant_type: 'organization_switch',
        scope: '{{scopes}}',
        switching_organization: organization.id,
        token: '{{accessToken}}',
      },
      id: 'organization-switch',
      returnsSession: true,
      signInRequired: true,
    };

    const result = await this.spaClient.exchangeToken(exchangeConfig);
    return result as TokenResponse | Response;
  }

  /**
   * Exchange the current token for a new one based on the provided configuration.
   * @param config - The token exchange configuration.
   * @param sessionId - Optional session ID.
   * @returns A promise that resolves with the token response.
   */
  async exchangeToken(config: TokenExchangeRequestConfig, sessionId?: string): Promise<TokenResponse | Response> {
    const result = await this.spaClient.exchangeToken(config);
    return result as TokenResponse | Response;
  }

  /**
   * Sign in the user.
   * @param options - Optional sign-in options.
   * @param sessionId - Optional session ID.
   * @param onSignInSuccess - Optional callback on successful sign-in.
   * @returns A promise that resolves with the user information.
   */
  signIn(
    options?: SignInOptions,
    sessionId?: string,
    onSignInSuccess?: (afterSignInUrl: string) => void,
  ): Promise<User>;
  signIn(
    payload: EmbeddedSignInFlowHandleRequestPayload,
    request: Request,
    sessionId?: string,
    onSignInSuccess?: (afterSignInUrl: string) => void,
  ): Promise<User>;
  async signIn(...args: any[]): Promise<User> {
    const options = args[0];
    const user = await this.spaClient.signIn(options as any);
    
    // Call success callback if provided
    const onSignInSuccess = typeof args[1] === 'function' ? args[1] : args[2];
    if (onSignInSuccess && user) {
      onSignInSuccess(window.location.href);
    }
    
    if (!user) {
      throw new Error('Sign in failed. Please try again.');
    }
    return user;
  }

  /**
   * Sign in silently without user interaction.
   * @param options - Optional sign-in options.
   * @returns A promise that resolves with the user or false if silent sign-in fails.
   */
  async signInSilently(options?: SignInOptions): Promise<User | boolean> {
    const result = await this.spaClient.signInSilently(options as Record<string, string | boolean>);
    return result ?? false;
  }

  /**
   * Sign out the user.
   * @param options - Optional sign-out options.
   * @param afterSignOut - Optional callback after sign-out.
   * @returns A promise that resolves with the sign-out result.
   */
  signOut(options?: SignOutOptions, afterSignOut?: (afterSignOutUrl: string) => void): Promise<string>;
  signOut(
    options?: SignOutOptions,
    sessionId?: string,
    afterSignOut?: (afterSignOutUrl: string) => void,
  ): Promise<string>;
  async signOut(...args: any[]): Promise<string> {
    const result = await this.spaClient.signOut();
    
    // Call callback if provided
    const afterSignOut = typeof args[1] === 'function' ? args[1] : args[2];
    if (afterSignOut) {
      afterSignOut(window.location.href);
    }
    
    return String(result);
  }

  /**
   * Initiate user sign-up.
   * Note: This method should be overridden by framework-specific implementations.
   * @param options - Optional sign-up options.
   * @returns A promise that resolves when sign-up is initiated.
   */
  signUp(options?: SignUpOptions): Promise<void>;
  signUp(payload: EmbeddedFlowExecuteRequestPayload): Promise<EmbeddedFlowExecuteResponse>;
  async signUp(...args: any[]): Promise<void | EmbeddedFlowExecuteResponse> {
    // Base implementation - framework clients should override for embedded flows
    throw new Error('signUp is not implemented in the base browser client. Use a framework-specific client or redirect-based flow.');
  }

  /**
   * Clear the current session.
   * @param sessionId - Optional session ID.
   */
  clearSession(sessionId?: string): void {
    this.spaClient.clearSession(sessionId);
  }

  // ============================================
  // Browser-specific methods (not in abstract)
  // ============================================

  /**
   * Make an authenticated HTTP request.
   * The access token is automatically attached to the request.
   * @param requestConfig - The HTTP request configuration.
   * @returns A promise that resolves with the HTTP response.
   */
  async httpRequest(requestConfig: HttpRequestConfig): Promise<HttpResponse> {
    const response = await this.spaClient.httpRequest(requestConfig);
    if (!response) {
      throw new Error('HTTP request failed');
    }
    return response;
  }

  /**
   * Make multiple authenticated HTTP requests.
   * The access token is automatically attached to all requests.
   * @param requestConfigs - Array of HTTP request configurations.
   * @returns A promise that resolves with an array of HTTP responses.
   */
  async httpRequestAll(requestConfigs: HttpRequestConfig[]): Promise<HttpResponse[]> {
    const responses = await this.spaClient.httpRequestAll(requestConfigs);
    if (!responses) {
      throw new Error('HTTP requests failed');
    }
    return responses;
  }

  /**
   * Refresh the access token.
   * @returns A promise that resolves with the refreshed user information.
   */
  async refreshAccessToken(): Promise<User> {
    const user = await this.spaClient.refreshAccessToken();
    if (!user) {
      throw new Error('Failed to refresh access token');
    }
    return user;
  }

  /**
   * Revoke the current access token.
   * @returns A promise that resolves to true if revocation was successful.
   */
  async revokeAccessToken(): Promise<boolean> {
    return (await this.spaClient.revokeAccessToken()) ?? false;
  }

  /**
   * Get the underlying SPA client instance.
   * Useful for advanced use cases where direct access to the legacy client is needed.
   * @returns The AsgardeoSPAClient instance.
   */
  getSPAClient(): AsgardeoSPAClient {
    return this.spaClient;
  }
}

export default AsgardeoBrowserClient;
