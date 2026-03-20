<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  code: string
  language?: string
}>(), {
  language: 'vue',
})

const copied = ref(false)

async function copyCode(code: string) {
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="relative">
    <div class="flex items-center justify-between bg-gray-800 text-gray-400 text-xs px-4 py-2 rounded-t-lg">
      <span>{{ language }}</span>
      <button
        type="button"
        class="hover:text-white transition-colors"
        @click="copyCode(code)"
      >
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <pre class="bg-gray-900 text-gray-100 p-4 rounded-b-lg font-mono text-sm overflow-x-auto"><code>{{ code }}</code></pre>
  </div>
</template>
