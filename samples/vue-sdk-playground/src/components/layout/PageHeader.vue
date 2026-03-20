<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
    <p v-if="description" class="text-gray-600 mt-1">{{ description }}</p>
  </div>
</template>
