<template>
  <NuxtPage />
</template>

<script setup>

import { preStartApp, startApp } from '~/composables/AppStarter';

preStartApp();

onMounted(() => {
  startApp();
})
</script>
