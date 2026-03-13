<script setup lang="ts">
import { ref } from 'vue';
import { XIcon } from '@asgardeo/vue';

// Import section components
import OverviewSection from './sections/OverviewSection.vue';
import ActionsSection from './sections/ActionsSection.vue';
import PrimitivesSection from './sections/PrimitivesSection.vue';
import PresentationSection from './sections/PresentationSection.vue';
import ControlSection from './sections/ControlSection.vue';
import AdaptersSection from './sections/AdaptersSection.vue';
import AuthFlowSection from './sections/AuthFlowSection.vue';
import FactoriesSection from './sections/FactoriesSection.vue';
import ComposablesSection from './sections/ComposablesSection.vue';

const sidebarOpen = ref(false);
const activeSection = ref('overview');

const sectionsList = [
  { id: 'overview', title: 'Overview' },
  { id: 'actions', title: 'Action Components' },
  { id: 'primitives', title: 'Primitive Components' },
  { id: 'presentation', title: 'Presentation Components' },
  { id: 'control', title: 'Control Components' },
  { id: 'adapters', title: 'Social Login Adapters' },
  { id: 'auth-flow', title: 'Auth Flow Components' },
  { id: 'factories', title: 'Field Factory' },
  { id: 'composables', title: 'Composables Demo' },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out" :class="{'translate-x-0': sidebarOpen, '-translate-x-full md:translate-x-0': !sidebarOpen}">
      <div class="flex items-center justify-between h-16 px-4 bg-gray-900">
        <h1 class="text-lg font-semibold text-white">Vue SDK Demo</h1>
        <button @click="sidebarOpen = !sidebarOpen" class="md:hidden text-white">
          <XIcon class="h-6 w-6" />
        </button>
      </div>
      <nav class="mt-4">
        <div class="px-2 space-y-1">
          <button
            v-for="section in sectionsList"
            :key="section.id"
            @click="activeSection = section.id"
            class="w-full text-left block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="activeSection === section.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            {{ section.title }}
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile menu button -->
    <div class="fixed top-4 left-4 z-40 md:hidden">
      <button @click="sidebarOpen = !sidebarOpen" class="bg-white p-2 rounded-md shadow-md">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Main Content -->
    <div class="md:ml-64">
      <div class="p-6">
        <!-- Component Sections -->
        <OverviewSection v-if="activeSection === 'overview'" />
        <ActionsSection v-if="activeSection === 'actions'" />
        <PrimitivesSection v-if="activeSection === 'primitives'" />
        <PresentationSection v-if="activeSection === 'presentation'" />
        <ControlSection v-if="activeSection === 'control'" />
        <AdaptersSection v-if="activeSection === 'adapters'" />
        <AuthFlowSection v-if="activeSection === 'auth-flow'" />
        <FactoriesSection v-if="activeSection === 'factories'" />
        <ComposablesSection v-if="activeSection === 'composables'" />
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 z-30 bg-black opacity-25 md:hidden"></div>
  </div>
</template>