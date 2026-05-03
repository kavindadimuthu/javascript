<script setup lang="ts">
import {UserProfile, SignOutButton} from '@asgardeo/vue';
import {RouterLink} from 'vue-router';
</script>

<template>
  <main>
    <nav>
      <RouterLink to="/">← Home</RouterLink>
    </nav>

    <UserProfile />

    <SignOutButton />
  </main>
</template>
