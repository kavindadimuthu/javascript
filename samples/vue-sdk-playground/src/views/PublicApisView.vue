<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import PageHeader from '../components/layout/PageHeader.vue'
import AsgardeoApiSection from './apis/AsgardeoApiSection.vue'
import UserApiSection from './apis/UserApiSection.vue'
import OrganizationApiSection from './apis/OrganizationApiSection.vue'
import FlowApiSection from './apis/FlowApiSection.vue'
import FlowMetaApiSection from './apis/FlowMetaApiSection.vue'
import ThemeApiSection from './apis/ThemeApiSection.vue'
import BrandingApiSection from './apis/BrandingApiSection.vue'
import I18nApiSection from './apis/I18nApiSection.vue'

const sections = shallowRef([
  {
    key: 'asgardeo',
    label: 'useAsgardeo()',
    description: 'Core auth state, token methods, redirect actions, and authenticated HTTP client.',
    component: AsgardeoApiSection,
  },
  {
    key: 'user',
    label: 'useUser()',
    description: 'User profile, flattened attributes, SCIM2 schemas, and profile update operations.',
    component: UserApiSection,
  },
  {
    key: 'organization',
    label: 'useOrganization()',
    description: 'Current organization, member organizations list, and organization switching.',
    component: OrganizationApiSection,
  },
  {
    key: 'flow',
    label: 'useFlow()',
    description: 'App-native authentication flow state: current step, messages, and navigation.',
    component: FlowApiSection,
  },
  {
    key: 'flowMeta',
    label: 'useFlowMeta()',
    description: 'Flow metadata from the server including locale config and available languages.',
    component: FlowMetaApiSection,
  },
  {
    key: 'theme',
    label: 'useTheme()',
    description: 'Active color scheme, theme config object, and theme toggle action.',
    component: ThemeApiSection,
  },
  {
    key: 'branding',
    label: 'useBranding()',
    description: 'Branding preferences including logo, color palette, and layout settings.',
    component: BrandingApiSection,
  },
  {
    key: 'i18n',
    label: 'useI18n()',
    description: 'Translation function, current locale, and language switching.',
    component: I18nApiSection,
  },
])

const openSection = ref<string | null>('asgardeo')

function toggle(key: string) {
  openSection.value = openSection.value === key ? null : key
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Public APIs"
      description="Interactive playground for every composable method exposed by the SDK."
    />

    <div class="space-y-3">
      <div
        v-for="section in sections"
        :key="section.key"
        class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm"
      >
        <!-- Accordion header -->
        <button
          type="button"
          class="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          :aria-expanded="openSection === section.key"
          @click="toggle(section.key)"
        >
          <div class="min-w-0">
            <h3 class="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {{ section.label }}
            </h3>
            <p class="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {{ section.description }}
            </p>
          </div>
          <!-- Chevron -->
          <svg
            :class="openSection === section.key ? 'rotate-180' : ''"
            class="ml-4 h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Accordion body -->
        <div
          v-show="openSection === section.key"
          class="border-t border-zinc-200 dark:border-zinc-700 px-5 py-5"
        >
          <component :is="section.component" />
        </div>
      </div>
    </div>
  </div>
</template>
