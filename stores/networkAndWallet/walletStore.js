import { defineStore } from "pinia";
import { hexToNumber } from '~/composables/blockchainHelpers';

export const useWalletStore = defineStore("walletStore", {
    state: () => {
        return {
            wallet_type: '',
            user_wallet: null,
            wallet_chain_id: null,
            provider: null,
            
            walletReadyCallback: null,
            walletReadyPromise: null,
        }
    },

    actions: {
        /**
         * Setts wallet type and calling other initial methods
         * @returns {Promise<void>}
         */
        async initWalletInfo() {
            if (!window['ethereum']) {
                console.warn('metamask is not loaded yet');
            }
            if (window['ethereum'] && window['ethereum'].isMetaMask) {
                this.wallet_type = 'metamask';
            }
            await this.handleBasicWalletData();
        },

        async handleBasicWalletData() {
            if (this.wallet_type === 'metamask') {
                if(!window['ethereum']) {
                    console.warn('metamask is not loaded yet');
                    return;
                }
                this.wallet_chain_id = hexToNumber(await window['ethereum'].request({ method: 'eth_chainId' }))
            }
        },

        getClientProvider() {
            return window['ethereum'] ? window['ethereum'] : (window['web3'] || {}).currentProvider;
        },
        
        onWalletReady() {
            return new Promise((resolve, reject) => {
                if (this.user_wallet) {
                    resolve();
                } else {
                    this.walletReadyPromise.then(() => {
                        resolve();
                    });
                }
            });
        },
        
        setAddress(_walletAddress) {
            let firstInit = false;
            if (!this.user_wallet) {
                firstInit = true;
            }
            this.user_wallet = _walletAddress;
            if (firstInit && _walletAddress) {
                this.walletReadyCallback();
            }
        }
    },
})
