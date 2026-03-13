<script setup lang="ts">
import { useAsgardeo } from '@asgardeo/vue';

const {
  isSignedIn,
  signIn,
  signOut,
  signUp,
  signInSilently,
  clearSession,
} = useAsgardeo();
</script>

<template>
  <div class="flex gap-2 flex-wrap items-center justify-end">
    <!-- Unauthenticated State -->
    <template v-if="!isSignedIn">
      <button
        class="cursor-pointer border-none rounded-lg px-4 py-2 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-orange-500 text-white hover:bg-orange-600"
        @click="signIn()"
      >
        Sign In
      </button>
      <button
        class="cursor-pointer border-none rounded-lg px-4 py-2 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-white text-slate-900 border border-slate-300 hover:bg-slate-50"
        @click="signUp()"
      >
        Create Account
      </button>
    </template>

    <!-- Authenticated State -->
    <template v-else>
      <button
        class="cursor-pointer border-none rounded-lg px-3 py-2 text-xs font-medium bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
        @click="signInSilently()"
      >
        Refresh
      </button>
      <button
        class="cursor-pointer border-none rounded-lg px-3 py-2 text-xs font-medium bg-transparent text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors"
        @click="clearSession()"
      >
        Clear Session
      </button>
      <button
        class="cursor-pointer border-none rounded-lg px-3 py-2 text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
        @click="signOut()"
      >
        Sign Out
      </button>
    </template>
  </div>
</template>
