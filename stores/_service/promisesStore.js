/**
 * This store helps to create and manage promises.
 * You can subscribe to promise and await for it resolve somewhere else in a code <(**)>
 */

import { defineStore } from 'pinia';

export const usePromiseStore = defineStore("promiseStore", {
	state: () => {
		return {
			resolvers: {},
			promises: {},
		};
	},

	actions: {
		/**
		 * Subscribe caller to a promise. If it's not exist, creates it.
		 * If promise already fulfilled, returns it immediately.
		 *
		 * @param name - Required. Name of the promise.
		 * @param callback - Optional. Will be called after promise resolve. Will be called once on fulfill.
		 * If you want callback to fire everytime, use waitForForce method.
		 * @returns {Promise<*>}
		 */
		async waitFor(name, callback = null) {
			if (!name) Error('Please provide promise name to subscribe!');
			this.createIfNotExist(name, callback);
			return await this.promises[name];
		},
		
		/**
		 * Subscribe caller to a promise.
		 * Always creates fresh Promise. if existing was fulfilled before, it will be overwritten.
		 * @param name - Required. Name of the promise.
		 * @param callback - Optional. will be called after promise resolve. Will be called every time waitForForce is called.
		 * @returns {Promise<*>}
		 */
		async waitForForce(name, callback = null) {
			if (!name) Error('Please provide promise name to subscribe!');
			this._createPromise(name, callback);
			return await this.promises[name];
		},
		
		/**
		 * Resolves a promise. But only if it exists.
		 * Otherwise, will fall silently
		 * @param name - Required. Name of the promise.
		 * @param callback - Optional. will be called after promise resolve.
		 */
		resolve(name, callback) {
			if (!name) Error('Please provide promise name to resolve!');
			
			if (this.resolvers[name]) {
				this.resolvers[name]();
			} else {
				this._createPromise(name, callback);
				this.resolvers[name]();
			}
		},
		
		/**
		 * Creates promise if it's not exist, so we can use it somewhere later.
		 * @param name - Required. Name of the promise.
		 * @param callback - Optional. will be called after promise resolve.
		 */
		createIfNotExist(name, callback = null) {
			if (!this.resolvers[name]) {
				this._createPromise(name, callback);
			}
		},
		
		/**
		 * DO NOT USE EXTERNALLY!
		 *
		 * Internal function that creates promise and its resolver.
		 * BE CAREFUL CALLING IT, IT WILL REWRITE EXISTING PROMISE.
		 * @param name - name of the promise to create. Required.
		 * @param callback - callback that will be called after fulfill.
		 *
		 * @private
		 */
		_createPromise(name, callback) {
			this.resolvers[name] = null;
			
			this.promises[name] = new Promise(resolve => {
				this.resolvers[name] = resolve;
			}).then(() => {
				if (callback) callback();
			})
		},
	}
})
