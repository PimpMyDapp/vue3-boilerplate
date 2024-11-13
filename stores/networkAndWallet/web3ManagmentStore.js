import {defineStore} from 'pinia';
import { markRaw } from 'vue';

import { providers } from 'ethers';

import includes from 'lodash/includes';
import { hexToNumber } from '~/composables/blockchainHelpers';

import {useWalletStore} from '~/stores/networkAndWallet/walletStore';

export const useWeb3Manager = defineStore('web3Manager', {
	state: () => {
		return {
			eth: null,
			clientNotSupported: false,
			
			currentAccountAddress: '',
			
			accountAddressInterval: '',
			onAccountAddressChangeCallbacks: [],
			
			onChainChangeCallbacks: [],
			onClientProviderReadyCallbacks: [],
			onClientProviderDisconnectCallbacks: [],
			onServerReconnectCallbacks: [],
			onServerProviderReadyCallbacks: [],
			
			currentServerNetworkId: '',
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
			const walletStore = useWalletStore();
			walletStore.wallet_chain_id = newChainId;
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
		checksIfWalletConnected() {
			if (window['ethereum']) {
				if (window['ethereum'].isCoin98) {
					return !!(window['ethereum'].state && window['ethereum'].state.isConnected);
				}
				if (window['ethereum'].isNiftyWallet) {
					return false;
				}
				if (window['ethereum'].isTrust) {
					return window['ethereum'].request({method: 'eth_accounts'}).then(accounts => !!accounts[0])
				}
				const clientWeb3 = new providers.Web3Provider(window['ethereum']);
				return clientWeb3.listAccounts()
					.then(accounts => {
						return !!accounts || !!accounts[0];
					}).catch(e => {
						console.error('PROVIDER_ERROR', e);
						return false;
					});
			} else if (window['coin98']) {
				return false;
			} else if (window['web3']) {
				return true;
			}
			return false;
		},
		
		async getChainId() {
			return this.getClientProvider()
				.request({method: 'eth_chainId'})
				.then(chainId => hexToNumber(chainId));
		},
		/**
		 * Call this function when you need to connect wallet
		 * @param provider
		 * @param options
		 * @returns {Promise<void>}
		 */
		async initClientProvider(provider, options = {}) {
			const walletStore = useWalletStore();

			if (this.accountAddressInterval) {
				clearInterval(this.accountAddressInterval);
			}
			
			this.initEth();
			if (provider) {
				// provider is always null
				try {
					walletStore.provider = markRaw(new providers.Web3Provider(provider));
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
					walletStore.provider = markRaw(new providers.Web3Provider(window['ethereum']));
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
					walletStore.provider = markRaw(new providers.Web3Provider(window['ethereum']));
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
					walletStore.provider = markRaw(new providers.Web3Provider(window['ethereum']));
				} catch (error) {
					options && options.onError ? options.onError(error) : null;
					console.error('INIT_WEB3', error);
				}
			}
			// Legacy dapp browsers...
			else if (window['web3']) {
				try {
					walletStore.provider = markRaw(new providers.Web3Provider(window['web3'].currentProvider));
				} catch (error) {
					options && options.onError ? options.onError(error) : null;
					console.error('INIT_PROVIDER', error);
				}
			}
			if (walletStore.provider) {
				this.clientNotSupported = false;
			} else {
				this.clientNotSupported = true;
				this.triggerClientProviderReady();
				return;
			}
			
			walletStore.wallet_chain_id = await walletStore.provider.getNetwork().then(n => n.chainId);
			
			const accounts = await walletStore.provider.listAccounts();
			
			this.triggerOnAccountAddressChange(accounts[0]);
			this.triggerClientProviderReady();
			
			this.accountAddressInterval = setInterval(async () => {
				try {
					const accounts = await walletStore.provider.listAccounts();
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
				console.log('chain has changed!')
				this.triggerOnChainChange(hexToNumber(chainId));
			});
		},
		async checkClientChain() {
			const walletStore = useWalletStore();
			if (!window['ethereum']) {
				return true;
			}
			const chainId = hexToNumber(await window['ethereum'].request({method: 'eth_chainId'}));
			if (walletStore.wallet_chain_id && chainId !== walletStore.wallet_chain_id) {
				this.triggerOnChainChange(chainId);
				return false;
			}
			return true;
		},
		getClientProvider() {
			return window['ethereum'] ? window['ethereum'] : (window['web3'] || {}).currentProvider;
		},
		async onClientProviderReady() {
			const walletStore = useWalletStore();
			if ((walletStore.provider && walletStore.wallet_chain_id) || this.clientNotSupported) {
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
			const walletStore = useWalletStore();
			return walletStore.provider.listAccounts();
		},
		async getClientBlockNumber() {
			const walletStore = useWalletStore();
			return walletStore.provider.getBlockNumber();
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
				provider = new providers.WebSocketProvider(rpcServers[0]);
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
				provider = new providers.JsonRpcProvider(rpcServers[0]);
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
		destroyServerProvider() {
			if (this.serverProvider) {
				this.serverProvider.onclose = null;
				this.serverProvider.close();
			}
		},
		async onServerProviderReady() {
			if (this.serverProvider && this.currentRpcServer) {
				return;
			} else {
				return new Promise((resolve) => this.onServerProviderReadySubscribe(resolve))
			}
		},
		async providerForCall() {
			const walletStore = useWalletStore();

			if (this.serverNotSupported) {
				await this.onClientProviderReady();
				return walletStore.provider;
			} else {
				await this.onServerProviderReady();
				return this.serverNotSupported ? walletStore.provider : this.serverProvider;
			}
		},
		clientDisconnect() {
			const walletStore = useWalletStore();

			try {
				if (window['coin98']) {
					window['coin98'].disconnect()
				} else if (walletStore.provider.destroy) {
					walletStore.provider.destroy()
				} else if (walletStore.provider.connection) {
					// Older versions of web3's providers didn't expose a generic interface for disconnecting
					walletStore.provider.connection.close()
				}
			} catch (e) {
				console.warn('DISCONNECT_NOT_SUPPORT', e);
			}
			
			walletStore.wallet_chain_id = null;
			walletStore.provider = null;
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
		},
	}
})
