import { defineStore } from "pinia";
import { usePromiseStore } from '~/stores/_service/promisesStore';

export const useChainStore = defineStore("chainManagementStore", {
    state: () => {
        return {
            site_chain_id: 0,
            network_list: [],
            current_network: null,
            current_network_name: '',
            chain_white_list: [], // if any ids here, then only those networks will be loaded
        }
    },

    actions: {
        /**
         * Setting a total networks list and setting a complete object of an actual network
         * @param networks - list of networks to set
         * @param current_name - optional. Only required if current_network is not set.
         */
        async setList(networks, current_name = '') {
            const promises = usePromiseStore();
            // filter by whitelist if there is any
            if (this.chain_white_list.length) {
                networks = networks.filter(net => this.chain_white_list.includes(net.networkId));
            }

            this.network_list = await Promise.all(networks.map(async item => {
                const configPromise = await import(`~/downloads/${item.code}.json`);
                const addresses = {};
                const abis = {};
                Object.keys(configPromise.default).forEach(key => {
                    if (key.endsWith('Address')) {
                        addresses[key] = configPromise.default[key];
                    } else if (key.endsWith('Abi')) {
                        abis[key] = configPromise.default[key];
                    }
                })
                return {
                    ...item,
                    contractsStaticData: {
                        addresses,
                        abis,
                    },
                }
            }));
            if (this.current_network_name) {
                this.current_network = this.network_list.find(item => item.code === this.current_network_name);
            } else if (current_name) {
                this.current_network = this.network_list.find(item => item.code === current_name);
            } else {
                new Error('Error while setting current_network. Please provide current_name arg')
            }

            this.site_chain_id = this.current_network.networkId;
            promises.resolve('currentChainPicked')
        },
        
        /**
         * Sets another chain on a site.
         *
         * @param chainId - Required. Chain id to which site should be set.
         * @param pushToAnotherRoute - if set to true (default) after a chain set it will also be pushed to new route.
         */
        setAnotherChain(chainId, pushToAnotherRoute = true) {
            const promises = usePromiseStore();

            const anotherChain = this.network_list.find(item => item.networkId === +chainId);
            this.current_network = anotherChain;
            this.site_chain_id = +chainId;
            this.current_network_name = anotherChain.code;
            promises.resolve('currentChainPicked');

            if (pushToAnotherRoute) {
                const route = useRoute();
                navigateTo({name: route.name, params: {network: anotherChain.code}});
            }
        },
    },
})
