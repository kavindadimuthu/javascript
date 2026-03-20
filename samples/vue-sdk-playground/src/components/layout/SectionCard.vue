<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  collapsible?: boolean
}>(), {
  collapsible: false,
})

const isOpen = ref(true)
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between" :class="{ 'mb-4': !props.collapsible || isOpen }">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        <p v-if="description" class="text-sm text-gray-500 mt-0.5">{{ description }}</p>
      </div>
      <button
        v-if="collapsible"
        type="button"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        @click="isOpen = !isOpen"
        :aria-expanded="isOpen"
      >
        <svg
          class="w-5 h-5 transition-transform duration-200"
          :class="{ 'rotate-180': !isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    <div v-if="!collapsible || isOpen">
      <slot />
    </div>
  </div>
</template>
