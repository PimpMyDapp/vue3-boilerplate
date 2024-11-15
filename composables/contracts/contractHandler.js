import { ethers } from 'ethers';
import { useWalletStore } from '~/stores/networkAndWallet/walletStore';

/**
 * This method is used to initialise contract method with ethers.
 *
 * @param address - Required. Contract address.
 * @param abi - Required. Abi of the contract.
 * @param controller - Optional. Provider or Signer.
 * If contract init happens on wallet's chain, it isn't required.
 * otherwise wallet signer will be used.
 *
 * @returns {Promise<Contract>}
 */
export async function useInitContract(address, abi, controller = null) {
	const walletStore = useWalletStore();
	let isCurrentNetworkProvider = false;
	let isProvider = false;
	let isSigner = false;

	if (!controller) {  // if controller not specified, it means its current network contract, and we can use our wallet signer
		controller = walletStore.signer;
		isCurrentNetworkProvider = true;
		isSigner = true;
	} else {            // If controller specified we must check if its of current wallet chain
		// Network is inits with promise. Here we await its resolve whenever it's located
		if (controller._networkPromise) await controller._networkPromise;
		else if (controller.provider._networkPromise) await controller.provider._networkPromise;

		isProvider = !!controller.network;
		isSigner = !isProvider && !!controller.provider.network;

		const currentWalletId = walletStore.wallet_chain_id;
		if (isProvider) {
			isCurrentNetworkProvider = controller.network.chainId === currentWalletId;
			if (isCurrentNetworkProvider) controller = walletStore.signer; // if its current network, then switch to signer.
		} else if (isSigner) {
			isCurrentNetworkProvider = controller.provider.network.chainId === currentWalletId;
		}
	}
	const contract = new ethers.Contract(address, abi, controller);
	if (isCurrentNetworkProvider || isSigner) {
		contract.connect(controller);
	}
	return contract;
}
