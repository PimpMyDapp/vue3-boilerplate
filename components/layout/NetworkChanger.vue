<template>
  <div class="network-changer">
    <ds-selectors-single-selector :options="networks" :default-picked="currentNetwork" @change="handleNetChange" />
    <template v-if="!userWallet">
      <ds-button @click="connectWallet">
        Connect wallet
      </ds-button>
    </template>
    <template v-else>
      Current wallet is: {{ userWallet }}
      <ds-button @click="disconnectWallet">
        Disconnect wallet
      </ds-button>
    </template>
  </div>
</template>

<script setup>
import { useChainStore } from '~/stores/networkAndWallet/chainManagementStore';
import { useWalletStore } from '~/stores/networkAndWallet/walletStore';

const chainStore = useChainStore();
const walletStore = useWalletStore();

// computed
const networks = computed(() => {
  const list = chainStore.network_list;
  return list.map(item => ({
    value: item.code,
    text: item.title,
  }));
})

const currentNetwork = computed(() => {
  return chainStore.current_network_name;
})

const userWallet = computed(() => {
  return walletStore.user_wallet;
})


// methods
async function connectWallet() {
  await walletStore.connectWallet('metamask');
}

async function disconnectWallet() {
  walletStore.disconnectWallet();
}

async function handleNetChange({ value }) {
  const { networkId } = chainStore.network_list.find(item => item.code === value);
  chainStore.setAnotherChain(networkId);
  if (chainStore.site_chain_id !== walletStore.wallet_chain_id) {
    walletStore.disconnectWallet();
  } else {
    await walletStore.checkConnectedWallet();
  }
}
</script>

<style lang="scss" scoped>
.network-changer {
  margin-bottom: 300px;
  color: $white;
}
</style>
