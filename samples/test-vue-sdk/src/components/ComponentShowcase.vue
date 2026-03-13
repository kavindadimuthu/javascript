<script setup lang="ts">
import { ref, computed } from 'vue';
import { XIcon } from '@asgardeo/vue';

// Import section components
import OverviewSection from './sections/OverviewSection.vue';
import OverviewAuthControls from './sections/OverviewAuthControls.vue';
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

const sections = [
  { id: 'overview', title: 'Overview', description: 'SDK status and configuration overview' },
  { id: 'actions', title: 'Action Components', description: 'Sign in/out buttons and interactive actions' },
  { id: 'primitives', title: 'Primitive Components', description: 'Basic UI components like buttons, inputs, and cards' },
  { id: 'presentation', title: 'Presentation Components', description: 'Complete user interface components' },
  { id: 'control', title: 'Control Components', description: 'Conditional rendering based on auth state' },
  { id: 'adapters', title: 'Social Login Adapters', description: 'Social media login buttons' },
  { id: 'auth-flow', title: 'Auth Flow Components', description: 'Authentication flow handlers' },
  { id: 'factories', title: 'Field Factory', description: 'Dynamic field generation' },
  { id: 'composables', title: 'Composables Demo', description: 'Vue composables for SDK functionality' },
];

const currentSection = computed(() => sections.find(s => s.id === activeSection.value));
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
            v-for="section in sections"
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
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ currentSection?.title }}</h2>
              <p class="text-gray-600">{{ currentSection?.description }}</p>
            </div>
            <!-- Auth Controls for Overview Section -->
            <OverviewAuthControls v-if="activeSection === 'overview'" />
          </div>
        </div>

        <!-- Component Sections -->
        <div v-if="activeSection === 'overview'" class="space-y-6">
          <OverviewSection />
        </div>

        <div v-if="activeSection === 'actions'" class="space-y-6">
          <ActionsSection />
        </div>

        <div v-if="activeSection === 'primitives'" class="space-y-6">
          <PrimitivesSection />
        </div>

        <div v-if="activeSection === 'presentation'" class="space-y-6">
          <PresentationSection />
        </div>

        <div v-if="activeSection === 'control'" class="space-y-6">
          <ControlSection />
        </div>

        <div v-if="activeSection === 'adapters'" class="space-y-6">
          <AdaptersSection />
        </div>

        <div v-if="activeSection === 'auth-flow'" class="space-y-6">
          <AuthFlowSection />
        </div>

        <div v-if="activeSection === 'factories'" class="space-y-6">
          <FactoriesSection />
        </div>

        <div v-if="activeSection === 'composables'" class="space-y-6">
          <ComposablesSection />
        </div>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 z-30 bg-black opacity-25 md:hidden"></div>
  </div>
</template>