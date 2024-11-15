import {defineStore} from 'pinia';
import {markRaw} from 'vue';

import isString from 'lodash/isString';
import {BigNumber} from 'ethers';

import {useInitContract} from '~/composables/contracts/contractHandler';
import {useChainStore} from '~/stores/networkAndWallet/chainManagementStore';
import {useWalletStore} from '~/stores/networkAndWallet/walletStore';
import {usePromiseStore} from '~/stores/_service/promisesStore';

export const useContractStore = defineStore('contractsStore', () => {
	let basicContracts = ref({});
	let contractsBuiltFor = ref(null); // show which chain basicContracts was built for
	let txInProgress = ref(false);
	
	/**
	 * Parse contract addresses and abis resulting basicContracts which contains inited contracts from config;
	 * @returns {Promise<void>}
	 */
	async function initBasicContracts() {
		const chainStore = useChainStore();
		const walletStore = useWalletStore();
		const promises = usePromiseStore();

		if (!walletStore.signer) return;

		await promises.waitFor('currentChainPicked');
		basicContracts.value = {};

		const { addresses, abis } = chainStore.current_network.contractsStaticData;
		const initialisedContracts = await Promise.all(Object.keys(addresses).map(async key => {
			const abiName = key.split('Address')[0] + 'Abi';
			return useInitContract(addresses[key], abis[abiName]);
		}))
		
		Object.keys(addresses).map((key, index) => {
			const contractName = key.split('Address')[0];
			basicContracts.value[contractName] = markRaw(initialisedContracts[index]);
		})

		contractsBuiltFor.value = walletStore.wallet_chain_id;
		promises.resolve('contractReady');
	}

	async function onContractsReady() {
		const promises = usePromiseStore();
		return await promises.waitFor('contractReady');
	}
	
	async function sendTx(contract, method, args, sendNativeAmount = null) {
		const promises = usePromiseStore();
		await promises.waitFor('contractReady');
		let options = {};

		if (isString(contract)) {
			const isContractExist = this.basicContracts[contract];
			if (isContractExist) {
				contract = isContractExist;
			} else {
				console.error(`Contract with name ${contract} does not exist in basic contracts.`);
				return;
			}
		}
		if (!contract.signer) {
			console.log(`Contract ${contract.address} does not have valid signer.`);
			return;
		}

		if (sendNativeAmount) {
			options.value = BigNumber.from(sendNativeAmount);
		}

		txInProgress.value = true;
		const txResponse = await contract[method](...args, options);
		txInProgress.value = false;
		return txResponse;
	}

	return {
		basicContracts,
		contractsBuiltFor,
		txInProgress,
		initBasicContracts,
		sendTx,
	}
})
