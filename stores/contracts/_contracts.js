import { defineStore } from 'pinia';
import { markRaw } from 'vue';

import { useInitContract } from '~/composables/contracts/contractHandler';
import { useChainStore } from '~/stores/networkAndWallet/chainManagementStore';
import { useWalletStore } from '~/stores/networkAndWallet/walletStore';
import { usePromiseStore } from '~/stores/_service/promisesStore';

export const useContractStore = defineStore('contractsStore', () => {
	let basicContracts = ref({});
	let contractsBuiltFor = ref(null); // show which chain basicContracts was built for
	
	/**
	 * Parse contract addresses and abis resulting basicContracts which contains inited contracts from config;
	 * @returns {Promise<void>}
	 */
	async function initBasicContracts() {
		const chainStore = useChainStore();
		const walletStore = useWalletStore();
		const promises = usePromiseStore();

		const { addresses, abis } = chainStore.current_network.contractsStaticData;

		const initialisedContracts = await Promise.all(Object.keys(addresses).map(async key => {
			const abiName = key.split('Address')[0] + 'Abi';
			if (!abis[abiName]) {
				console.error(`Abi ${abiName} is undefined. Define aby or remove ${key} from config.`)
			}
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

	return { basicContracts, contractsBuiltFor, initBasicContracts }
})
