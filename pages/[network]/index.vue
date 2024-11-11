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
    <h3 @click="subscribePromise">Is promise test exist: {{ testPromise }}</h3>
    <ds-button @click="subscribePromise">
      Subscribe to promise
    </ds-button>
    <ds-button @click="resolvePromise" tabindex="1">
      resolve promise
    </ds-button>
    <Footer />
  </div>
</template>

<script setup>
import { usePromiseStore } from '~/stores/_service/promisesStore';

const promises = usePromiseStore();

const localValue = ref(1);

async function subscribePromise() {
  console.log('promise test subscribed');
  await promises.waitFor('test', () => {
    console.log('hello from a callback!')
    console.log('local value is: ', localValue);
    console.log('add one');
    localValue.value++
    console.log('local value is: ', localValue);
  });
  console.log('promise test is fullfield!')
}

function resolvePromise() {
  promises.resolve('test');
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
