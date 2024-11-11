import {startGlobalListeners} from '~/composables/globalListeners';
import { useCoreStore } from '~/stores/coreStore';
import { useChainStore } from '~/stores/networkAndWallet/chainManagementStore';
import { useWalletStore } from '~/stores/networkAndWallet/walletStore';
import { usePromiseStore } from '~/stores/_service/promisesStore';

import throttle from 'lodash/throttle';

import networks from '~/downloads/menu.json';

const _throttleSetUserWallet = throttle((walletAddress) => {
  this.setUserWallet(walletAddress);
}, 1000);

function setUserWallet() {

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


// TODO: probably useless
// async function initWallet() {
//   const walletStore = useWalletStore();
//
//   await walletStore.initWalletInfo();
// }

/**
 * this place we call methods that DOES NOT REQUIRE app to be on mounted hook
 */
export function preStartApp() {
  const coreStore = useCoreStore();
  
  startGlobalListeners();
  coreStore.setNow();
  initNetwork();
  const walletStore = useWalletStore();
}

/**
 * This place we call methods that REQUIRE on mounted hook.
 * @returns {Promise<void>}
 */
export async function startApp() {
  // initNetwork();
  // await initWallet();
}
