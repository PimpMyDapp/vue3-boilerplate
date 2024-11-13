import { defineStore } from "pinia";

export const useChainStore = defineStore("chainManagementStore", {
    state: () => {
        return {
            chainId: 0,
            network_list: [],
            current_network: null,
            current_network_name: '',
        }
    },

    actions: {
        /**
         * Setting total networks list and setting complete object of an actual network
         * @param networks - list of networks to set
         * @param current_name - optional. Only required if current_network is not set.
         */
        setList(networks, current_name) {
            this.network_list = networks;
            if (this.current_network_name) {
                this.current_network = networks.find(item => item.code === this.current_network_name);
            } else if (current_name) {
                this.current_network = networks.find(item => item.code === current_name);
            } else {
                new Error('Error while setting current_network. Please provide current_name arg')
            }

            this.chainId = this.current_network.networkId;
        },
    },
})
