<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHeader from '../components/layout/PageHeader.vue';
import AuthTab from '../components/component-tabs/AuthTab.vue';
import PrimitivesTab from '../components/component-tabs/PrimitivesTab.vue';
import ActionsTab from '../components/component-tabs/ActionsTab.vue';
import ControlTab from '../components/component-tabs/ControlTab.vue';
import PresentationTab from '../components/component-tabs/PresentationTab.vue';
import SocialLoginsTab from '../components/component-tabs/SocialLoginsTab.vue';
import FactoriesTab from '../components/component-tabs/FactoriesTab.vue';

const route = useRoute();
const router = useRouter();

const tabComponents: Record<string, any> = {
  auth: AuthTab,
  primitives: PrimitivesTab,
  actions: ActionsTab,
  control: ControlTab,
  presentation: PresentationTab,
  social: SocialLoginsTab,
  factories: FactoriesTab,
};

const validTabs = Object.keys(tabComponents);

const activeTab = computed(() => {
  const tab = route.params.tab as string;
  return validTabs.includes(tab) ? tab : 'primitives';
});

watch(
  () => route.params.tab,
  (tab) => {
    if (!validTabs.includes(tab as string)) {
      router.replace('/components/primitives');
    }
  }
);

const activeComponent = computed(() => tabComponents[activeTab.value]);
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Components"
      description="Interactive catalog of all SDK components: auth, primitives, actions, control, presentation, factories, and social logins."
    />
    <component :is="activeComponent" />
  </div>
</template>
