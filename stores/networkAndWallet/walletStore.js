import { defineStore } from "pinia";
import { useLocalStorage } from '@vueuse/core'
import { markRaw } from 'vue';
import {ethers, BigNumber, providers} from 'ethers';

import { usePromiseStore } from '~/stores/_service/promisesStore';
import { useWeb3Manager } from '~/stores/networkAndWallet/web3ManagmentStore';

export const useWalletStore = defineStore("walletStore", {
    state: () => {
        return {
            wallet_type: '',
            user_wallet: null,
            custom_wallet: useLocalStorage('custom-wallet', ''),
            last_user_wallet: null,
            wrong_network: false,
            wallet_loading: true,
            wallet_chain_id: null,
            provider: null,
            signer: null,
            wallet_enabled: false,
        }
    },

    actions: {
        /**
         * Setts wallet and resolve "walletReady" promise (if its first time setting wallet)
         * @param _walletAddress
         */
        setAddress(_walletAddress) {
            const promises = usePromiseStore();
            let firstInit = false;
            if (!this.user_wallet) {
                firstInit = true;
            }
            this.user_wallet = _walletAddress;
            if (firstInit && _walletAddress) {
                promises.resolve('walletReady');
            }
        },
        
        /**
         * checks if wallet connected to app
         *
         * @returns {Promise<void>}
         */
        async checkConnectedWallet() {
            if (!window['ethereum']) return;
            this.getWalletType();
            this.provider = markRaw(new providers.Web3Provider(window['ethereum']));

            const accounts = await this.provider.listAccounts();
            if (accounts.length === 0) return;
            this.signer = markRaw(this.provider.getSigner());
            this.setAddress(accounts[0]);
        },
        
        /**
         * Connects browser wallet
         *
         * @returns {Promise<void>}
         */
        async connectWallet() {
            // exit if ethereum not get injected
            if (!window['ethereum']) return;

            // enable wallet connection
            try {
                if (this.wallet_type === 'metamask') {
                    await window['ethereum'].enable();
                    await this.checkConnectedWallet();
                }

                // save signer to store
                this.signer = markRaw(this.provider.getSigner());
                
                this.wallet_enabled = true;
            } catch (e) {
                console.error(e);
            }
        },
        
        /**
         * simulate wallet disconnect.
         *
         * We cant actually control application, but we can change our data to make it look like logout!
         */
        disconnectWallet() {
            this.provider = null;
            this.signer = null;
            this.user_wallet = null;
            this.wallet_chain_id = null;
        },

        async testSigner() {
            console.log('testing signer...');
            if (!this.wallet_enabled && this.user_wallet) {
                this.connectWallet();
            }
            console.log(this.signer)
            await this.signer.sendTransaction({
                to: '',
                value: BigNumber.from('1000000000000000'),
            });
            console.log('success!')
        },
        
        // switchChain() {
        //     await window['ethereum'].request({
        //         method: 'wallet_switchEthereumChain',
        //         params: [{ chainId }],
        //     });
        // },
        /**
         * Checks which type of wallet is currently connected or can be connected
         */
        getWalletType() {
            if (!window['ethereum']) return;

            if (window['ethereum'].isMetaMask) this.wallet_type = 'metamask';
        },
    },
})
