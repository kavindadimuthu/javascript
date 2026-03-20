<script setup lang="ts">
import { ref } from 'vue'
import { useOrganization } from '@asgardeo/vue'
import type { Organization } from '@asgardeo/vue'
import ResultPanel from '../../components/shared/ResultPanel.vue'
import SectionCard from '../../components/layout/SectionCard.vue'

const {
  myOrganizations,
  currentOrganization,
  isLoading,
  error,
  switchOrganization,
  getAllOrganizations,
  revalidateMyOrganizations,
  createOrganization,
} = useOrganization()

// switchOrganization
const switchResult = ref<string | null>(null)
const switchError = ref<string | null>(null)
const switchLoading = ref(false)

async function runSwitch(org: Organization) {
  switchLoading.value = true
  switchError.value = null
  switchResult.value = null
  try {
    await switchOrganization(org)
    const label = (org as unknown as Record<string, unknown>).displayName ?? (org as unknown as Record<string, unknown>).id ?? 'organization'
    switchResult.value = `Switched to "${String(label)}".`
  } catch (e: unknown) {
    switchError.value = e instanceof Error ? e.message : String(e)
  } finally {
    switchLoading.value = false
  }
}

// getAllOrganizations
const getAllResult = ref<unknown>(null)
const getAllError = ref<string | null>(null)
const getAllLoading = ref(false)

async function runGetAll() {
  getAllLoading.value = true
  getAllError.value = null
  getAllResult.value = null
  try {
    getAllResult.value = await getAllOrganizations()
  } catch (e: unknown) {
    getAllError.value = e instanceof Error ? e.message : String(e)
  } finally {
    getAllLoading.value = false
  }
}

// revalidateMyOrganizations
const revalidateResult = ref<unknown>(null)
const revalidateError = ref<string | null>(null)
const revalidateLoading = ref(false)

async function runRevalidate() {
  revalidateLoading.value = true
  revalidateError.value = null
  revalidateResult.value = null
  try {
    revalidateResult.value = await revalidateMyOrganizations()
  } catch (e: unknown) {
    revalidateError.value = e instanceof Error ? e.message : String(e)
  } finally {
    revalidateLoading.value = false
  }
}

// createOrganization
const createName = ref('')
const createDescription = ref('')
const createParentId = ref('')
const createResult = ref<unknown>(null)
const createError = ref<string | null>(null)
const createLoading = ref(false)

async function runCreate() {
  if (!createName.value.trim() || !createParentId.value.trim()) return
  createLoading.value = true
  createError.value = null
  createResult.value = null
  try {
    createResult.value = await createOrganization?.({
      name: createName.value.trim(),
      description: createDescription.value.trim(),
      parentId: createParentId.value.trim(),
      type: 'TENANT',
    }, '')
  } catch (e: unknown) {
    createError.value = e instanceof Error ? e.message : String(e)
  } finally {
    createLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">

    <!-- Reactive State -->
    <SectionCard title="Reactive State">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 dark:border-zinc-700 text-left">
            <th class="pb-2 pr-6 font-medium text-zinc-500 dark:text-zinc-400">Property</th>
            <th class="pb-2 font-medium text-zinc-500 dark:text-zinc-400">Value</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-zinc-600 dark:text-zinc-300">isLoading</td>
            <td class="py-2">
              <span
                :class="isLoading
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'"
                class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
              >{{ isLoading }}</span>
            </td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-zinc-600 dark:text-zinc-300">error</td>
            <td class="py-2 font-mono text-xs" :class="error ? 'text-red-500' : 'text-zinc-400 italic'">
              {{ error ?? 'null' }}
            </td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-zinc-600 dark:text-zinc-300">myOrganizations.length</td>
            <td class="py-2 font-mono text-xs text-zinc-700 dark:text-zinc-200">{{ myOrganizations?.length ?? 0 }}</td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-zinc-600 dark:text-zinc-300">currentOrganization</td>
            <td class="py-2 font-mono text-xs text-zinc-700 dark:text-zinc-200 break-all">{{ JSON.stringify(currentOrganization) }}</td>
          </tr>
        </tbody>
      </table>
    </SectionCard>

    <!-- myOrganizations + switchOrganization -->
    <SectionCard title="myOrganizations / switchOrganization()">
      <p class="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        Organizations the signed-in user belongs to. Click
        <strong class="font-semibold">Switch</strong> to call
        <code class="font-mono">switchOrganization(org)</code>.
      </p>
      <div v-if="myOrganizations && myOrganizations.length" class="space-y-2">
        <div
          v-for="(org, i) in myOrganizations"
          :key="i"
          class="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3"
        >
          <span class="font-mono text-xs text-zinc-700 dark:text-zinc-200 break-all flex-1">
            {{ JSON.stringify(org) }}
          </span>
          <button
            class="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
            :disabled="switchLoading"
            @click="runSwitch(org)"
          >
            Switch
          </button>
        </div>
      </div>
      <p v-else class="text-xs text-zinc-400 italic">No organizations found.</p>
      <ResultPanel class="mt-3" :result="switchResult" :error="switchError" :loading="switchLoading" />
    </SectionCard>

    <!-- getAllOrganizations -->
    <SectionCard title="getAllOrganizations()">
      <p class="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        Fetches all organizations accessible to the current user. May differ from
        <code class="font-mono">myOrganizations</code> based on permissions.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        :disabled="getAllLoading"
        @click="runGetAll"
      >
        {{ getAllLoading ? 'Loading…' : 'getAllOrganizations()' }}
      </button>
      <ResultPanel class="mt-3" :result="getAllResult" :error="getAllError" :loading="getAllLoading" />
    </SectionCard>

    <!-- revalidateMyOrganizations -->
    <SectionCard title="revalidateMyOrganizations()">
      <p class="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        Re-fetches the user's own organization list and updates
        <code class="font-mono">myOrganizations</code>.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        :disabled="revalidateLoading"
        @click="runRevalidate"
      >
        {{ revalidateLoading ? 'Revalidating…' : 'revalidateMyOrganizations()' }}
      </button>
      <ResultPanel class="mt-3" :result="revalidateResult" :error="revalidateError" :loading="revalidateLoading" />
    </SectionCard>

    <!-- createOrganization -->
    <SectionCard title="createOrganization()">
      <p class="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        Creates a new child organization. Requires admin privileges.
        <code class="font-mono">createOrganization</code> may be
        <code class="font-mono">undefined</code> if unavailable in this context.
      </p>
      <div class="space-y-3 mb-3">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-zinc-600 dark:text-zinc-400">name <span class="text-red-500">*</span></label>
          <input
            v-model="createName"
            type="text"
            placeholder="My Sub-Organization"
            class="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-mono text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-zinc-600 dark:text-zinc-400">description</label>
          <input
            v-model="createDescription"
            type="text"
            placeholder="Optional description"
            class="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-mono text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-zinc-600 dark:text-zinc-400">parentId <span class="text-red-500">*</span></label>
          <input
            v-model="createParentId"
            type="text"
            placeholder="10084a8d-113f-4211-a0d5-..."
            class="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-mono text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        :disabled="createLoading || !createName.trim() || !createParentId.trim() || !createOrganization"
        @click="runCreate"
      >
        {{ createLoading ? 'Creating…' : 'createOrganization()' }}
      </button>
      <p v-if="!createOrganization" class="mt-2 text-xs text-amber-600 dark:text-amber-400">
        <code class="font-mono">createOrganization</code> is not available in this context.
      </p>
      <ResultPanel class="mt-3" :result="createResult" :error="createError" :loading="createLoading" />
    </SectionCard>

  </div>
</template>
