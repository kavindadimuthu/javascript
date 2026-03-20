<script setup lang="ts">
import { AsgardeoProvider } from '@asgardeo/vue';
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <!--
    application-id: Required for app-native (embedded) authentication.
    Find this in Asgardeo Console > Applications > <Your App> > Info tab > Application ID.
    Example: "3d7b2c9e-4a1f-4e8d-b5c3-8f2a1e6d9b0c"
  -->
  <AsgardeoProvider
    base-url="https://api.asgardeo.io/t/orgkavinda"
    client-id="OloUfnEtap8y12niKe0bsmfVGiAa"
    application-id="6ee53a13-75e0-4746-988f-64950d2f774a"
    after-sign-in-url="http://localhost:5173"
    after-sign-out-url="http://localhost:5173"
  >
    <div class="min-h-screen bg-surface">
      <Sidebar />
      <div class="md:ml-64">
        <div class="p-6">
          <RouterView />
        </div>
      </div>
    </div>
  </AsgardeoProvider>
</template>
