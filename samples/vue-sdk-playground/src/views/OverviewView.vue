<script setup lang="ts">
import { ref } from 'vue';
import {
  useAsgardeo,
  Card,
  Typography,
  Button,
  Alert,
  TextField,
  Spinner,
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  Loading,
} from '@asgardeo/vue';
import type { IdToken, HttpRequestConfig } from '@asgardeo/vue';   

const {
  isInitialized,
  isLoading,
  isSignedIn,
  baseUrl,
  clientId,
  afterSignInUrl,
  signInUrl,
  signUpUrl,
  organizationHandle,
  platform,
  storage,
  signInSilently,
  clearSession,
  getAccessToken,
  getDecodedIdToken,
  getIdToken,
  http,
} = useAsgardeo();

// ── Token panel state ──
const accessToken = ref<string | null>(null);
const idToken = ref<string | null>(null);
const decodedIdToken = ref<IdToken | null>(null);
const tokenError = ref<string | null>(null);
const isTokenLoading = ref(false);
const expandedToken = ref<string | null>(null);

async function fetchAccessToken() {
  isTokenLoading.value = true;
  tokenError.value = null;
  try {
    accessToken.value = await getAccessToken();
    expandedToken.value = 'access';
  } catch (e: any) {
    tokenError.value = e?.message ?? String(e);
  } finally {
    isTokenLoading.value = false;
  }
}

async function fetchIdToken() {
  isTokenLoading.value = true;
  tokenError.value = null;
  try {
    idToken.value = await getIdToken();
    expandedToken.value = 'id';
  } catch (e: any) {
    tokenError.value = e?.message ?? String(e);
  } finally {
    isTokenLoading.value = false;
  }
}

async function fetchDecodedIdToken() {
  isTokenLoading.value = true;
  tokenError.value = null;
  try {
    decodedIdToken.value = await getDecodedIdToken();
    expandedToken.value = 'decoded';
  } catch (e: any) {
    tokenError.value = e?.message ?? String(e);
  } finally {
    isTokenLoading.value = false;
  }
}

// ── HTTP panel state ──
const httpRequestUrl = ref('https://api.asgardeo.io/t/orgkavinda/scim2/Me');
const httpResponse = ref<string | null>(null);
const httpError = ref<string | null>(null);
const isHttpLoading = ref(false);

async function makeHttpRequest() {
  isHttpLoading.value = true;
  httpError.value = null;
  httpResponse.value = null;
  try {
    const res = await http.request({ url: httpRequestUrl.value, method: 'GET' } as HttpRequestConfig);
    httpResponse.value = JSON.stringify(res.data ?? res, null, 2);
  } catch (e: any) {
    httpError.value = e?.message ?? String(e);
  } finally {
    isHttpLoading.value = false;
  }
}

// ── Sign in silently ──
const silentSignInResult = ref<string | null>(null);
const silentSignInError = ref<string | null>(null);

async function handleSignInSilently() {
  silentSignInResult.value = null;
  silentSignInError.value = null;
  try {
    const result = await signInSilently();
    silentSignInResult.value = JSON.stringify(result, null, 2);
  } catch (e: any) {
    silentSignInError.value = e?.message ?? String(e);
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="border-b border-slate-200 pb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap mb-2">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Overview</h2>
          <p class="text-gray-600">SDK status and configuration overview</p>
        </div>
        <!-- Auth Controls -->
        <div class="flex gap-2 flex-wrap items-center justify-end">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <Button variant="outline" size="small" @click="signInSilently()">Refresh</Button>
            <Button variant="outline" size="small" @click="clearSession()">Clear Session</Button>
            <SignOutButton />
          </SignedIn>
        </div>
      </div>
    </div>

    <!-- ── Global Loading State ── -->
    <Loading>
      <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="large" />
        <Typography variant="body2">Initializing Asgardeo…</Typography>
      </div>
    </Loading>

    <!-- ── Unauthenticated View ── -->
    <SignedOut>
      <div class="flex flex-col gap-5">
        <!-- Welcome Card -->
        <Card>
          <div class="text-center py-4">
            <Typography variant="h2">Welcome to Asgardeo Vue SDK</Typography>
            <Typography variant="body2">Explore the full power of authentication and SDK capabilities</Typography>
          </div>
        </Card>

        <!-- Status Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full" :class="isInitialized ? 'bg-green-500' : 'bg-slate-300'"></div>
              <Typography variant="subtitle2">SDK Initialized</Typography>
            </div>
            <Typography variant="body2" class="font-mono">{{ isInitialized }}</Typography>
          </Card>

          <Card>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full" :class="!isLoading ? 'bg-green-500' : 'bg-orange-500'"></div>
              <Typography variant="subtitle2">SDK Ready</Typography>
            </div>
            <Typography variant="body2" class="font-mono">{{ !isLoading }}</Typography>
          </Card>

          <Card>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full" :class="isSignedIn ? 'bg-green-500' : 'bg-slate-300'"></div>
              <Typography variant="subtitle2">Authenticated</Typography>
            </div>
            <Typography variant="body2" class="font-mono">{{ isSignedIn }}</Typography>
          </Card>
        </div>

        <!-- Configuration Panel -->
        <Card>
          <div class="space-y-4">
            <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
              <Typography variant="h3">Provider Configuration</Typography>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(value, key) in { baseUrl, clientId, afterSignInUrl, signInUrl, signUpUrl, organizationHandle, platform, storage }" :key="key" class="space-y-1">
                <Typography variant="overline">{{ key }}</Typography>
                <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                  <span class="text-xs text-slate-900 font-mono break-all">{{ value ?? '–' }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </SignedOut>

    <!-- ── Authenticated Dashboard ── -->
    <SignedIn>
      <div class="flex flex-col gap-5">
        <!-- Status Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full bg-green-600"></div>
              <Typography variant="overline">Initialized</Typography>
            </div>
            <Typography variant="h3">{{ isInitialized }}</Typography>
          </Card>

          <Card>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full bg-blue-600"></div>
              <Typography variant="overline">Ready</Typography>
            </div>
            <Typography variant="h3">{{ !isLoading }}</Typography>
          </Card>

          <Card>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full bg-purple-600"></div>
              <Typography variant="overline">Signed In</Typography>
            </div>
            <Typography variant="h3">{{ isSignedIn }}</Typography>
          </Card>
        </div>

        <!-- Configuration Panel -->
        <Card>
          <div class="space-y-4">
            <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
              <Typography variant="h3">Provider Configuration</Typography>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(value, key) in { baseUrl, clientId, afterSignInUrl, signInUrl, signUpUrl, organizationHandle, platform, storage }" :key="key" class="space-y-1">
                <Typography variant="overline">{{ key }}</Typography>
                <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                  <span class="text-xs text-slate-900 font-mono break-all">{{ value ?? '–' }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Token Operations -->
        <Card>
          <div class="space-y-4">
            <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
              <Typography variant="h3">Token Operations</Typography>
              <Typography variant="body2" class="text-slate-500 mt-1">Retrieve and manage authentication tokens</Typography>
            </div>

            <div class="flex gap-2 flex-wrap">
              <Button :loading="isTokenLoading" @click="fetchAccessToken">Get Access Token</Button>
              <Button :loading="isTokenLoading" color="secondary" @click="fetchIdToken">Get ID Token</Button>
              <Button :loading="isTokenLoading" color="secondary" @click="fetchDecodedIdToken">Get Decoded ID Token</Button>
            </div>

            <Alert v-if="tokenError" severity="error">{{ tokenError }}</Alert>

            <!-- Token Display (Collapsible) -->
            <div v-if="accessToken" class="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
              <button @click="expandedToken = expandedToken === 'access' ? null : 'access'" class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent">
                <Typography variant="subtitle2">Access Token</Typography>
                <svg class="w-4 h-4 text-slate-500 transition-transform" :class="{ 'rotate-180': expandedToken === 'access' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div v-if="expandedToken === 'access'" class="border-t border-slate-200 p-4">
                <pre class="bg-slate-900 text-slate-200 rounded-lg p-3 text-xs overflow-auto max-h-64 font-mono">{{ accessToken }}</pre>
              </div>
            </div>

            <div v-if="idToken" class="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
              <button @click="expandedToken = expandedToken === 'id' ? null : 'id'" class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent">
                <Typography variant="subtitle2">ID Token</Typography>
                <svg class="w-4 h-4 text-slate-500 transition-transform" :class="{ 'rotate-180': expandedToken === 'id' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div v-if="expandedToken === 'id'" class="border-t border-slate-200 p-4">
                <pre class="bg-slate-900 text-slate-200 rounded-lg p-3 text-xs overflow-auto max-h-64 font-mono">{{ idToken }}</pre>
              </div>
            </div>

            <div v-if="decodedIdToken" class="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
              <button @click="expandedToken = expandedToken === 'decoded' ? null : 'decoded'" class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent">
                <Typography variant="subtitle2">Decoded ID Token</Typography>
                <svg class="w-4 h-4 text-slate-500 transition-transform" :class="{ 'rotate-180': expandedToken === 'decoded' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div v-if="expandedToken === 'decoded'" class="border-t border-slate-200 p-4">
                <pre class="bg-slate-900 text-slate-200 rounded-lg p-3 text-xs overflow-auto max-h-64 font-mono">{{ JSON.stringify(decodedIdToken, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </Card>

        <!-- HTTP Request Panel -->
        <Card>
          <div class="space-y-4">
            <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
              <Typography variant="h3">Authenticated HTTP Request</Typography>
              <Typography variant="body2" class="text-slate-500 mt-1">Make authenticated API calls with auto-injected tokens</Typography>
            </div>

            <div class="flex gap-2 flex-wrap items-end">
              <TextField
                v-model="httpRequestUrl"
                type="url"
                label="Request URL"
                placeholder="https://api.example.com/endpoint"
                class="flex-1 min-w-48"
              />
              <Button :loading="isHttpLoading" @click="makeHttpRequest">Send GET</Button>
            </div>

            <Alert v-if="httpError" severity="error">{{ httpError }}</Alert>

            <div v-if="httpResponse">
              <pre class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-64 font-mono">{{ httpResponse }}</pre>
            </div>
          </div>
        </Card>

        <!-- Silent Sign In Panel -->
        <Card>
          <div class="space-y-4">
            <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
              <Typography variant="h3">Silent Sign In</Typography>
              <Typography variant="body2" class="text-slate-500 mt-1">Refresh session without user interaction</Typography>
            </div>

            <Button variant="outline" @click="handleSignInSilently">Attempt Silent Sign In</Button>

            <Alert v-if="silentSignInError" severity="error">{{ silentSignInError }}</Alert>

            <div v-if="silentSignInResult">
              <pre class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-64 font-mono">{{ silentSignInResult }}</pre>
            </div>
          </div>
        </Card>
      </div>
    </SignedIn>
  </div>
</template>