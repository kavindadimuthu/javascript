<script setup lang="ts">
import { ref } from 'vue';
import { useAsgardeo, SignInButton, SignedIn, SignedOut } from '@asgardeo/vue';
import type { IdToken, HttpRequestConfig } from '@asgardeo/vue';

const {
  // ── Reactive state ──
  isSignedIn,
  isLoading,
  isInitialized,
  user,
  organization,
  // ── Config ──
  baseUrl,
  clientId,
  afterSignInUrl,
  signInUrl,
  signUpUrl,
  organizationHandle,
  platform,
  storage,
  // ── Auth actions ──
  signIn,
  signOut,
  signUp,
  signInSilently,
  clearSession,
  // ── Token operations ──
  getAccessToken,
  getDecodedIdToken,
  getIdToken,
  // ── HTTP ──
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

// ── Helper function for status badge ──
function getStatusColor(value: boolean) {
  return value ? 'bg-green-100 text-green-900' : 'bg-slate-100 text-slate-700';
}
</script>

<template>
  <!-- ── Global Loading State ── -->
  <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
    <div class="w-9 h-9 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
    <p class="text-sm font-medium">Initializing Asgardeo…</p>
  </div>

  <!-- ── Unauthenticated View ── -->
  <div v-else-if="!isSignedIn" class="flex flex-col gap-5">
    <!-- Welcome Card -->
    <div class="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-8 md:p-10 text-center">
      <h2 class="text-3xl font-bold text-slate-900 mb-2 m-0">Welcome to Asgardeo Vue SDK</h2>
      <p class="text-slate-600 text-sm m-0">Explore the full power of authentication and SDK capabilities</p>
    </div>

    <!-- Status Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Initialization Status -->
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-2 h-2 rounded-full" :class="isInitialized ? 'bg-green-500' : 'bg-slate-300'"></div>
          <h3 class="text-sm font-semibold text-slate-700 m-0">SDK Initialized</h3>
        </div>
        <span :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold font-mono', getStatusColor(isInitialized)]">{{ isInitialized }}</span>
      </div>

      <!-- Loading Status -->
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-2 h-2 rounded-full" :class="!isLoading ? 'bg-green-500' : 'bg-orange-500'"></div>
          <h3 class="text-sm font-semibold text-slate-700 m-0">SDK Ready</h3>
        </div>
        <span :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold font-mono', getStatusColor(!isLoading)]">{{ !isLoading }}</span>
      </div>

      <!-- Auth Status -->
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-2 h-2 rounded-full" :class="isSignedIn ? 'bg-green-500' : 'bg-slate-300'"></div>
          <h3 class="text-sm font-semibold text-slate-700 m-0">Authenticated</h3>
        </div>
        <span :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold font-mono', getStatusColor(isSignedIn)]">{{ isSignedIn }}</span>
      </div>
    </div>

    <!-- Configuration Panel -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 class="text-base font-semibold text-slate-900 m-0">Provider Configuration</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(value, key) in { baseUrl, clientId, afterSignInUrl, signInUrl, signUpUrl, organizationHandle, platform, storage }" :key="key" class="space-y-1">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide">{{ key }}</label>
            <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
              <span class="text-xs text-slate-900 font-mono break-all">{{ value ?? '–' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Authenticated Dashboard ── -->
  <div v-else class="flex flex-col gap-5">

    <!-- Status Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-green-600"></div>
          <span class="text-xs font-semibold text-green-700 uppercase">Initialized</span>
        </div>
        <span class="text-2xl font-bold text-green-900">{{ isInitialized }}</span>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-blue-600"></div>
          <span class="text-xs font-semibold text-blue-700 uppercase">Ready</span>
        </div>
        <span class="text-2xl font-bold text-blue-900">{{ !isLoading }}</span>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-purple-600"></div>
          <span class="text-xs font-semibold text-purple-700 uppercase">Signed In</span>
        </div>
        <span class="text-2xl font-bold text-purple-900">{{ isSignedIn }}</span>
      </div>
    </div>

    <!-- Configuration Panel -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 class="text-base font-semibold text-slate-900 m-0">Provider Configuration</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(value, key) in { baseUrl, clientId, afterSignInUrl, signInUrl, signUpUrl, organizationHandle, platform, storage }" :key="key" class="space-y-1">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide">{{ key }}</label>
            <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
              <span class="text-xs text-slate-900 font-mono break-all">{{ value ?? '–' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Token Operations -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 class="text-base font-semibold text-slate-900 m-0">Token Operations</h3>
        <p class="text-xs text-slate-600 m-0 mt-1">Retrieve and manage authentication tokens</p>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex gap-2 flex-wrap">
          <button class="cursor-pointer border-none rounded-lg px-4 py-2 text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isTokenLoading" @click="fetchAccessToken">
            <span v-if="!isTokenLoading">Get Access Token</span>
            <span v-else class="flex items-center gap-2"><div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Fetching…</span>
          </button>
          <button class="cursor-pointer border-none rounded-lg px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isTokenLoading" @click="fetchIdToken">
            <span v-if="!isTokenLoading">Get ID Token</span>
            <span v-else class="flex items-center gap-2"><div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Fetching…</span>
          </button>
          <button class="cursor-pointer border-none rounded-lg px-4 py-2 text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isTokenLoading" @click="fetchDecodedIdToken">
            <span v-if="!isTokenLoading">Get Decoded ID Token</span>
            <span v-else class="flex items-center gap-2"><div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Fetching…</span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="tokenError" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-700 text-sm m-0 font-medium">Error: {{ tokenError }}</p>
        </div>

        <!-- Token Display (Collapsible) -->
        <div v-if="accessToken" class="bg-slate-50 rounded-lg overflow-hidden">
          <button @click="expandedToken = expandedToken === 'access' ? null : 'access'" class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors">
            <span class="text-sm font-semibold text-slate-700">Access Token</span>
            <svg class="w-4 h-4 text-slate-500 transition-transform" :class="{ 'rotate-180': expandedToken === 'access' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </button>
          <div v-if="expandedToken === 'access'" class="border-t border-slate-200 p-4">
            <pre class="bg-slate-900 text-slate-200 rounded-lg p-3 text-xs overflow-auto max-h-64 font-mono">{{ accessToken }}</pre>
          </div>
        </div>

        <div v-if="idToken" class="bg-slate-50 rounded-lg overflow-hidden">
          <button @click="expandedToken = expandedToken === 'id' ? null : 'id'" class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors">
            <span class="text-sm font-semibold text-slate-700">ID Token</span>
            <svg class="w-4 h-4 text-slate-500 transition-transform" :class="{ 'rotate-180': expandedToken === 'id' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </button>
          <div v-if="expandedToken === 'id'" class="border-t border-slate-200 p-4">
            <pre class="bg-slate-900 text-slate-200 rounded-lg p-3 text-xs overflow-auto max-h-64 font-mono">{{ idToken }}</pre>
          </div>
        </div>

        <div v-if="decodedIdToken" class="bg-slate-50 rounded-lg overflow-hidden">
          <button @click="expandedToken = expandedToken === 'decoded' ? null : 'decoded'" class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors">
            <span class="text-sm font-semibold text-slate-700">Decoded ID Token</span>
            <svg class="w-4 h-4 text-slate-500 transition-transform" :class="{ 'rotate-180': expandedToken === 'decoded' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </button>
          <div v-if="expandedToken === 'decoded'" class="border-t border-slate-200 p-4">
            <pre class="bg-slate-900 text-slate-200 rounded-lg p-3 text-xs overflow-auto max-h-64 font-mono">{{ JSON.stringify(decodedIdToken, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- HTTP Request Panel -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 class="text-base font-semibold text-slate-900 m-0">Authenticated HTTP Request</h3>
        <p class="text-xs text-slate-600 m-0 mt-1">Make authenticated API calls with auto-injected tokens</p>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex gap-2 flex-wrap items-stretch">
          <input
            v-model="httpRequestUrl"
            class="flex-1 min-w-48 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all"
            type="url"
            placeholder="https://api.example.com/endpoint"
          />
          <button class="cursor-pointer border-none rounded-lg px-5 py-2 text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isHttpLoading" @click="makeHttpRequest">
            <span v-if="!isHttpLoading">Send GET</span>
            <span v-else class="flex items-center gap-2"><div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>…</span>
          </button>
        </div>

        <div v-if="httpError" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-700 text-sm m-0 font-medium">Error: {{ httpError }}</p>
        </div>

        <div v-if="httpResponse" class="bg-slate-50 rounded-lg overflow-hidden">
          <pre class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-64 font-mono">{{ httpResponse }}</pre>
        </div>
      </div>
    </div>

    <!-- Silent Sign In Panel -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 class="text-base font-semibold text-slate-900 m-0">Silent Sign In</h3>
        <p class="text-xs text-slate-600 m-0 mt-1">Refresh session without user interaction</p>
      </div>
      <div class="p-6 space-y-4">
        <button class="cursor-pointer border-none rounded-lg px-4 py-2 text-sm font-medium bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors" @click="handleSignInSilently">Attempt Silent Sign In</button>

        <div v-if="silentSignInError" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-700 text-sm m-0 font-medium">Error: {{ silentSignInError }}</p>
        </div>

        <div v-if="silentSignInResult" class="bg-slate-50 rounded-lg overflow-hidden">
          <pre class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-64 font-mono">{{ silentSignInResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>