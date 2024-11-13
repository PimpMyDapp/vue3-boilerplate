<template>
  <NuxtPage />
</template>

<script setup>

import { preStartApp, startApp } from '~/composables/appStarter';

preStartApp();

onMounted(() => {
  startApp();
})
</script>
