<template>
  <div class="space-y-6">
    <!-- Authentication Status Card -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Authentication Status</Typography>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 border rounded-lg" :class="isSignedIn ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'">
            <div class="text-2xl mb-2">{{ isSignedIn ? '✅' : '❌' }}</div>
            <div class="font-medium">{{ isSignedIn ? 'Signed In' : 'Not Signed In' }}</div>
          </div>
          
          <div class="text-center p-4 border rounded-lg" :class="isInitialized ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'">
            <div class="text-2xl mb-2">{{ isInitialized ? '✅' : '❌' }}</div>
            <div class="font-medium">{{ isInitialized ? 'Initialized' : 'Not Initialized' }}</div>
          </div>
          
          <div class="text-center p-4 border rounded-lg" :class="isLoading ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300 bg-gray-50'">
            <div class="text-2xl mb-2">{{ isLoading ? '⏳' : '✅' }}</div>
            <div class="font-medium">{{ isLoading ? 'Loading' : 'Ready' }}</div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex gap-3 flex-wrap">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <Button @click="signOut" variant="outline" color="danger">Sign Out</Button>
          </SignedIn>
        </div>
      </div>
    </Card>

    <!-- User Information (when signed in) -->
    <SignedIn>
      <Card>
        <div class="space-y-4">
          <Typography variant="h3">User Information</Typography>
          <div v-if="user" class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-600">Username:</span>
                <span class="ml-2">{{ user.username || 'N/A' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Email:</span>
                <span class="ml-2">{{ user.email || 'N/A' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Given Name:</span>
                <span class="ml-2">{{ user.name?.givenName || 'N/A' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Family Name:</span>
                <span class="ml-2">{{ user.name?.familyName || 'N/A' }}</span>
              </div>
            </div>
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-gray-600">Show Raw User Object</summary>
              <pre class="mt-2 p-3 bg-white rounded border text-xs overflow-auto">{{ JSON.stringify(user, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </Card>
    </SignedIn>

    <!-- Organization Information (when available) -->
    <SignedIn>
      <Card v-if="organization">
        <div class="space-y-4">
          <Typography variant="h3">Organization Information</Typography>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-600">Name:</span>
                <span class="ml-2">{{ organization.name || 'N/A' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">ID:</span>
                <span class="ml-2">{{ organization.id || 'N/A' }}</span>
              </div>
            </div>
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-gray-600">Show Raw Organization Object</summary>
              <pre class="mt-2 p-3 bg-white rounded border text-xs overflow-auto">{{ JSON.stringify(organization, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </Card>
    </SignedIn>

    <!-- SDK Configuration -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">SDK Configuration</Typography>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-600">Base URL:</span>
              <span class="ml-2 font-mono text-xs">{{ baseUrl || 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Client ID:</span>
              <span class="ml-2 font-mono text-xs">{{ clientId || 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">After Sign In URL:</span>
              <span class="ml-2 font-mono text-xs">{{ afterSignInUrl || 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Sign In URL:</span>
              <span class="ml-2 font-mono text-xs">{{ signInUrl || 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Sign Up URL:</span>
              <span class="ml-2 font-mono text-xs">{{ signUpUrl || 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Platform:</span>
              <span class="ml-2">{{ platform || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- API Testing -->
    <SignedIn>
      <Card>
        <div class="space-y-4">
          <Typography variant="h3">API Testing</Typography>
          <div class="space-y-3">
            <div class="flex gap-3">
              <TextField
                v-model="apiUrl"
                placeholder="Enter API endpoint URL"
                class="flex-1"
              />
              <Button @click="testAPI" :disabled="isApiLoading" :loading="isApiLoading">
                Test API
              </Button>
            </div>
            
            <div v-if="apiResponse" class="bg-gray-900 text-green-400 p-4 rounded-lg">
              <div class="text-sm font-medium text-white mb-2">Response:</div>
              <pre class="text-xs overflow-auto max-h-40">{{ apiResponse }}</pre>
            </div>
            
            <div v-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <div class="text-sm font-medium mb-1">Error:</div>
              <div class="text-xs">{{ apiError }}</div>
            </div>
          </div>
        </div>
      </Card>
    </SignedIn>

    <!-- Token Operations -->
    <SignedIn>
      <Card>
        <div class="space-y-4">
          <Typography variant="h3">Token Operations</Typography>
          <div class="space-y-3">
            <div class="flex gap-3 flex-wrap">
              <Button @click="fetchAccessToken" :disabled="tokenLoading" variant="outline">
                Get Access Token
              </Button>
              <Button @click="fetchIdToken" :disabled="tokenLoading" variant="outline">
                Get ID Token
              </Button>
              <Button @click="fetchDecodedIdToken" :disabled="tokenLoading" variant="outline">
                Get Decoded ID Token
              </Button>
            </div>
            
            <div v-if="tokenError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {{ tokenError }}
            </div>
            
            <div v-if="tokens.accessToken" class="space-y-2">
              <div class="text-sm font-medium text-gray-600">Access Token:</div>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-32">{{ tokens.accessToken }}</pre>
            </div>
            
            <div v-if="tokens.idToken" class="space-y-2">
              <div class="text-sm font-medium text-gray-600">ID Token:</div>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-32">{{ tokens.idToken }}</pre>
            </div>
            
            <div v-if="tokens.decodedIdToken" class="space-y-2">
              <div class="text-sm font-medium text-gray-600">Decoded ID Token:</div>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-32">{{ JSON.stringify(tokens.decodedIdToken, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </Card>
    </SignedIn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  useAsgardeo,
  Card,
  Typography,
  Button,
  TextField,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  type HttpRequestConfig
} from '@asgardeo/vue';

const {
  isSignedIn,
  isLoading,
  isInitialized,
  user,
  organization,
  baseUrl,
  clientId,
  afterSignInUrl,
  signInUrl,
  signUpUrl,
  platform,
  signOut,
  getAccessToken,
  getIdToken,
  getDecodedIdToken,
  http,
} = useAsgardeo();

// API Testing
const apiUrl = ref('https://api.asgardeo.io/t/orgkavinda/scim2/Me');
const apiResponse = ref<string | null>(null);
const apiError = ref<string | null>(null);
const isApiLoading = ref(false);

const testAPI = async () => {
  isApiLoading.value = true;
  apiError.value = null;
  apiResponse.value = null;
  
  try {
    const response = await http.request({ 
      url: apiUrl.value, 
      method: 'GET' 
    } as HttpRequestConfig);
    apiResponse.value = JSON.stringify(response.data || response, null, 2);
  } catch (error: any) {
    apiError.value = error?.message || String(error);
  } finally {
    isApiLoading.value = false;
  }
};

// Token Operations
const tokens = ref({
  accessToken: null as string | null,
  idToken: null as string | null,
  decodedIdToken: null as any,
});
const tokenError = ref<string | null>(null);
const tokenLoading = ref(false);

const fetchAccessToken = async () => {
  tokenLoading.value = true;
  tokenError.value = null;
  try {
    tokens.value.accessToken = await getAccessToken();
  } catch (error: any) {
    tokenError.value = error?.message || String(error);
  } finally {
    tokenLoading.value = false;
  }
};

const fetchIdToken = async () => {
  tokenLoading.value = true;
  tokenError.value = null;
  try {
    tokens.value.idToken = await getIdToken();
  } catch (error: any) {
    tokenError.value = error?.message || String(error);
  } finally {
    tokenLoading.value = false;
  }
};

const fetchDecodedIdToken = async () => {
  tokenLoading.value = true;
  tokenError.value = null;
  try {
    tokens.value.decodedIdToken = await getDecodedIdToken();
  } catch (error: any) {
    tokenError.value = error?.message || String(error);
  } finally {
    tokenLoading.value = false;
  }
};
</script>