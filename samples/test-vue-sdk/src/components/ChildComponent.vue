<script setup lang="ts">
import { ref } from 'vue';
import { useAsgardeo, SignInButton, SignedIn, SignedOut } from '@asgardeo/vue';
import type { IdToken, HttpRequestConfig } from '@asgardeo/vue';
// import { useUser } from '@asgardeo/vue';

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

async function fetchAccessToken() {
  isTokenLoading.value = true;
  tokenError.value = null;
  try {
    accessToken.value = await getAccessToken();
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
  <!-- ── Global Loading State ── -->
  <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
    <div class="w-9 h-9 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
    <p>Initializing Asgardeo…</p>
  </div>

  <!-- ── Unauthenticated View ── -->
  <div v-else-if="!isSignedIn" class="flex flex-col gap-5">
    <div class="bg-white border border-slate-200 rounded-xl p-10 text-center">
      <h2 class="text-2xl font-semibold mb-2 m-0">Welcome to Vue SDK Test App</h2>
      <p class="text-slate-500 mb-6">Sign in to explore all Asgardeo Vue SDK features.</p>
      <div class="flex gap-3 flex-wrap items-center justify-center">
        <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-orange-500 text-white" @click="signIn()">Sign In</button>
        <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-slate-100 text-slate-900" @click="signUp()">Sign Up</button>
        <SignInButton />
        <!-- <SignOutButton /> -->
        <SignedIn>
          <span>Hi boss</span>
        </SignedIn>
        <SignedOut>
          <span>Hi guest</span>
        </SignedOut>
      </div>
    </div>

    <!-- SDK Initialization status even before sign-in -->
    <div class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">SDK Initialization Status</h3>
      <div class="grid grid-cols-[max-content_1fr] gap-y-1 gap-x-5 items-center">
        <span class="text-sm font-medium text-slate-500">isInitialized</span>
        <span :class="['inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono', isInitialized ? 'bg-green-100 text-green-900' : 'bg-slate-100 text-slate-700']">{{ isInitialized }}</span>
        <span class="text-sm font-medium text-slate-500">isLoading</span>
        <span :class="['inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono', isLoading ? 'bg-green-100 text-green-900' : 'bg-slate-100 text-slate-700']">{{ isLoading }}</span>
        <span class="text-sm font-medium text-slate-500">isSignedIn</span>
        <span :class="['inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono', isSignedIn ? 'bg-green-100 text-green-900' : 'bg-slate-100 text-slate-700']">{{ isSignedIn }}</span>
      </div>
    </div>

    <!-- Config read-out -->
    <div class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">Provider Configuration</h3>
      <div class="grid grid-cols-[max-content_1fr] gap-y-1 gap-x-5 items-center">
        <span class="text-sm font-medium text-slate-500">baseUrl</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ baseUrl ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">clientId</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ clientId ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">afterSignInUrl</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ afterSignInUrl ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">signInUrl</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ signInUrl ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">signUpUrl</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ signUpUrl ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">organizationHandle</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ organizationHandle ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">platform</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ platform ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">storage</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ storage ?? '–' }}</span>
      </div>
    </div>
  </div>

  <!-- ── Authenticated Dashboard ── -->
  <div v-else class="flex flex-col gap-5">

    <!-- Header row -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <h2 class="m-0 text-2xl text-slate-900">Asgardeo Vue SDK — Feature Dashboard</h2>
      <div class="flex gap-3 flex-wrap items-center">
        <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-red-400 text-white" @click="signOut()">Sign Out</button>
        <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-transparent text-slate-500 border border-slate-200" @click="clearSession()">Clear Session</button>
      </div>
    </div>

    <!-- ── Section 1: Auth State ── -->
    <section class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">1. Authentication State</h3>
      <div class="grid grid-cols-[max-content_1fr] gap-y-1 gap-x-5 items-center">
        <span class="text-sm font-medium text-slate-500">isInitialized</span>
        <span :class="['inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono', isInitialized ? 'bg-green-100 text-green-900' : 'bg-slate-100 text-slate-700']">{{ isInitialized }}</span>
        <span class="text-sm font-medium text-slate-500">isLoading</span>
        <span :class="['inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono', isLoading ? 'bg-green-100 text-green-900' : 'bg-slate-100 text-slate-700']">{{ isLoading }}</span>
        <span class="text-sm font-medium text-slate-500">isSignedIn</span>
        <span :class="['inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono', isSignedIn ? 'bg-green-100 text-green-900' : 'bg-slate-100 text-slate-700']">{{ isSignedIn }}</span>
      </div>
    </section>

    <!-- ── Section 2: User Profile ── -->
    <!--<section class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">2. User Profile (<code>user</code>)</h3>
      <div v-if="user" class="flex items-center gap-4 mb-2">
        <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 text-lg font-bold flex items-center justify-center flex-shrink-0">{{ (user?.name?.givenName ?? user?.username ?? '?')[0].toUpperCase() }}</div>
        <div>
          <p class="font-semibold m-0">{{ user?.name?.givenName }} {{ user?.name?.familyName }}</p>
          <p class="text-slate-500 m-2 text-sm">{{ user?.emails?.[0] ?? user?.email ?? '–' }}</p>
          <p class="text-slate-400 m-0 text-xs">sub: <code class="font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ user?.sub ?? user?.id ?? '–' }}</code></p>
        </div>
      </div>
      <div class="grid grid-cols-[max-content_1fr] gap-y-1 gap-x-5 items-center mt-3">
        <span class="text-sm font-medium text-slate-500">username</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ user?.userName ?? user?.username ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">givenName</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ user?.name?.givenName ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">familyName</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ user?.name?.familyName ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">emails</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ user?.emails?.join(', ') ?? '–' }}</span>
      </div>
      <details class="mt-3 cursor-pointer">
        <summary class="text-sm text-slate-500 cursor-pointer">Raw user object</summary>
        <pre class="bg-slate-50 rounded-lg p-3 text-xs overflow-auto max-h-70 mt-2 font-mono">{{ JSON.stringify(user, null, 2) }}</pre>
      </details>
    </section>-->

    <!-- ── Section 3: Organization ── 
    <section class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">3. Organization (<code>organization</code>)</h3>
      <div v-if="organization" class="grid grid-cols-[max-content_1fr] gap-y-1 gap-x-5 items-center">
        <span class="text-sm font-medium text-slate-500">name</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ organization.name ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">id</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ organization.id ?? '–' }}</span>
      </div>
      <p v-else class="text-slate-500 text-sm m-0">No organization in context.</p>
    </section>-->

    <!-- ── Section 4: Provider Configuration ── -->
    <section class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">4. Provider Configuration</h3>
      <div class="grid grid-cols-[max-content_1fr] gap-y-1 gap-x-5 items-center">
        <span class="text-sm font-medium text-slate-500">baseUrl</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ baseUrl ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">clientId</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ clientId ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">afterSignInUrl</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ afterSignInUrl ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">signInUrl</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ signInUrl ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">signUpUrl</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ signUpUrl ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">organizationHandle</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ organizationHandle ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">platform</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ platform ?? '–' }}</span>
        <span class="text-sm font-medium text-slate-500">storage</span>
        <span class="text-sm text-slate-900 break-words font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{{ storage ?? '–' }}</span>
      </div>
    </section>

    <!-- ── Section 5: Token Operations ── -->
    <section class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">5. Token Operations</h3>
      <div class="flex gap-3 flex-wrap items-center mb-3">
        <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-slate-100 text-slate-900" :disabled="isTokenLoading" @click="fetchAccessToken">Get Access Token</button>
        <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-slate-100 text-slate-900" :disabled="isTokenLoading" @click="fetchIdToken">Get ID Token</button>
        <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-slate-100 text-slate-900" :disabled="isTokenLoading" @click="fetchDecodedIdToken">Get Decoded ID Token</button>
      </div>
      <p v-if="tokenError" class="text-red-600 text-sm my-2">{{ tokenError }}</p>
      <div v-if="accessToken" class="mb-3">
        <label class="block text-xs font-semibold text-slate-500 mb-1">Access Token</label>
        <pre class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-70 mb-3 font-mono">{{ accessToken }}</pre>
      </div>
      <div v-if="idToken" class="mb-3">
        <label class="block text-xs font-semibold text-slate-500 mb-1">ID Token</label>
        <pre class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-70 mb-3 font-mono">{{ idToken }}</pre>
      </div>
      <div v-if="decodedIdToken" class="mb-3">
        <label class="block text-xs font-semibold text-slate-500 mb-1">Decoded ID Token</label>
        <pre class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-70 mb-3 font-mono">{{ JSON.stringify(decodedIdToken, null, 2) }}</pre>
      </div>
    </section>

    <!-- ── Section 6: HTTP Request ── -->
    <section class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">6. Authenticated HTTP Request (<code>http.request</code>)</h3>
      <div class="flex gap-3 flex-wrap items-stretch mb-3">
        <input
          v-model="httpRequestUrl"
          class="flex-1 min-w-52 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          type="url"
          placeholder="https://..."
        />
        <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-slate-100 text-slate-900" :disabled="isHttpLoading" @click="makeHttpRequest">
          {{ isHttpLoading ? 'Requesting…' : 'Send GET Request' }}
        </button>
      </div>
      <p v-if="httpError" class="text-red-600 text-sm my-2">{{ httpError }}</p>
      <pre v-if="httpResponse" class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-70 mb-3 font-mono">{{ httpResponse }}</pre>
    </section>

    <!-- ── Section 7: Sign In Silently ── -->
    <section class="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <h3 class="m-0 mb-4 text-base font-semibold text-slate-700 border-b border-slate-100 pb-2">7. Silent Sign In (<code>signInSilently</code>)</h3>
      <p class="text-slate-500 text-sm m-0 mb-3">Attempts to refresh the session without user interaction.</p>
      <button class="cursor-pointer border-none rounded-lg px-4.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 bg-slate-100 text-slate-900" @click="handleSignInSilently">Sign In Silently</button>
      <p v-if="silentSignInError" class="text-red-600 text-sm my-2">{{ silentSignInError }}</p>
      <pre v-if="silentSignInResult" class="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs overflow-auto max-h-70 mb-3 font-mono mt-2">{{ silentSignInResult }}</pre>
    </section>

  </div>
</template>