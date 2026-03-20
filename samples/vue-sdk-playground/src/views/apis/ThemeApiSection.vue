<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@asgardeo/vue'
import ResultPanel from '../../components/shared/ResultPanel.vue'
import SectionCard from '../../components/layout/SectionCard.vue'

const { theme, colorScheme, direction, inheritFromBranding, isBrandingLoading, brandingError, toggleTheme } = useTheme()

const themeResult = ref<unknown>(null)
function showTheme() { themeResult.value = theme.value }
</script>

<template>
  <div class="space-y-6">

    <!-- Reactive State -->
    <SectionCard title="Reactive State">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left">
            <th class="pb-2 pr-6 font-medium text-gray-500">Property</th>
            <th class="pb-2 font-medium text-gray-500">Value</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-gray-600">colorScheme</td>
            <td class="py-2">
              <span
                :class="colorScheme === 'dark'
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-amber-100 text-amber-700'"
                class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
              >{{ colorScheme }}</span>
            </td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-gray-600">direction</td>
            <td class="py-2">
              <span
                class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700"
              >{{ direction }}</span>
            </td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-gray-600">inheritFromBranding</td>
            <td class="py-2">
              <span
                :class="inheritFromBranding
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'"
                class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
              >{{ inheritFromBranding }}</span>
            </td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-gray-600">isBrandingLoading</td>
            <td class="py-2">
              <span
                :class="isBrandingLoading
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'"
                class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
              >{{ isBrandingLoading }}</span>
            </td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-gray-600">brandingError</td>
            <td class="py-2 font-mono text-xs" :class="brandingError ? 'text-red-500' : 'text-gray-400 italic'">
              {{ brandingError ? brandingError.message : 'null' }}
            </td>
          </tr>
        </tbody>
      </table>
    </SectionCard>

    <!-- theme snapshot -->
    <SectionCard title="theme">
      <p class="mb-3 text-xs text-gray-500">
        The current resolved theme object (colors, typography, spacing). Derived from branding if
        <code class="font-mono">inheritFromBranding</code> is <code class="font-mono">true</code>.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        @click="showTheme"
      >
        Show theme
      </button>
      <ResultPanel class="mt-3" :result="themeResult" />
    </SectionCard>

    <!-- toggleTheme -->
    <SectionCard title="toggleTheme()">
      <p class="mb-3 text-xs text-gray-500">
        Toggles between <code class="font-mono">light</code> and <code class="font-mono">dark</code> color schemes.
        Current scheme: <strong class="font-semibold">{{ colorScheme }}</strong>.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        @click="toggleTheme()"
      >
        Toggle to {{ colorScheme === 'light' ? 'dark' : 'light' }} mode
      </button>
    </SectionCard>

  </div>
</template>
