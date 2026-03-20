<script setup lang="ts">
defineProps<{
  tabs: { key: string; label: string }[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <div class="border-b border-gray-200">
      <div class="flex gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="py-2 px-1 text-sm font-medium transition-colors border-b-2 -mb-px"
          :class="
            modelValue === tab.key
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          "
          @click="emit('update:modelValue', tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <div class="mt-4">
      <template v-for="tab in tabs" :key="tab.key">
        <div v-if="modelValue === tab.key">
          <slot :name="tab.key" />
        </div>
      </template>
    </div>
  </div>
</template>
