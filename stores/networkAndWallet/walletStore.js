import { defineStore } from "pinia";
import { useLocalStorage } from '@vueuse/core'
import { markRaw } from 'vue';
import {ethers, BigNumber, providers} from 'ethers';

import { usePromiseStore } from '~/stores/_service/promisesStore';
import { useChainStore } from '~/stores/networkAndWallet/chainManagementStore';
import { useTimersStore } from '~/stores/_service/timersStore';

import {numberToHex, hexToNumber} from '~/composables/blockchainHelpers';

export const useWalletStore = defineStore("walletStore", {
    state: () => {
        return {
            wallet_type: '',
            user_wallet: null,
            custom_wallet: useLocalStorage('custom-wallet', ''),
            last_user_wallet: null,
            wallet_chain_id: null,

            provider: null,
            signer: null,
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

            const chainStore = useChainStore();
            await this.getWalletType();

            if (chainStore.site_chain_id !== this.wallet_chain_id) return; // if site and wallet chain differs - STOP!

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
            if (!window['ethereum']) return;

            const chainStore = useChainStore();
            const timersStore = useTimersStore();

            // Checks if site and wallet chains differs, and we must swap a site chain
            if (this.wallet_chain_id !== chainStore.site_chain_id && !timersStore.networkIsChanging) {
                timersStore.networkIsChanging = true;
                await this.switchChain(chainStore.site_chain_id);
                await this.connectWallet();
                timersStore.networkIsChanging = false;
                // recursive call was made, so that call must end.
                return;
            }

            // enable wallet connection
            try {
                if (this.wallet_type === 'metamask') {
                    await window['ethereum'].enable();
                    await this.checkConnectedWallet();
                }
            } catch (e) {
                console.error(e);
            }
        },
        
        /**
         * simulate wallet disconnect.
         *
         * We can't control the wallet app, but we can change our data to make it look like logout!
         */
        disconnectWallet() {
            this.provider = null;
            this.signer = null;
            this.user_wallet = null;
        },
        
        /**
         * Call this when want to switch to any other chain
         * @param toChainId - should be a number represents another chain id
         * @returns {Promise<void>}
         */
        async switchChain(toChainId) {
            const chainStore = useChainStore();
            const chainId = numberToHex(toChainId);
            try {
                console.log('wallet_switchEthereumChain', [{ chainId }]);
                await window['ethereum'].request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    const chainConfig = chainStore.network_list.find(item => item.networkId === +toChainId);
                    const config = JSON.parse(JSON.stringify({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId,
                            chainName: chainConfig.title,
                            blockExplorerUrls: [chainConfig.static.explorerUrl],
                            rpcUrls: [chainConfig.static.publicRpc],
                            nativeCurrency: chainConfig.static.nativeCurrency,
                        }],
                    }));
                    console.log(config)
                    try {
                        await window['ethereum'].request(config);
                    } catch (addError) {
                        console.error('wallet_addEthereumChain failed', addError);
                    }
                } else {
                    console.error('unknown wallet_switchEthereumChain failed', switchError);
                }
            }
        },
        /**
         * Checks which type of wallet is currently connected or can be connected
         */
        async getWalletType() {
            if (!window['ethereum']) return;

            if (window['ethereum'].isMetaMask) {
                this.wallet_type = 'metamask';
                const chainId = await window['ethereum'].request({ method: 'eth_chainId' });
                this.wallet_chain_id = hexToNumber(chainId);
            }
        },
        
        // async testSigner() {
        //     console.log('testing signer...');
        //     console.log(this.signer)
        //     await this.signer.sendTransaction({
        //         to: '',
        //         value: BigNumber.from('1000000000000000'),
        //     });
        //     console.log('success!')
        // },
    },
})
