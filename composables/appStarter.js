import {startGlobalListeners} from '~/composables/globalListeners';
import { useCoreStore } from '~/stores/coreStore';
import { useChainStore } from '~/stores/networkAndWallet/chainManagementStore';
import { useWalletStore } from '~/stores/networkAndWallet/walletStore';
import { hexToNumber } from '~/composables/blockchainHelpers';

import { watch } from 'vue';

import debounce from 'lodash/debounce';

import networks from '~/downloads/menu.json';

const _debounceSetWrongNetwork = debounce((isWrongNetwork) => {
  const walletStore = useWalletStore();
  walletStore.wrong_network = isWrongNetwork;
}, 2000);


/**
 * Watching for wallet app changes.
 */
function walletWatcher() {
  if (!window.ethereum) {
    console.error('wallet api is not injected!');
    return;
  }
  
  const walletStore = useWalletStore();
  if (walletStore.wallet_type === 'metamask') {
    window.ethereum.on('accountsChanged', async accounts => {
      console.log('accounts has changed. New accounts are: ', accounts);
      if (accounts.length === 0) { // wallet get blocked by user
        walletStore.disconnectWallet();
      } else if (accounts[0] !== walletStore.user_wallet) { // user picked different wallet address
        await walletStore.checkConnectedWallet();
      }
    });
    
    window.ethereum.on('chainChanged', async chainId => {
      console.log(`Chain has changed. New chain id is: ${hexToNumber(chainId)}`);
    });
  }
}

/**
 * That function sets wallet status in wallet store
 * @param userWallet
 */
function setUserWallet(userWallet) {
  const walletStore = useWalletStore();
  const chainStore = useChainStore();

  if (walletStore.custom_wallet) {
    userWallet = walletStore.custom_wallet;
    walletStore.signer = null; // disable signer if it's a custom wallet
  }
  if (walletStore.user_wallet) {
    walletStore.last_user_wallet = walletStore.user_wallet;
  }

  if (!chainStore.network_list.length || !walletStore.wallet_chain_id) {
    _debounceSetWrongNetwork(false);
    return walletStore.setAddress(null);
  }
  if (chainStore.chainId !== walletStore.wallet_chain_id) {
    _debounceSetWrongNetwork(true);
    return walletStore.setAddress(null);
  }
  _debounceSetWrongNetwork(false);
  walletStore.setAddress(userWallet);
}

/**
 * Init web 3 manager and all its dependencies
 */
async function initWeb3(network = null) {
  const walletStore = useWalletStore();

  await walletStore.checkConnectedWallet();
  walletStore.wallet_loading = false;
}

/**
 * Sets default network parameter if required and sets default values for chain store.
 */
function initNetwork() {
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
  chainStore.setList(networks);
}

/**
 * this place we call methods that DOES NOT REQUIRE app to be on mounted hook
 */
export function preStartApp() {
  const coreStore = useCoreStore();
  const walletStore = useWalletStore();
  
  startGlobalListeners();
  coreStore.setNow();
  initNetwork();
  
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
  await initWeb3();
  walletWatcher();
}
