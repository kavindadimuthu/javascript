<script setup lang="ts">
import { ref } from 'vue'
import { useAsgardeo } from '@asgardeo/vue'
import ResultPanel from '../../components/shared/ResultPanel.vue'
import SectionCard from '../../components/layout/SectionCard.vue'

const {
  isSignedIn,
  isLoading,
  isInitialized,
  clientId,
  baseUrl,
  signIn,
  signOut,
  signUp,
  signInSilently,
  getAccessToken,
  getIdToken,
  getDecodedIdToken,
  http,
} = useAsgardeo()

// ── silently ─────────────────────────────────────────────────────────────────
const silentResult = ref<string | null>(null)
const silentLoading = ref(false)
const silentError = ref<string | null>(null)

async function runSignInSilently() {
  silentLoading.value = true
  silentError.value = null
  silentResult.value = null
  try {
    const result = await signInSilently()
    silentResult.value = JSON.stringify(result, null, 2)
  } catch (e: unknown) {
    silentError.value = e instanceof Error ? e.message : String(e)
  } finally {
    silentLoading.value = false
  }
}

// ── getAccessToken ────────────────────────────────────────────────────────────
const accessTokenResult = ref<string | null>(null)
const accessTokenLoading = ref(false)
const accessTokenError = ref<string | null>(null)

async function runGetAccessToken() {
  accessTokenLoading.value = true
  accessTokenError.value = null
  accessTokenResult.value = null
  try {
    const token = await getAccessToken()
    accessTokenResult.value = token.length > 60 ? `${token.slice(0, 60)}…` : token
  } catch (e: unknown) {
    accessTokenError.value = e instanceof Error ? e.message : String(e)
  } finally {
    accessTokenLoading.value = false
  }
}

// ── getIdToken ────────────────────────────────────────────────────────────────
const idTokenResult = ref<string | null>(null)
const idTokenLoading = ref(false)
const idTokenError = ref<string | null>(null)

async function runGetIdToken() {
  idTokenLoading.value = true
  idTokenError.value = null
  idTokenResult.value = null
  try {
    const token = await getIdToken()
    idTokenResult.value = token.length > 60 ? `${token.slice(0, 60)}…` : token
  } catch (e: unknown) {
    idTokenError.value = e instanceof Error ? e.message : String(e)
  } finally {
    idTokenLoading.value = false
  }
}

// ── getDecodedIdToken ─────────────────────────────────────────────────────────
const decodedResult = ref<string | null>(null)
const decodedLoading = ref(false)
const decodedError = ref<string | null>(null)

async function runGetDecodedIdToken() {
  decodedLoading.value = true
  decodedError.value = null
  decodedResult.value = null
  try {
    const decoded = await getDecodedIdToken()
    decodedResult.value = JSON.stringify(decoded, null, 2)
  } catch (e: unknown) {
    decodedError.value = e instanceof Error ? e.message : String(e)
  } finally {
    decodedLoading.value = false
  }
}

// ── HTTP client ───────────────────────────────────────────────────────────────
const httpEndpoint = ref('/scim2/Me')
const httpMethod = ref('GET')
const httpBody = ref('')
const httpResult = ref<string | null>(null)
const httpLoading = ref(false)
const httpError = ref<string | null>(null)

const methodsWithBody = ['POST', 'PUT', 'PATCH']

async function runHttpRequest() {
  httpLoading.value = true
  httpError.value = null
  httpResult.value = null
  try {
    const config: Record<string, unknown> = {
      url: httpEndpoint.value,
      method: httpMethod.value,
    }
    if (methodsWithBody.includes(httpMethod.value) && httpBody.value.trim()) {
      config.data = JSON.parse(httpBody.value)
    }
    const response = await http.request(config as unknown as Parameters<typeof http.request>[0])
    httpResult.value = JSON.stringify(response?.data ?? response, null, 2)
  } catch (e: unknown) {
    httpError.value = e instanceof Error ? e.message : String(e)
  } finally {
    httpLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">

    <!-- ── Reactive State ─────────────────────────────────────────────────── -->
    <SectionCard title="Reactive State">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-2 pr-6 font-medium text-gray-500">Property</th>
              <th class="pb-2 font-medium text-gray-500">Value</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="py-2 pr-6 font-mono text-xs text-gray-600">isSignedIn</td>
              <td class="py-2">
                <span
                  :class="isSignedIn
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'"
                  class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                >{{ isSignedIn }}</span>
              </td>
            </tr>
            <tr>
              <td class="py-2 pr-6 font-mono text-xs text-gray-600">isLoading</td>
              <td class="py-2">
                <span
                  :class="isLoading
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-600'"
                  class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                >{{ isLoading }}</span>
              </td>
            </tr>
            <tr>
              <td class="py-2 pr-6 font-mono text-xs text-gray-600">isInitialized</td>
              <td class="py-2">
                <span
                  :class="isInitialized
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'"
                  class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                >{{ isInitialized }}</span>
              </td>
            </tr>
            <tr>
              <td class="py-2 pr-6 font-mono text-xs text-gray-600">clientId</td>
              <td class="py-2 font-mono text-xs text-gray-700">{{ clientId || '—' }}</td>
            </tr>
            <tr>
              <td class="py-2 pr-6 font-mono text-xs text-gray-600">baseUrl</td>
              <td class="py-2 font-mono text-xs text-gray-700 break-all">{{ baseUrl || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionCard>

    <!-- ── Auth Actions (redirect) ────────────────────────────────────────── -->
    <SectionCard title="Auth Actions (Redirect)">
      <p class="mb-4 text-xs text-gray-500">
        These methods trigger a full-page redirect. The page will navigate away.
      </p>
      <div class="flex flex-wrap gap-3">
        <button
          class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
          @click="signIn()"
        >
          signIn()
        </button>
        <button
          class="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 active:scale-95 transition-all"
          @click="signOut()"
        >
          signOut()
        </button>
        <button
          class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 active:scale-95 transition-all"
          @click="signUp()"
        >
          signUp()
        </button>
      </div>
    </SectionCard>

    <!-- ── signInSilently ─────────────────────────────────────────────────── -->
    <SectionCard title="signInSilently()">
      <p class="mb-3 text-xs text-gray-500">
        Attempts a silent token refresh via a hidden iframe. Returns the updated
        <code class="font-mono">User</code> object on success, or <code class="font-mono">false</code> if not possible.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="silentLoading"
        @click="runSignInSilently"
      >
        {{ silentLoading ? 'Running…' : 'Run signInSilently()' }}
      </button>
      <ResultPanel
        class="mt-3"
        :result="silentResult"
        :error="silentError"
        :loading="silentLoading"
      />
    </SectionCard>

    <!-- ── getAccessToken ─────────────────────────────────────────────────── -->
    <SectionCard title="getAccessToken()">
      <p class="mb-3 text-xs text-gray-500">
        Retrieves the current access token from storage. First 60 characters shown.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="accessTokenLoading"
        @click="runGetAccessToken"
      >
        {{ accessTokenLoading ? 'Loading…' : 'Run getAccessToken()' }}
      </button>
      <ResultPanel
        class="mt-3"
        :result="accessTokenResult"
        :error="accessTokenError"
        :loading="accessTokenLoading"
      />
    </SectionCard>

    <!-- ── getIdToken ─────────────────────────────────────────────────────── -->
    <SectionCard title="getIdToken()">
      <p class="mb-3 text-xs text-gray-500">
        Retrieves the raw ID token (JWT string). First 60 characters shown.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="idTokenLoading"
        @click="runGetIdToken"
      >
        {{ idTokenLoading ? 'Loading…' : 'Run getIdToken()' }}
      </button>
      <ResultPanel
        class="mt-3"
        :result="idTokenResult"
        :error="idTokenError"
        :loading="idTokenLoading"
      />
    </SectionCard>

    <!-- ── getDecodedIdToken ──────────────────────────────────────────────── -->
    <SectionCard title="getDecodedIdToken()">
      <p class="mb-3 text-xs text-gray-500">
        Decodes and returns the ID token payload as a structured object.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="decodedLoading"
        @click="runGetDecodedIdToken"
      >
        {{ decodedLoading ? 'Loading…' : 'Run getDecodedIdToken()' }}
      </button>
      <ResultPanel
        class="mt-3"
        :result="decodedResult"
        :error="decodedError"
        :loading="decodedLoading"
      />
    </SectionCard>

    <!-- ── HTTP Client ────────────────────────────────────────────────────── -->
    <SectionCard title="http.request()">
      <p class="mb-4 text-xs text-gray-500">
        Makes an authenticated HTTP request using the access token. The base URL
        is prepended automatically. Defaults to <code class="font-mono">/scim2/Me</code> (current user profile).
      </p>

      <div class="space-y-3">
        <!-- Endpoint + Method row -->
        <div class="flex gap-2">
          <select
            v-model="httpMethod"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
          <input
            v-model="httpEndpoint"
            type="text"
            placeholder="/scim2/Me"
            class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Body (only for POST/PUT/PATCH) -->
        <textarea
          v-if="methodsWithBody.includes(httpMethod)"
          v-model="httpBody"
          placeholder='{ "key": "value" }'
          rows="4"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />

        <button
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="httpLoading"
          @click="runHttpRequest"
        >
          {{ httpLoading ? 'Sending…' : 'Send Request' }}
        </button>
      </div>

      <ResultPanel
        class="mt-4"
        :result="httpResult"
        :error="httpError"
        :loading="httpLoading"
      />
    </SectionCard>

  </div>
</template>
