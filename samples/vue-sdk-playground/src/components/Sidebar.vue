<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { XIcon } from '@asgardeo/vue';

const sidebarOpen = ref(false);
const route = useRoute();
const router = useRouter();

const navItems = [
  { path: '/', label: 'Overview' },
  { path: '/actions', label: 'Action Components' },
  { path: '/primitives', label: 'Primitive Components' },
  { path: '/presentation', label: 'Presentation Components' },
  { path: '/control', label: 'Control Components' },
  { path: '/adapters', label: 'Social Login Adapters' },
  { path: '/auth-flow', label: 'Auth Flow Components' },
  { path: '/factories', label: 'Field Factory' },
  { path: '/composables', label: 'Composables Demo' },
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
        <button @click="sidebarOpen = false" class="md:hidden text-white">
          <XIcon class="h-6 w-6" />
        </button>
      </div>
      <nav class="mt-4">
        <div class="px-2 space-y-1">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigate(item.path)"
            class="w-full text-left block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isActive(item.path) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
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
