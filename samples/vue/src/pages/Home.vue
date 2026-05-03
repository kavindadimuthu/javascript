<script setup lang="ts">
import {SignedIn, SignedOut, SignInButton, SignOutButton, UserDropdown} from '@asgardeo/vue';
import {RouterLink} from 'vue-router';
</script>

<template>
  <main>
    <h1>Asgardeo Vue Sample</h1>

    <SignedOut>
      <p>Sign in to access your profile.</p>
      <SignInButton />
    </SignedOut>

    <SignedIn>
      <nav>
        <RouterLink to="/profile">View Profile</RouterLink>
      </nav>
      <UserDropdown />
      <SignOutButton />
    </SignedIn>
  </main>
</template>
