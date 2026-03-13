<script setup lang="ts">
import { AsgardeoProvider } from '@asgardeo/vue';
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <AsgardeoProvider
    base-url="https://api.asgardeo.io/t/orgkavinda"
    client-id="9GeQcaSmCwkkDpyIW0sfJkKlD90a"
    after-sign-in-url="http://localhost:5173"
    after-sign-out-url="http://localhost:5173"
  >
    <div class="min-h-screen bg-gray-50">
      <Sidebar />
      <div class="md:ml-64">
        <div class="p-6">
          <RouterView />
        </div>
      </div>
    </div>
  </AsgardeoProvider>
</template>
