<script setup lang="ts">
import { ref } from 'vue';
import {
  useAsgardeo,
  Card,
  Typography,
  Button,
  SignInButton,
  BaseSignInButton,
  SignOutButton,
  BaseSignOutButton,
  SignUpButton,
  BaseSignUpButton,
} from '@asgardeo/vue';

const {
  signIn,
  signOut,
  signUp,
  signInSilently,
  clearSession,
} = useAsgardeo();

// Loading states
const customLoading = ref(false);
const manualSignInLoading = ref(false);
const redirectLoading = ref(false);
const silentLoading = ref(false);
const refreshLoading = ref(false);

// Action results
const actionResult = ref<any>(null);
const actionError = ref<string | null>(null);

// Manual sign in handlers
const handleManualSignIn = async () => {
  manualSignInLoading.value = true;
  actionError.value = null;
  actionResult.value = null;
  
  try {
    const result = await signIn();
    actionResult.value = result;
  } catch (error: any) {
    actionError.value = error?.message || String(error);
  } finally {
    manualSignInLoading.value = false;
  }
};

const handleSignInWithRedirect = async () => {
  redirectLoading.value = true;
  actionError.value = null;
  actionResult.value = null;
  
  try {
    // Sign in with custom options
    const result = await signIn({ 
      prompt: 'login', 
      state: 'custom-state',
      // Add any other sign-in options
    });
    actionResult.value = result;
  } catch (error: any) {
    actionError.value = error?.message || String(error);
  } finally {
    redirectLoading.value = false;
  }
};

const handleSignInSilently = async () => {
  silentLoading.value = true;
  actionError.value = null;
  actionResult.value = null;
  
  try {
    const result = await signInSilently();
    actionResult.value = result;
  } catch (error: any) {
    actionError.value = error?.message || String(error);
  } finally {
    silentLoading.value = false;
  }
};

const refreshSession = async () => {
  refreshLoading.value = true;
  actionError.value = null;
  actionResult.value = null;
  
  try {
    const result = await signInSilently();
    actionResult.value = { message: 'Session refreshed', data: result };
  } catch (error: any) {
    actionError.value = error?.message || String(error);
  } finally {
    refreshLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="border-b border-slate-200 pb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Action Components</h2>
      <p class="text-gray-600">Sign in/out buttons and interactive actions</p>
    </div>

    <!-- Sign In Buttons -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Sign In Buttons</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Regular Sign In Button</Typography>
            <div class="flex gap-3 flex-wrap">
              <SignInButton />
              <SignInButton>
                <template #default="{ isLoading }">
                  <span v-if="isLoading">Signing in...</span>
                  <span v-else>Custom Sign In Text</span>
                </template>
              </SignInButton>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Base Sign In Button (Unstyled)</Typography>
            <div class="flex gap-3 flex-wrap">
              <BaseSignInButton class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Base Sign In
              </BaseSignInButton>
              <BaseSignInButton 
                class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" 
                :disabled="customLoading"
              >
                <template #default="{ isLoading }">
                  <span v-if="isLoading">Loading...</span>
                  <span v-else>Custom Base Button</span>
                </template>
              </BaseSignInButton>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Sign Out Buttons -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Sign Out Buttons</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Regular Sign Out Button</Typography>
            <div class="flex gap-3 flex-wrap">
              <SignOutButton />
              <SignOutButton>
                <template #default="{ isLoading }">
                  <span v-if="isLoading">Signing out...</span>
                  <span v-else>Custom Sign Out Text</span>
                </template>
              </SignOutButton>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Base Sign Out Button (Unstyled)</Typography>
            <div class="flex gap-3 flex-wrap">
              <BaseSignOutButton class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Base Sign Out
              </BaseSignOutButton>
              <BaseSignOutButton class="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50">
                <template #default="{ isLoading }">
                  <span v-if="isLoading">Signing out...</span>
                  <span v-else>Custom Base Sign Out</span>
                </template>
              </BaseSignOutButton>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Sign Up Buttons -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Sign Up Buttons</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Regular Sign Up Button</Typography>
            <div class="flex gap-3 flex-wrap">
              <SignUpButton />
              <SignUpButton>
                <template #default="{ isLoading }">
                  <span v-if="isLoading">Creating account...</span>
                  <span v-else>Join Now</span>
                </template>
              </SignUpButton>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Base Sign Up Button (Unstyled)</Typography>
            <div class="flex gap-3 flex-wrap">
              <BaseSignUpButton class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Base Sign Up
              </BaseSignUpButton>
              <BaseSignUpButton class="px-4 py-2 border border-green-300 text-green-600 rounded hover:bg-green-50">
                <template #default="{ isLoading }">
                  <span v-if="isLoading">Creating...</span>
                  <span v-else>Get Started</span>
                </template>
              </BaseSignUpButton>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Custom Action Buttons -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Custom Action Buttons</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Manual Sign In Actions</Typography>
            <div class="flex gap-3 flex-wrap">
              <Button @click="handleManualSignIn" :loading="manualSignInLoading">
                Manual Sign In
              </Button>
              <Button @click="handleSignInWithRedirect" :loading="redirectLoading" variant="outline">
                Sign In with Redirect
              </Button>
              <Button @click="handleSignInSilently" :loading="silentLoading" variant="outline">
                Silent Sign In
              </Button>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Session Management</Typography>
            <div class="flex gap-3 flex-wrap">
              <Button @click="clearSession" variant="outline" color="danger">
                Clear Session
              </Button>
              <Button @click="refreshSession" :loading="refreshLoading" variant="outline">
                Refresh Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Action Results -->
    <Card v-if="actionResult || actionError">
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Action Results</Typography>
        </div>
        <div v-if="actionError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <div class="font-medium mb-1">Error:</div>
          <div class="text-sm">{{ actionError }}</div>
        </div>
        <div v-if="actionResult" class="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          <div class="font-medium mb-1">Success:</div>
          <pre class="text-sm bg-white p-2 rounded mt-2 overflow-auto max-h-40">{{ JSON.stringify(actionResult, null, 2) }}</pre>
        </div>
      </div>
    </Card>
  </div>
</template>
