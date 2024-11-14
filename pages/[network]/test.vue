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
    <h1> test page </h1>
    <Footer />
  </div>
</template>

<script setup>
import { usePromiseStore } from '~/stores/_service/promisesStore';
import { useWalletStore } from '~/stores/networkAndWallet/walletStore';

const promises = usePromiseStore();
const walletStore = useWalletStore();

const localValue = ref(1);

async function test1() {
  await walletStore.connectWallet();
}

async function test2() {
  await walletStore.testSigner();
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
