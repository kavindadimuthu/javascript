<script setup lang="ts">
import ComponentShowcase from './components/ComponentShowcase.vue';
import { AsgardeoProvider } from '@asgardeo/vue';
</script>

<template>
  <AsgardeoProvider
    base-url="https://api.asgardeo.io/t/orgkavinda"
    client-id="9GeQcaSmCwkkDpyIW0sfJkKlD90a"
    after-sign-in-url="http://localhost:5173"
    after-sign-out-url="http://localhost:5173"
  >
    <ComponentShowcase />
  </AsgardeoProvider>
</template>
