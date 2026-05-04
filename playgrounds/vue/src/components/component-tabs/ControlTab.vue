<script setup lang="ts">
import { ref } from 'vue';
import { useAsgardeo, SignedIn, SignedOut, Loading, Spinner } from '@asgardeo/vue';
import TabGroup from '../layout/TabGroup.vue';
import ComponentCard from '../layout/ComponentCard.vue';

const { isSignedIn, isLoading } = useAsgardeo();

const tabs = [
  { key: 'signedIn',  label: '<SignedIn/>'  },
  { key: 'signedOut', label: '<SignedOut/>' },
  { key: 'loading',   label: '<Loading/>'   },
];
const activeTab = ref(tabs[0]?.key ?? 'signedIn');
</script>

<template>
  <div class="space-y-4">

    <!-- Auth state indicator -->
    <div class="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-4 py-2 text-xs">
      <span class="font-medium text-on-surface">Auth state:</span>
      <span v-if="isLoading"
        class="inline-flex items-center gap-1 rounded-full bg-status-warning-bg px-2 py-0.5 text-[10px] font-medium text-status-warning-text">
        <Spinner class="h-2.5 w-2.5" /> Loading
      </span>
      <span v-else-if="isSignedIn"
        class="inline-flex items-center gap-1 rounded-full bg-status-success-bg px-2 py-0.5 text-[10px] font-medium text-status-success-text">
        ● Signed In
      </span>
      <span v-else
        class="inline-flex items-center gap-1 rounded-full bg-surface-secondary border border-border px-2 py-0.5 text-[10px] font-medium text-on-surface-muted">
        ● Signed Out
      </span>
      <span class="ml-auto text-on-surface-muted">Control components react to this in real time.</span>
    </div>

    <TabGroup :tabs="tabs" v-model="activeTab">

      <template #signedIn>
        <ComponentCard name="SignedIn" :badges="['Control']">
          <template #preview>
            <SignedIn>
              <template #default>
                <div class="rounded-md bg-status-success-bg border border-border px-4 py-2 text-sm text-status-success-text">
                  Signed in — default slot rendered
                </div>
              </template>
              <template #fallback>
                <div class="rounded-md bg-surface-secondary border border-border px-4 py-2 text-sm text-on-surface-muted">
                  Not signed in — fallback slot rendered
                </div>
              </template>
            </SignedIn>
          </template>
        </ComponentCard>
      </template>

      <template #signedOut>
        <ComponentCard name="SignedOut" :badges="['Control']">
          <template #preview>
            <SignedOut>
              <template #default>
                <div class="rounded-md bg-status-info-bg border border-border px-4 py-2 text-sm text-status-info-text">
                  Signed out — default slot rendered
                </div>
              </template>
              <template #fallback>
                <div class="rounded-md bg-surface-secondary border border-border px-4 py-2 text-sm text-on-surface-muted">
                  Signed in — fallback slot rendered
                </div>
              </template>
            </SignedOut>
          </template>
        </ComponentCard>
      </template>

      <template #loading>
        <ComponentCard name="Loading" :badges="['Control']">
          <template #preview>
            <Loading>
              <template #default>
                <div class="flex items-center gap-2 rounded-md bg-status-warning-bg border border-border px-4 py-2 text-sm text-status-warning-text">
                  <Spinner class="h-4 w-4" />
                  SDK initializing — default slot
                </div>
              </template>
              <template #fallback>
                <div class="rounded-md bg-status-success-bg border border-border px-4 py-2 text-sm text-status-success-text">
                  SDK ready — fallback slot
                </div>
              </template>
            </Loading>
          </template>
        </ComponentCard>
      </template>

    </TabGroup>
  </div>
</template>
