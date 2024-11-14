<template>
<!-- this div wrapper prevents error on hot reload. Dont touch!  -->
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>

import { preStartApp, startApp } from '~/composables/appStarter';

preStartApp();

onMounted(() => {
  startApp();
})
</script>
