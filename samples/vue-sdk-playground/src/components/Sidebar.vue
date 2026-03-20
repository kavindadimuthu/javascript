<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { XIcon } from '@asgardeo/vue';
import ThemeSwitcher from './ThemeSwitcher.vue';

const sidebarOpen = ref(false);
const route = useRoute();
const router = useRouter();

const navItems = [
  { path: '/', label: 'Overview', icon: 'home' },
  { path: '/auth-flows', label: 'Auth Flows', icon: 'key' },
  { path: '/components', label: 'Components', icon: 'box' },
  { path: '/public-apis', label: 'Public APIs', icon: 'code' },
];

const isActive = (path: string) => route.path === path;

const navigate = (path: string) => {
  router.push(path);
  sidebarOpen.value = false;
};
</script>

<template>
  <div>
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full md:translate-x-0': !sidebarOpen }"
    >
      <div class="flex items-center justify-between h-16 px-4 bg-gray-900">
        <h1 class="text-lg font-semibold text-white">Vue SDK Demo</h1>
        <div class="flex items-center gap-2">
          <ThemeSwitcher />
          <button @click="sidebarOpen = false" class="md:hidden text-white">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
      <nav class="mt-4">
        <div class="px-2 space-y-1">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigate(item.path)"
            class="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isActive(item.path) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            <!-- Home icon -->
            <svg v-if="item.icon === 'home'" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <!-- Key icon -->
            <svg v-else-if="item.icon === 'key'" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <!-- Box icon -->
            <svg v-else-if="item.icon === 'box'" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <!-- Code icon -->
            <svg v-else-if="item.icon === 'code'" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {{ item.label }}
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile menu toggle button -->
    <div class="fixed top-4 left-4 z-40 md:hidden">
      <button @click="sidebarOpen = !sidebarOpen" class="bg-white p-2 rounded-md shadow-md">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-30 bg-black opacity-25 md:hidden"
    ></div>
  </div>
</template>
