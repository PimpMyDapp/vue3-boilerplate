<template>
  <NuxtPage />
</template>

<script setup>
import { startGlobalListeners } from '~/composables/globalListeners';
import { useCoreStore } from '~/stores/coreStore';

import networks from '~/downloads/menu.json';

const route = useRoute();
const router = useRouter();
const coreStore = useCoreStore();

startGlobalListeners();

onMounted(() => {
  initNetwork();
  coreStore.setNow();
})

function initNetwork() {
  if (!route.params.network) {
    const networkCode = networks[0].code;
    navigateTo({ name: 'network', params: { network: networkCode } });
  }
}
</script>
