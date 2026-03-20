<script setup lang="ts">
defineProps<{
  events: { timestamp: string; type: string; data?: unknown }[]
}>()

const typeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
}

function badgeClass(type: string): string {
  return typeColors[type] ?? 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="overflow-y-auto max-h-[300px] border border-gray-200 rounded-lg divide-y divide-gray-100">
    <div v-if="events.length === 0" class="p-4 text-sm text-gray-400 italic">
      No events yet.
    </div>
    <div
      v-for="(event, index) in events"
      :key="index"
      class="flex items-start gap-3 px-4 py-2"
    >
      <span class="text-gray-400 text-xs mt-0.5 shrink-0">{{ event.timestamp }}</span>
      <span
        class="text-xs font-medium px-1.5 py-0.5 rounded shrink-0"
        :class="badgeClass(event.type)"
      >{{ event.type }}</span>
      <pre
        v-if="event.data !== undefined"
        class="text-xs text-gray-600 whitespace-pre-wrap break-all min-w-0"
      >{{ JSON.stringify(event.data, null, 2) }}</pre>
    </div>
  </div>
</template>
