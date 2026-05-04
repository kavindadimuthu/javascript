<script setup lang="ts">
import { ref } from 'vue';
import {
  GoogleButton,
  GitHubButton,
  MicrosoftButton,
  FacebookButton,
  Card,
  Divider,
  TextField,
  PasswordField,
} from '@asgardeo/vue';
import SectionCard from '../layout/SectionCard.vue';
import TabGroup from '../layout/TabGroup.vue';
import EventLog from '../shared/EventLog.vue';

type LogEvent = { timestamp: string; type: string; data?: unknown };
const events = ref<LogEvent[]>([]);

type ProviderConfig = { label: string; buttonName: string; component: any };

const providers: Record<string, ProviderConfig> = {
  google: { label: 'Google', buttonName: 'GoogleButton', component: GoogleButton },
  github: { label: 'GitHub', buttonName: 'GitHubButton', component: GitHubButton },
  microsoft: { label: 'Microsoft', buttonName: 'MicrosoftButton', component: MicrosoftButton },
  facebook: { label: 'Facebook', buttonName: 'FacebookButton', component: FacebookButton },
};

const tabs = Object.keys(providers).map((key) => ({
  key,
  label: `<${providers[key].buttonName}/>`
}));

const activeTab = ref(tabs[0].key);

function logEvent(provider: string) {
  events.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    type: 'info',
    data: `${provider} button clicked`,
  });
}

function providerDescription(label: string) {
  return `Pre-styled brand button for ${label} sign-in. Handles loading state and emits click events.`;
}

// Combined panel demo state
const demoEmail = ref('');
const demoPassword = ref('');
</script>

<template>
  <div class="space-y-6">
    <TabGroup :tabs="tabs" v-model="activeTab">
      <template v-for="tab in tabs" :key="tab.key" v-slot:[tab.key]>
        <div class="space-y-6">
          <SectionCard
            :title="providers[tab.key].buttonName"
            :description="providerDescription(providers[tab.key].label)"
          >
            <div class="flex justify-center">
              <component :is="providers[tab.key].component" @click="logEvent(tab.key)" />
            </div>
          </SectionCard>

          <SectionCard
            title="Custom Slot Rendering"
            description="Use the default scoped slot to override button label text. The slot exposes { isLoading } so you can show a custom loading message."
          >
            <div class="flex justify-center">
              <component :is="providers[tab.key].component" v-slot="{ isLoading }" @click="logEvent(tab.key + '-custom')">
                {{ isLoading ? 'Connecting to ' + providers[tab.key].label + '...' : 'Continue with ' + providers[tab.key].label }}
              </component>
            </div>
          </SectionCard>

          <SectionCard
            title="Combined Social Login Panel"
            description="Real-world composition pattern: a social button above a Divider, followed by an email/password form."
          >
            <div class="flex justify-center">
              <Card class="w-full max-w-sm">
                <div class="space-y-3 p-1">
                  <p class="text-sm font-semibold text-on-surface text-center mb-1">Sign in with</p>
                  <component :is="providers[tab.key].component" class="w-full" @click="logEvent(tab.key + '-panel')" />
                  <Divider label="or" />
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    :model-value="demoEmail"
                    @update:model-value="demoEmail = $event"
                  />
                  <PasswordField
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    :model-value="demoPassword"
                    @update:model-value="demoPassword = $event"
                  />
                </div>
              </Card>
            </div>
          </SectionCard>

          <SectionCard title="Event Log" description="All social button click events are captured here.">
            <EventLog :events="events" />
          </SectionCard>
        </div>
      </template>
    </TabGroup>
  </div>
</template>
