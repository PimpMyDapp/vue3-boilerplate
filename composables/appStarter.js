import { startGlobalListeners } from '~/composables/globalListeners';
import { useCoreStore } from '~/stores/coreStore';
import { useChainStore } from '~/stores/networkAndWallet/chainManagementStore';
import { useWalletStore } from '~/stores/networkAndWallet/walletStore';
import { useContractStore } from '~/stores/contracts/_contracts';

import { watch } from 'vue';

import networks from '~/downloads/menu.json';
import {usePromiseStore} from '~/stores/_service/promisesStore';

/**
 * this place we call methods that DOES NOT REQUIRE app to be on mounted hook
 */
export async function preStartApp() {
  const coreStore = useCoreStore();
  const walletStore = useWalletStore();
  
  startGlobalListeners();
  coreStore.setNow();
  await checkRouteAndLoadChains();
  
  watch(() => walletStore.custom_wallet, async (newCustomWallet) => {
    const walletStore = useWalletStore();

    if (newCustomWallet) {
      setUserWallet(newCustomWallet);
    } else if (walletStore.provider) {
      const [actualAddress] = await walletStore.provider.listAccounts();
      setUserWallet(actualAddress);
    }
  });
}

/**
 * This place we call methods that REQUIRE on mounted hook.
 * @returns {Promise<void>}
 */
export async function startApp() {
  const walletStore = useWalletStore();
  const contractStore = useContractStore();
  
  await walletStore.checkConnectedWallet();
  walletWatcher();
  await contractStore.initBasicContracts();
}

/**
 * Sets default network parameter if required and sets default values for chain store.
 */
async function checkRouteAndLoadChains() {
  // Here we use this const, so we can get component context. It can't be called outside function.
  const route = useRoute();
  const chainStore = useChainStore();
  
  // setting network parameter at url and setting current network name
  if (!route.params.network) {
    const networkCode = networks[0].code;
    navigateTo({name: 'network', params: {network: networkCode}});
    chainStore.current_network_name = networkCode;
  } else {
    chainStore.current_network_name = route.params.network;
  }
  
  // setting a total network list
  await chainStore.setList(networks);
}

/**
 * Watching for wallet app changes.
 */
function walletWatcher() {
  if (!window.ethereum) {
    console.error('wallet api is not injected!');
    return;
  }
  
  const walletStore = useWalletStore();
  const chainStore = useChainStore();
  const contractStore = useContractStore();
  const promises = usePromiseStore();
  
  if (walletStore.wallet_type === 'metamask') {
    window.ethereum.on('accountsChanged', async accounts => {
      if (accounts.length === 0) { // wallet get blocked by user
        walletStore.disconnectWallet();
      } else if (accounts[0] !== walletStore.user_wallet) { // user picked different wallet address
        await walletStore.checkConnectedWallet();
        await contractStore.initBasicContracts();
      }
    });
    
    window.ethereum.on('chainChanged', async chainId => {
      promises.clear('contractReady');
      promises.clear('currentChainPicked');
      await walletStore.checkConnectedWallet();
      chainStore.setAnotherChain(chainId);
      await contractStore.initBasicContracts();
    });
  }
}

/**
 * That function sets wallet status in wallet store AND CHECKS IF THERE IS A CUSTOM WALLET SET!
 * @param userWallet
 */
function setUserWallet(userWallet) {
  const walletStore = useWalletStore();
  
  if (walletStore.custom_wallet) {
    userWallet = walletStore.custom_wallet;
    walletStore.signer = null; // disable signer if it's a custom wallet
  }
  if (walletStore.user_wallet) {
    walletStore.last_user_wallet = walletStore.user_wallet;
  }
  
  walletStore.setAddress(userWallet);
}
