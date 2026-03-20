<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@asgardeo/vue'
import ResultPanel from '../../components/shared/ResultPanel.vue'
import SectionCard from '../../components/layout/SectionCard.vue'

const { t, currentLanguage, fallbackLanguage, bundles, setLanguage, injectBundles } = useI18n()

// t()
const translationKey = ref('common.welcome')
const translationParams = ref('')
const translationResult = ref<string | null>(null)
const translationError = ref<string | null>(null)

function runTranslate() {
  translationError.value = null
  try {
    let params: Record<string, string | number> | undefined
    if (translationParams.value.trim()) {
      params = JSON.parse(translationParams.value) as Record<string, string | number>
    }
    translationResult.value = t(translationKey.value, params)
  } catch (e: unknown) {
    translationError.value = e instanceof Error ? e.message : String(e)
  }
}

// setLanguage (sync — not async)
const setLangTarget = ref('')
const setLangResult = ref<string | null>(null)

function runSetLanguage() {
  if (!setLangTarget.value.trim()) return
  setLanguage(setLangTarget.value.trim())
  setLangResult.value = `Language set to "${setLangTarget.value.trim()}". Current: ${currentLanguage.value}`
}

// bundles snapshot
const bundlesResult = ref<unknown>(null)
function showBundles() { bundlesResult.value = bundles.value }

// injectBundles
const injectJson = ref(JSON.stringify({ 'en-US': { 'common.welcome': 'Welcome!' } }, null, 2))
const injectResult = ref<string | null>(null)
const injectError = ref<string | null>(null)

function runInjectBundles() {
  injectError.value = null
  injectResult.value = null
  try {
    const parsed = JSON.parse(injectJson.value) as Record<string, unknown>
    injectBundles(parsed as Parameters<typeof injectBundles>[0])
    injectResult.value = `Bundles injected successfully (${Object.keys(parsed).length} locale(s)).`
  } catch (e: unknown) {
    injectError.value = e instanceof Error ? e.message : String(e)
  }
}
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
            <td class="py-2 pr-6 font-mono text-xs text-gray-600">currentLanguage</td>
            <td class="py-2 font-mono text-xs text-gray-700">{{ currentLanguage }}</td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-gray-600">fallbackLanguage</td>
            <td class="py-2 font-mono text-xs text-gray-700">{{ fallbackLanguage }}</td>
          </tr>
          <tr>
            <td class="py-2 pr-6 font-mono text-xs text-gray-600">bundles (keys)</td>
            <td class="py-2 font-mono text-xs text-gray-700">
              {{ Object.keys(bundles).join(', ') || '(empty)' }}
            </td>
          </tr>
        </tbody>
      </table>
    </SectionCard>

    <!-- t() — translate -->
    <SectionCard title="t() — translate">
      <p class="mb-3 text-xs text-gray-500">
        Translates a key using the active locale. Optionally pass interpolation params as JSON.
      </p>
      <div class="space-y-2 mb-3">
        <input
          v-model="translationKey"
          type="text"
          placeholder="common.welcome"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          v-model="translationParams"
          type="text"
          placeholder='Optional params JSON, e.g. {"name":"Alice"}'
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        :disabled="!translationKey.trim()"
        @click="runTranslate"
      >
        t()
      </button>
      <ResultPanel class="mt-3" :result="translationResult" :error="translationError" />
    </SectionCard>

    <!-- setLanguage() -->
    <SectionCard title="setLanguage()">
      <p class="mb-3 text-xs text-gray-500">
        Switches the active locale synchronously (e.g. <code class="font-mono">en-US</code>,
        <code class="font-mono">fr-FR</code>, <code class="font-mono">ja-JP</code>).
      </p>
      <div class="flex gap-2 mb-3">
        <input
          v-model="setLangTarget"
          type="text"
          placeholder="en-US"
          class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          :disabled="!setLangTarget.trim()"
          @click="runSetLanguage"
        >
          setLanguage()
        </button>
      </div>
      <ResultPanel :result="setLangResult" />
    </SectionCard>

    <!-- bundles -->
    <SectionCard title="bundles">
      <p class="mb-3 text-xs text-gray-500">
        All registered i18n bundles keyed by locale string.
      </p>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        @click="showBundles"
      >
        Show bundles
      </button>
      <ResultPanel class="mt-3" :result="bundlesResult" />
    </SectionCard>

    <!-- injectBundles() -->
    <SectionCard title="injectBundles()">
      <p class="mb-3 text-xs text-gray-500">
        Merges additional locale bundles into the i18n registry. Provide a JSON object keyed by
        locale string, where each value is a flat key→translation map.
      </p>
      <textarea
        v-model="injectJson"
        rows="5"
        spellcheck="false"
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
      />
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        @click="runInjectBundles"
      >
        injectBundles()
      </button>
      <ResultPanel class="mt-3" :result="injectResult" :error="injectError" />
    </SectionCard>

  </div>
</template>
