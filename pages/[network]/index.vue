<template>
  <Head>
    <Title>bolierplate</Title>
    <Meta name="description" content="nuxt boilerplate" />
    <Link
        rel="icon"
        href="/favicon/favicon.ico"
        type="image/x-icon"
    />
    <Link
        rel="icon"
        href="/favicon/favicon.svg"
        type="image/svg+xml"
    />
    <Link
        rel="icon"
        href="/favicon/favicon-48x48.png"
        type="image/png"
        sizes="48x48"
    />
    <Link
        rel="apple-touch-icon"
        href="/favicon/apple-touch-icon.png"
    />
  </Head>
  <div class="root-page">
    <Header />
    <layout-network-changer />
    <ds-button @click="test1">
      Connect wallet
    </ds-button>
    <ds-button @click="test2" tabindex="1">
      send test tx
    </ds-button>
    <Footer />
  </div>
</template>

<script setup>
import { usePromiseStore } from '~/stores/_service/promisesStore';
import { useWalletStore } from '~/stores/networkAndWallet/walletStore';
import {useContractStore} from '~/stores/contracts/_contracts';

const promises = usePromiseStore();
const walletStore = useWalletStore();
const contractStore = useContractStore();

const localValue = ref(1);

async function test1() {
  try {
    await walletStore.connectWallet('metamask');
  } catch (e) {
    console.log(e.message);
  }
}

async function test2() {
  contractStore.sendTx('Cvp', 'approve', ['0x54d8614c4fda84480e6452fec29e74452053c56d', '5000000000000000000']);
}
</script>

<script>
import { defineComponent } from 'vue';

import Header from "~/components/layout/Header.vue";
import Footer from '~/components/layout/Footer.vue';

export default defineComponent({
  name: "Root",
  components: {
    Header,
    Footer,
  },
})
</script>

<style lang="scss" scoped>
h1 {
  color: $white;
}

@include tablet {
  h1 {
    color: orange;
  }
}

@include mobile {
  h1 {
    color: red;
  }
}
</style>
