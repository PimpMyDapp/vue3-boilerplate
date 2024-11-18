<template>
  <header>
    <div class="main-container">
      <img class="logo" :style="`height: ${getLogo.height}`" src="/logo.png">
      <layout-network-changer />
    </div>
  </header>
</template>

<script setup>
import { useMediaQuery } from '@vueuse/core';

const isMobile = useMediaQuery('(max-width: 600px)')

const getMediaLinks = {
  title: "Twitter",
  link: 'https://x.com/0xcust',
};

const getLogo = {
  desktop: '/legacy/logo-desktop.png',
  mobile: '/legacy/logo.png',
  height: '36px',
};

</script>

<style lang="scss" scoped>
  header {
    position: relative;
    z-index: 10;
    width: 100%;
    border-bottom: 1px solid $black-700;

    .logo {
      height: 32px;
    }

    .main-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
</style>
