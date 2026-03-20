<script setup lang="ts">
import { ref } from 'vue';
import {
  useAsgardeo,
  useFlow,
  useFlowMeta,
  SignIn,
  SignUp,
  SignInButton,
  SignOutButton,
  SignUpButton,
  BaseSignInButton,
  BaseSignOutButton,
  BaseSignUpButton,
  GoogleButton,
  GitHubButton,
  MicrosoftButton,
  FacebookButton,
} from '@asgardeo/vue';
import PageHeader from '../components/layout/PageHeader.vue';
import SectionCard from '../components/layout/SectionCard.vue';
import TabGroup from '../components/layout/TabGroup.vue';
import CodeBlock from '../components/layout/CodeBlock.vue';
import ResultPanel from '../components/shared/ResultPanel.vue';
import EventLog from '../components/shared/EventLog.vue';

const { signIn, signInSilently } = useAsgardeo();

const activeTab = ref('redirect');
const tabs = [
  { key: 'redirect', label: 'Redirect Flow' },
  { key: 'app-native', label: 'App-Native Flow' },
];

// Advanced actions state
const advancedResult = ref<unknown>(undefined);
const advancedError = ref<string | undefined>(undefined);
const isAdvancedLoading = ref(false);

async function handleSignInWithPrompt() {
  isAdvancedLoading.value = true;
  advancedError.value = undefined;
  advancedResult.value = undefined;
  try {
    await signIn();
    advancedResult.value = 'Sign in initiated (redirect expected)';
  } catch (e: any) {
    advancedError.value = e?.message ?? String(e);
  } finally {
    isAdvancedLoading.value = false;
  }
}

async function handleSilentSignIn() {
  isAdvancedLoading.value = true;
  advancedError.value = undefined;
  advancedResult.value = undefined;
  try {
    const result = await signInSilently();
    advancedResult.value = result ?? 'Silent sign in completed';
  } catch (e: any) {
    advancedError.value = e?.message ?? String(e);
  } finally {
    isAdvancedLoading.value = false;
  }
}

// Social login event log
const socialEvents = ref<LogEvent[]>([]);

function logSocialEvent(provider: string) {
  socialEvents.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    type: 'info',
    data: `${provider} button clicked`,
  });
}

const callbackSnippet = `import { createCallbackRoute } from '@asgardeo/vue'

// In your router definition:
const router = createRouter({
  routes: [
    // ... your routes
    createCallbackRoute({ path: '/callback' }),
  ],
})`;

const guardSnippet = `import { createAsgardeoGuard } from '@asgardeo/vue'

// After creating the router:
router.beforeEach(createAsgardeoGuard({ redirectTo: '/login' }))`;

const flowSteps = [
  { step: 1, title: 'User clicks Sign In', detail: 'Redirect to Asgardeo authorization endpoint' },
  { step: 2, title: 'User authenticates', detail: 'User enters credentials at the identity provider' },
  { step: 3, title: 'Redirect back with code', detail: 'Asgardeo redirects to your callback URL with an authorization code' },
  { step: 4, title: '<Callback> exchanges code', detail: 'The Callback component handles the code → token exchange' },
  { step: 5, title: 'Authenticated', detail: 'SDK stores tokens securely and user is signed in' },
];

// App-native: flow state
const { currentStep, title: flowTitle, subtitle: flowSubtitle, messages, isLoading: flowLoading, showBackButton } = useFlow();
const { meta, isLoading: metaLoading, error: metaError, fetchFlowMeta } = useFlowMeta();

// App-native: shared event log
type LogEvent = { timestamp: string; type: string; data?: unknown };
const nativeEvents = ref<LogEvent[]>([]);

function logNativeEvent(type: string, eventType: string, data?: unknown) {
  nativeEvents.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    type,
    data: data !== undefined ? data : eventType,
  });
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Auth Flows"
      description="Demonstrate redirect-based and app-native authentication flows."
    />

    <TabGroup :tabs="tabs" v-model="activeTab">
      <!-- ─── Redirect Tab ─── -->
      <template #redirect>
        <div class="space-y-6">

          <!-- 1. Authentication Buttons -->
          <SectionCard title="Authentication Buttons" description="Standard and customized sign-in/out/up buttons.">
            <div class="space-y-4">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Standard Buttons</p>
                <div class="flex flex-wrap gap-3">
                  <SignInButton />
                  <SignOutButton />
                  <SignUpButton />
                </div>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">With Custom Slot</p>
                <div class="flex flex-wrap gap-3">
                  <SignInButton v-slot="{ isLoading }">
                    <span>{{ isLoading ? 'Signing in...' : 'Custom Sign In' }}</span>
                  </SignInButton>
                  <SignOutButton v-slot="{ isLoading }">
                    <span>{{ isLoading ? 'Signing out...' : 'Custom Sign Out' }}</span>
                  </SignOutButton>
                  <SignUpButton v-slot="{ isLoading }">
                    <span>{{ isLoading ? 'Redirecting...' : 'Custom Sign Up' }}</span>
                  </SignUpButton>
                </div>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Base (Unstyled) Buttons</p>
                <div class="flex flex-wrap gap-3">
                  <BaseSignInButton class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded text-sm font-medium hover:bg-indigo-200 transition-colors">
                    Base Sign In
                  </BaseSignInButton>
                  <BaseSignOutButton class="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors">
                    Base Sign Out
                  </BaseSignOutButton>
                  <BaseSignUpButton class="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors">
                    Base Sign Up
                  </BaseSignUpButton>
                </div>
              </div>
            </div>
          </SectionCard>

          <!-- 2. Advanced Actions -->
          <SectionCard title="Advanced Actions" description="Programmatic sign-in methods with custom options.">
            <div class="flex flex-wrap gap-3 mb-4">
              <button
                type="button"
                class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                :disabled="isAdvancedLoading"
                @click="handleSignInWithPrompt"
              >
                Sign In with Prompt
              </button>
              <button
                type="button"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                :disabled="isAdvancedLoading"
                @click="handleSilentSignIn"
              >
                Silent Sign In
              </button>
            </div>
            <ResultPanel :result="advancedResult" :isLoading="isAdvancedLoading" :error="advancedError" />
          </SectionCard>

          <!-- 3. Social Login -->
          <SectionCard title="Social Login" description="Social login adapter buttons.">
            <div class="flex flex-wrap gap-3 mb-4">
              <GoogleButton @click="logSocialEvent('Google')" />
              <GitHubButton @click="logSocialEvent('GitHub')" />
              <MicrosoftButton @click="logSocialEvent('Microsoft')" />
              <FacebookButton @click="logSocialEvent('Facebook')" />
            </div>
            <EventLog :events="socialEvents" />
          </SectionCard>

          <!-- 4. OAuth2 Redirect Flow -->
          <SectionCard title="OAuth2 Redirect Flow" description="How the redirect-based authentication flow works.">
            <ol class="space-y-3 mb-6">
              <li
                v-for="s in flowSteps"
                :key="s.step"
                class="flex items-start gap-3"
              >
                <span class="shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {{ s.step }}
                </span>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ s.title }}</p>
                  <p class="text-xs text-gray-500">{{ s.detail }}</p>
                </div>
              </li>
            </ol>

            <div class="space-y-4">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Callback Route Setup</p>
                <CodeBlock :code="callbackSnippet" language="typescript" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Route Guard Setup</p>
                <CodeBlock :code="guardSnippet" language="typescript" />
              </div>
            </div>
          </SectionCard>

        </div>
      </template>

      <!-- ─── App-Native Tab ─── -->
      <template #app-native>
        <div class="space-y-6">

          <!-- 1. Embedded Sign In -->
          <SectionCard title="Embedded Sign In" description="Server-driven sign-in form rendered inside your app.">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div>
                <SignIn
                  @complete="logNativeEvent('success', 'sign-in:complete', $event)"
                  @error="logNativeEvent('error', 'sign-in:error', $event)"
                  @flow-change="logNativeEvent('info', 'sign-in:flowChange', $event)"
                />
              </div>
              <div class="space-y-3 text-sm text-gray-600">
                <p>
                  The <code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">&lt;SignIn /&gt;</code> component
                  renders a fully styled, server-driven authentication form embedded directly in your app — no redirect required.
                </p>
                <p>It handles multi-step flows (OTP, TOTP, passkeys) automatically as the server drives the flow.</p>
                <p class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                  ⚠ Requires <code class="font-mono">applicationId</code> prop on <code class="font-mono">&lt;AsgardeoProvider&gt;</code>.
                </p>
                <p class="font-medium text-gray-700">Events emitted:</p>
                <ul class="list-disc list-inside space-y-1 text-xs">
                  <li><code class="font-mono">@complete</code> — authentication succeeded</li>
                  <li><code class="font-mono">@error</code> — flow error occurred</li>
                  <li><code class="font-mono">@flow-change</code> — flow step changed</li>
                </ul>
              </div>
            </div>
          </SectionCard>

          <!-- 2. Embedded Sign Up -->
          <SectionCard title="Embedded Sign Up" description="Server-driven sign-up form rendered inside your app.">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div>
                <SignUp
                  @complete="logNativeEvent('success', 'sign-up:complete', $event)"
                  @error="logNativeEvent('error', 'sign-up:error', $event)"
                  @flow-change="logNativeEvent('info', 'sign-up:flowChange', $event)"
                />
              </div>
              <div class="space-y-3 text-sm text-gray-600">
                <p>
                  The <code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">&lt;SignUp /&gt;</code> component
                  renders a styled self-registration form driven by the Asgardeo flow API.
                </p>
                <p>Supports custom fields, multi-step verification, and consent steps as configured on the server.</p>
                <p class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                  ⚠ Requires <code class="font-mono">applicationId</code> prop on <code class="font-mono">&lt;AsgardeoProvider&gt;</code>.
                </p>
                <p class="font-medium text-gray-700">Events emitted:</p>
                <ul class="list-disc list-inside space-y-1 text-xs">
                  <li><code class="font-mono">@complete</code> — registration succeeded</li>
                  <li><code class="font-mono">@error</code> — flow error occurred</li>
                  <li><code class="font-mono">@flow-change</code> — flow step changed</li>
                </ul>
              </div>
            </div>
          </SectionCard>

          <!-- 3. Flow State Inspector -->
          <SectionCard title="Flow State Inspector" description="Live reactive state from useFlow() and useFlowMeta().">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- useFlow() -->
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">useFlow()</p>
                <table class="w-full text-sm">
                  <tbody class="divide-y divide-gray-100">
                    <tr>
                      <td class="py-1.5 pr-4 text-gray-500 w-36">currentStep</td>
                      <td class="py-1.5 font-mono text-gray-800">{{ currentStep ?? '—' }}</td>
                    </tr>
                    <tr>
                      <td class="py-1.5 pr-4 text-gray-500">title</td>
                      <td class="py-1.5 font-mono text-gray-800">{{ flowTitle ?? '—' }}</td>
                    </tr>
                    <tr>
                      <td class="py-1.5 pr-4 text-gray-500">subtitle</td>
                      <td class="py-1.5 font-mono text-gray-800">{{ flowSubtitle ?? '—' }}</td>
                    </tr>
                    <tr>
                      <td class="py-1.5 pr-4 text-gray-500">isLoading</td>
                      <td class="py-1.5 font-mono" :class="flowLoading ? 'text-yellow-600' : 'text-gray-800'">{{ flowLoading }}</td>
                    </tr>
                    <tr>
                      <td class="py-1.5 pr-4 text-gray-500">showBackButton</td>
                      <td class="py-1.5 font-mono text-gray-800">{{ showBackButton }}</td>
                    </tr>
                    <tr>
                      <td class="py-1.5 pr-4 text-gray-500 align-top">messages</td>
                      <td class="py-1.5 font-mono text-gray-800 text-xs">
                        <pre class="whitespace-pre-wrap">{{ JSON.stringify(messages, null, 2) }}</pre>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- useFlowMeta() -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">useFlowMeta()</p>
                  <button
                    type="button"
                    class="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    :disabled="metaLoading"
                    @click="fetchFlowMeta()"
                  >
                    {{ metaLoading ? 'Loading...' : 'Fetch Flow Meta' }}
                  </button>
                </div>
                <table class="w-full text-sm mb-3">
                  <tbody class="divide-y divide-gray-100">
                    <tr>
                      <td class="py-1.5 pr-4 text-gray-500 w-20">isLoading</td>
                      <td class="py-1.5 font-mono" :class="metaLoading ? 'text-yellow-600' : 'text-gray-800'">{{ metaLoading }}</td>
                    </tr>
                    <tr v-if="metaError">
                      <td class="py-1.5 pr-4 text-gray-500">error</td>
                      <td class="py-1.5 font-mono text-red-600 text-xs">{{ metaError }}</td>
                    </tr>
                  </tbody>
                </table>
                <p class="text-xs text-gray-500 mb-1">meta</p>
                <ResultPanel :result="meta" :isLoading="metaLoading" :error="metaError?.toString()" />
              </div>
            </div>
          </SectionCard>

          <!-- 4. Shared Event Log -->
          <SectionCard title="Event Log" description="Events emitted by SignIn and SignUp components.">
            <EventLog :events="nativeEvents" />
          </SectionCard>

        </div>
      </template>
    </TabGroup>
  </div>
</template>
