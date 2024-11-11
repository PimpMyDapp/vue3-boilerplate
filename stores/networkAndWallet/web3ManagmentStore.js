import { defineStore } from "pinia";

import {
    BrowserProvider,
    JsonRpcProvider,
    WebSocketProvider
} from 'ethers';
import includes from 'lodash/includes';
import { hexToNumber } from '~/composables/blockchainHelpers';

export const useWeb3Manager = defineStore('web3Manager', {
    state: () => {
        return {
            eth: null,
            clientProvider: null,
            clientNotSupported: false,

            currentAccountAddress: '',

            accountAddressInterval: '',
            onAccountAddressChangeCallbacks: [],

            onChainChangeCallbacks: [],
            onClientProviderReadyCallbacks: [],
            onClientProviderDisconnectCallbacks: [],
            onServerReconnectCallbacks: [],
            onServerProviderReadyCallbacks: [],

            currentNetworkId: '',
            currentServerNetworkId:  '',
            currentRpcServer: '',

            serverProvider: '',
            serverNotSupported: true,
        }
    },

    actions: {
        // Callbacks handlers zone
        onAccountAddressChange(callback) {
            this.onAccountAddressChangeCallbacks.push(callback);
        },
        triggerOnAccountAddressChange(newAccountAddress) {
            this.currentAccountAddress = newAccountAddress;
            this.onAccountAddressChangeCallbacks.forEach((callback) => callback(newAccountAddress))
        },
        triggerOnChainChange(newChainId) {
            this.currentNetworkId = newChainId;
            this.onChainChangeCallbacks.forEach((callback) => callback(newChainId))
        },
        onClientProviderReadySubscribe(callback) {
            this.onClientProviderReadyCallbacks.push(callback);
        },
        triggerClientProviderReady() {
            this.onClientProviderReadyCallbacks.forEach((callback) => callback())
        },
        onClientProviderDisconnectSubscribe(callback) {
            this.onClientProviderDisconnectCallbacks.push(callback);
        },
        triggerClientProviderDisconnect() {
            this.onClientProviderDisconnectCallbacks.forEach((callback) => callback())
        },
        onServerReconnect(callback) {
            this.onServerReconnectCallbacks.push(callback);
        },
        triggerOnServerReconnect() {
            this.onServerReconnectCallbacks.forEach((callback) => callback())
        },
        onServerProviderReadySubscribe(callback) {
            this.onServerProviderReadyCallbacks.push(callback);
        },
        triggerServerProviderReady() {
            this.onServerProviderReadyCallbacks.forEach((callback) => callback());
            this.onServerProviderReadyCallbacks = [];
        },
        //----------------------------

        isClientProviderAuthRequired(provider) {
            if (provider) {
                const clientWeb3 = new BrowserProvider(provider)
                return clientWeb3.listAccounts()
                    .then(accounts => {
                        return !accounts || !accounts[0];
                    }).catch(e => {
                        console.error('PROVIDER_ERROR', e);
                        return true;
                    });
            } else if (window['ethereum']) {
                if (window['ethereum'].isCoin98) {
                    return !(window['ethereum'].state && window['ethereum'].state.isConnected);
                }
                if (window['ethereum'].isNiftyWallet) {
                    return false;
                }
                if (window['ethereum'].isTrust) {
                    return window['ethereum'].request({method: 'eth_accounts'}).then(accounts => !accounts[0])
                }
                const clientWeb3 = new BrowserProvider(window['ethereum']);
                return clientWeb3.listAccounts()
                    .then(accounts => {
                        return !accounts || !accounts[0];
                    }).catch(e => {
                        console.error('PROVIDER_ERROR', e);
                        return true;
                    });
            } else if (window['coin98']) {
                return true;
            } else if (window['web3']) {
                return false;
            }
            return true;
        },

        getClientProvider() {
            return window['ethereum'] ? window['ethereum'] : (window['web3'] || {}).currentProvider;
        },

        async getChainId() {
            return this.getClientProvider()
                .request({method: 'eth_chainId'})
                .then(chainId => hexToNumber(chainId));
        },

        async initClientProvider(provider, options) {
            if (this.accountAddressInterval) {
                clearInterval(this.accountAddressInterval);
            }

            this.initEth();
            if (provider) {
                try {
                    this.clientProvider = new BrowserProvider(provider);
                } catch (error) {
                    options && options.onError ? options.onError(error) : null;
                    console.error('INIT_WEB3', error);
                }
            } else if ((window['ethereum'] && window['ethereum'].isCoin98) || window['coin98']) {
                // Checking if Web3 has been injected by the browser (Mist/MetaMask)
                // Modern dapp browsers...
                try {
                    await window['ethereum'].request({method: 'eth_accounts'});
                    window['ethereum'].autoRefreshOnNetworkChange = false;
                    this.clientProvider = new BrowserProvider(window['ethereum']);
                } catch (error) {
                    options && options.onError ? options.onError(error) : null;
                    console.error('INIT_WEB3', error);
                }
            } else if (window['ethereum'] && window['ethereum'].isTrust) {
                // Checking if Web3 has been injected by the browser (Mist/MetaMask)  // Modern dapp browsers...
                try {
                    const accounts = await window['ethereum'].request({method: 'eth_accounts'});
                    if (!accounts[0]) {
                        await window['ethereum'].enable();
                    }
                    this.clientProvider = new BrowserProvider(window['ethereum']);
                } catch (error) {
                    options && options.onError ? options.onError(error) : null;
                    console.error('INIT_WEB3', error);
                }
            } else if (window['ethereum']) {
                // Checking if Web3 has been injected by the browser (Mist/MetaMask)
                // Modern dapp browsers...
                try {
                    // Request account access if needed
                    if (!window['ethereum'].isCoin98 && !window['ethereum'].selectedAddress && window['ethereum'].enable) {
                        await window['ethereum'].enable();
                    }
                    window['ethereum'].autoRefreshOnNetworkChange = false;
                    this.clientProvider = new BrowserProvider(window['ethereum']);
                } catch (error) {
                    options && options.onError ? options.onError(error) : null;
                    console.error('INIT_WEB3', error);
                }
            }
            // Legacy dapp browsers...
            else if (window['web3']) {
                try {
                    this.clientProvider = new BrowserProvider(window['web3'].currentProvider);
                } catch (error) {
                    options && options.onError ? options.onError(error) : null;
                    console.error('INIT_PROVIDER', error);
                }
            }
            if (this.clientProvider) {
                this.clientNotSupported = false;
            } else {
                this.clientNotSupported = true;
                this.triggerClientProviderReady();
                return;
            }

            this.currentNetworkId = await this.clientProvider.getNetwork().then(n => n.chainId);

            const accounts = await this.clientProvider.listAccounts();

            this.triggerOnAccountAddressChange(accounts[0]);
            this.triggerClientProviderReady();

            //this.$store.commit('network_id', networkId);

            this.accountAddressInterval = setInterval(async () => {
                try {
                    const accounts = await this.clientProvider.listAccounts();
                    if (!accounts || accounts[0] === this.currentAccountAddress)
                        return;
                    this.triggerOnAccountAddressChange(accounts[0]);
                } catch (e) {
                    console.warn('GET_ACCOUNTS', e)
                }
            }, 1000);
        },

        onChainChanged(callback) {
            const startTimestamp = Math.round(new Date().getTime() / 1000);
            this.onChainChangeCallbacks.push(callback);

            window['ethereum'] && window['ethereum'].on('chainChanged', async () => {
                const chainId = await window['ethereum']
                    .request({method: 'eth_chainId'});
                if (Math.round(new Date().getTime() / 1000) - startTimestamp < 5) {
                    return;
                }
                this.triggerOnChainChange(hexToNumber(chainId));
            });
        },

        async checkClientChain() {
            if (!window['ethereum']) {
                return true;
            }
            const chainId = hexToNumber(await window['ethereum'].request({method: 'eth_chainId'}));
            if (Web3Manager.currentNetworkId && chainId !== Web3Manager.currentNetworkId) {
                this.triggerOnChainChange(chainId);
                return false;
            }
            return true;
        },

        async onClientProviderReady() {
            if ((this.clientProvider && this.currentNetworkId) || this.clientNotSupported) {
                return;
            } else {
                return new Promise((resolve) => {
                    const callback = () => {
                        resolve();
                        this.onClientProviderReadyCallbacks.splice(this.onClientProviderReadyCallbacks.indexOf(callback), 1);
                    };
                    this.onClientProviderReadySubscribe(callback);
                })
            }
        },

        async getClientAccounts() {
            return this.clientProvider.listAccounts();
        },

        async getClientBlockNumber() {
            return this.clientProvider.getBlockNumber();
        },

        async initServerProvider(rpcServers) {
            if (process.env.RPC_SERVER) {
                rpcServers = [process.env.RPC_SERVER];
            }
            this.initEth();
            if (!rpcServers || !rpcServers.length) {
                this.serverProvider = null;
                this.serverNotSupported = true;
                this.currentRpcServer = null;
                console.warn('RPC_SERVER_NULL');
                this.triggerServerProviderReady();
                return;
            }
            this.serverNotSupported = false;

            let provider;
            if (includes(rpcServers[0], 'ws://')) {
                provider = new WebSocketProvider(rpcServers[0]);
                provider.on('error', async (e) => {
                    console.warn('WEBSOCKET_RECONNECT', e);
                    await this.initServerProvider(rpcServers);
                    this.triggerOnServerReconnect();
                });
                provider.on('end', async (e) => {
                    console.warn('WEBSOCKET_RECONNECT', e);
                    await this.initServerProvider(rpcServers);
                    this.triggerOnServerReconnect();
                });
            } else {
                provider = new JsonRpcProvider(rpcServers[0]);
            }

            this.serverProvider = provider;
            // console.warn('WEB3_VER', this.serverWeb3.version.toString());

            await new Promise((resolve, reject) => {
                let alreadyHandled = false;

                this.serverProvider.getNetwork()
                    .then(async (n) => {
                        if (alreadyHandled)
                            return;
                        console.warn('RPC_SERVER', rpcServers[0]);
                        this.currentRpcServer = rpcServers[0];
                        this.currentServerNetworkId = n.chainId;
                        this.triggerServerProviderReady();
                        alreadyHandled = true;
                        resolve();
                    })
                    .catch(async (e) => {
                        if (alreadyHandled)
                            return;
                        console.warn('GET_ID_ERROR', e);
                        alreadyHandled = true;
                        resolve(this.initServerProvider(rpcServers.slice(1)));
                        this.triggerOnServerReconnect();
                    });

                setTimeout(() => {
                    if (alreadyHandled)
                        return;
                    alreadyHandled = true;
                    resolve(this.initServerProvider(rpcServers.slice(1)));
                }, 3000);
            });
        },

        async onServerProviderReady() {
            if (this.serverProvider && this.currentRpcServer) {
                return;
            } else {
                return new Promise((resolve) => this.onServerProviderReadySubscribe(resolve))
            }
        },

        async providerForCall() {
            if (this.serverNotSupported) {
                await this.onClientProviderReady();
                return this.clientProvider;
            } else {
                await this.onServerProviderReady();
                return this.serverNotSupported ? this.clientProvider : this.serverProvider;
            }
        },

        clientDisconnect() {
            try {
                if (window['coin98']) {
                    window['coin98'].disconnect()
                } else if (this.clientProvider.destroy) {
                    this.clientProvider.destroy()
                } else if (this.clientProvider.connection) {
                    // Older versions of web3's providers didn't expose a generic interface for disconnecting
                    this.clientProvider.connection.close()
                }
            } catch (e) {
                console.warn('DISCONNECT_NOT_SUPPORT', e);
            }

            this.currentNetworkId = null;
            this.clientProvider = null;
            this.triggerClientProviderDisconnect();
        },

        initEth() {
            this.eth = {};
            ['estimateGas', 'getTransactionCount', 'getGasPrice', 'getBalance', 'getTransactionReceipt', 'getTransaction', 'getBlockNumber', 'getBlock'].forEach((key) => {
                this.eth[key] = async function () {
                    const args = arguments;
                    const preferredWeb3 = await Web3Manager.providerForCall();
                    return preferredWeb3[key].apply(preferredWeb3, args);
                }
            });

            this.eth.net = {
                getId: () => Web3Manager.providerForCall().then(p => p.getNetwork()).then(n => n.chainId)
            };
        }
    }
})
