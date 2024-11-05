import { defineStore } from "pinia";

export const useChainStore = defineStore("chainManagementStore", {
    state: () => {
        return {
            chainId: 0,
        }
    },

    getters: {
        dumbGetter: (state) => {
            return state.chainId + 1;
        },
    },

    actions: {
        setChainId(id) {
            this.chainId = id;
        },
    },
})
