<script setup lang="ts">
import { ref } from 'vue';
import {
  Card,
  Typography,
  Button,
  Alert,
  Loading,
  Spinner,
  Callback,
  SignInButton,
  SignedIn,
  SignedOut,
  CheckIcon,
  XIcon,
} from '@asgardeo/vue';

// Callback state simulation
const callbackState = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const callbackError = ref<string | null>(null);

const simulateCallbackState = (state: typeof callbackState.value) => {
  callbackState.value = state;
  
  if (state === 'error') {
    callbackError.value = 'Invalid authorization code received from identity provider';
  } else {
    callbackError.value = null;
  }
};

const retryAuthentication = () => {
  callbackState.value = 'loading';
  setTimeout(() => {
    callbackState.value = 'success';
  }, 2000);
};

const goToHomePage = () => {
  callbackState.value = 'idle';
};
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="border-b border-slate-200 pb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Auth Flow Components</h2>
      <p class="text-gray-600">Authentication flow handlers</p>
    </div>

    <!-- Callback Component -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Authentication Flow Components</Typography>
        <Typography variant="body1" class="text-gray-600">
          Components that handle authentication flows and callback processes.
        </Typography>

        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Callback Component</Typography>
            <Typography variant="body2" class="text-gray-600 mb-3">
              The Callback component handles the OAuth2/OIDC callback after authentication with the identity provider.
              It processes the authorization code and completes the authentication flow.
            </Typography>
            
            <div class="space-y-3">
              <Alert variant="info" title="Authentication Callback">
                The Callback component is typically used on a dedicated callback route (e.g., /callback) 
                where users are redirected after successful authentication with the identity provider.
              </Alert>

              <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <Typography variant="h5" class="mb-2">Current Implementation</Typography>
                <Callback />
              </div>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">Custom Callback Handler</Typography>
            <div class="space-y-3">
              <Typography variant="body2" class="text-gray-600">
                You can also create custom callback handlers to show loading states, error messages, 
                or custom success pages during the authentication flow.
              </Typography>

              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="space-y-4">
                  <Typography variant="h5">Simulate Authentication States</Typography>
                  
                  <div class="flex gap-3 flex-wrap">
                    <Button 
                      @click="simulateCallbackState('loading')"
                      variant="outline"
                      :class="{ 'bg-blue-50 border-blue-300': callbackState === 'loading' }"
                    >
                      Loading State
                    </Button>
                    <Button 
                      @click="simulateCallbackState('success')"
                      variant="outline"
                      :class="{ 'bg-green-50 border-green-300': callbackState === 'success' }"
                    >
                      Success State
                    </Button>
                    <Button 
                      @click="simulateCallbackState('error')"
                      variant="outline"
                      :class="{ 'bg-red-50 border-red-300': callbackState === 'error' }"
                    >
                      Error State
                    </Button>
                    <Button 
                      @click="simulateCallbackState('idle')"
                      variant="outline"
                      :class="{ 'bg-gray-50 border-gray-300': callbackState === 'idle' }"
                    >
                      Reset
                    </Button>
                  </div>

                  <div class="p-4 bg-white border rounded">
                    <!-- Loading State -->
                    <div v-if="callbackState === 'loading'" class="text-center py-8">
                      <Loading>
                        <div class="space-y-3">
                          <Spinner size="large" />
                          <div>
                            <Typography variant="h5">Processing Authentication</Typography>
                            <Typography variant="body2" class="text-gray-600 mt-1">
                              Please wait while we complete your sign-in...
                            </Typography>
                          </div>
                          <div class="text-xs text-gray-500">
                            This usually takes a few seconds
                          </div>
                        </div>
                      </Loading>
                    </div>

                    <!-- Success State -->
                    <div v-else-if="callbackState === 'success'" class="text-center py-8">
                      <div class="space-y-3">
                        <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                          <CheckIcon class="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <Typography variant="h5" class="text-green-800">Authentication Successful!</Typography>
                          <Typography variant="body2" class="text-gray-600 mt-1">
                            You have been successfully signed in. Redirecting to your dashboard...
                          </Typography>
                        </div>
                        <div class="flex justify-center">
                          <Spinner size="small" />
                        </div>
                      </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="callbackState === 'error'" class="text-center py-8">
                      <div class="space-y-3">
                        <div class="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                          <XIcon class="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                          <Typography variant="h5" class="text-red-800">Authentication Failed</Typography>
                          <Typography variant="body2" class="text-gray-600 mt-1">
                            There was an error processing your authentication. Please try again.
                          </Typography>
                        </div>
                        <div class="space-y-2">
                          <Alert variant="error" title="Error Details">
                            {{ callbackError || 'Authentication callback failed. Please check your configuration and try again.' }}
                          </Alert>
                          <div class="flex gap-3 justify-center">
                            <Button @click="retryAuthentication" size="small">
                              Try Again
                            </Button>
                            <Button @click="goToHomePage" variant="outline" size="small">
                              Go to Home
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Idle State -->
                    <div v-else class="text-center py-8 text-gray-500">
                      <Typography variant="body1">
                        Select a state above to see the callback handler in action
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Authentication Flow Documentation -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Authentication Flow Overview</Typography>
        <div class="space-y-4">
          <Typography variant="body1" class="text-gray-600">
            Understanding the complete authentication flow and how the Callback component fits in.
          </Typography>

          <div class="space-y-4">
            <div>
              <Typography variant="h4" class="mb-3">1. Authentication Initiation</Typography>
              <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <Typography variant="body2">
                  User clicks a sign-in button (SignInButton component) which redirects to the identity provider's login page.
                </Typography>
                <div class="mt-3">
                  <SignedOut>
                    <SignInButton>Start Authentication Flow</SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Alert variant="info">You are already authenticated</Alert>
                  </SignedIn>
                </div>
              </div>
            </div>

            <div>
              <Typography variant="h4" class="mb-3">2. Identity Provider Authentication</Typography>
              <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <Typography variant="body2">
                  User authenticates with the identity provider (Asgardeo) using their credentials or social login.
                </Typography>
              </div>
            </div>

            <div>
              <Typography variant="h4" class="mb-3">3. Callback Processing</Typography>
              <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <Typography variant="body2">
                  Identity provider redirects back to your callback URL with an authorization code. 
                  The Callback component processes this code and completes the authentication.
                </Typography>
                <div class="mt-3 p-3 bg-white rounded border font-mono text-sm">
                  https://your-app.com/callback?code=ABC123&amp;state=XYZ789
                </div>
              </div>
            </div>

            <div>
              <Typography variant="h4" class="mb-3">4. Authentication Completion</Typography>
              <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <Typography variant="body2">
                  Tokens are obtained and stored, user session is established, and the user is redirected to the application.
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Usage Examples -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Implementation Examples</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">1. Basic Callback Page</Typography>
            <div class="bg-gray-100 p-4 rounded-lg">
              <Typography variant="body2" class="text-gray-600 mb-3">
                Simple callback page that just handles the authentication:
              </Typography>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-auto"><code>&lt;template&gt;
  &lt;div class="min-h-screen flex items-center justify-center"&gt;
    &lt;Callback /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { Callback } from '@asgardeo/vue';
&lt;/script&gt;</code></pre>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">2. Enhanced Callback Page</Typography>
            <div class="bg-gray-100 p-4 rounded-lg">
              <Typography variant="body2" class="text-gray-600 mb-3">
                Callback page with custom loading states and error handling:
              </Typography>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-auto max-h-40"><code>&lt;template&gt;
  &lt;div class="min-h-screen flex items-center justify-center bg-gray-50"&gt;
    &lt;div class="max-w-md w-full"&gt;
      &lt;Card&gt;
        &lt;div class="text-center p-6"&gt;
          &lt;Logo class="mx-auto mb-4" /&gt;
          &lt;Callback&gt;
            &lt;template #loading&gt;
              &lt;div class="space-y-3"&gt;
                &lt;Spinner size="large" /&gt;
                &lt;Typography variant="h5"&gt;Completing Sign In...&lt;/Typography&gt;
                &lt;Typography variant="body2" class="text-gray-600"&gt;
                  We're setting up your account
                &lt;/Typography&gt;
              &lt;/div&gt;
            &lt;/template&gt;
            &lt;template #error="{ error }"&gt;
              &lt;div class="space-y-3"&gt;
                &lt;Alert variant="error" :title="error.message" /&gt;
                &lt;Button @click="$router.push('/')"&gt;Return Home&lt;/Button&gt;
              &lt;/div&gt;
            &lt;/template&gt;
          &lt;/Callback&gt;
        &lt;/div&gt;
      &lt;/Card&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">3. Callback with Router Integration</Typography>
            <div class="bg-gray-100 p-4 rounded-lg">
              <Typography variant="body2" class="text-gray-600 mb-3">
                Using the callback component with Vue Router for navigation:
              </Typography>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-auto max-h-40"><code>// router/index.js
import { Callback } from '@asgardeo/vue';

const routes = [
  {
    path: '/callback',
    name: 'Callback',
    component: Callback,
    meta: { 
      requiresAuth: false,
      hideNavigation: true 
    }
  }
];

// Component usage
&lt;template&gt;
  &lt;Callback 
    @success="handleAuthSuccess"
    @error="handleAuthError"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
const router = useRouter();

const handleAuthSuccess = () =&gt; {
  router.push('/dashboard');
};

const handleAuthError = (error) =&gt; {
  console.error('Auth error:', error);
  router.push('/login?error=callback_failed');
};
&lt;/script&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>