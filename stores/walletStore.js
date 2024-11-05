import { defineStore } from "pinia";

export const useWalletStore = defineStore("walletStore", {
    state: () => {
        return {
            user_wallet: null,
        }
    },

    actions: {
        set_wallet(wallet) {
            this.user_wallet = wallet;
        },
    },
})
