<template>
  <div class="network-changer">
    <ds-selectors-single-selector
        :options="networks"
        :default-picked="currentNetwork"
        @change="handleNetChange"
    />
    <template v-if="!userWallet">
      <ds-button @click="connectWallet">
        Connect wallet
      </ds-button>
    </template>
    <template v-else>
      <div class="picked-panel">
        <img src="/wallets/metamask.png">
        <ds-hex :hex="userWallet" />
      </div>
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
    icon: `/networks/${item.code}.png`,
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
  display: flex;
  align-items: center;
  gap: 8px;
  color: $white;
}

.picked-panel {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px 8px 8px;
  border: 1px solid $black-700;
  background-color: $black-900;

  img {
    height: 18px;
  }
}

::v-deep(.dropdown-item) {
  width: 250px;
}
</style>
