// This store used for service processes of another store and should not ever be used in app directly

import { defineStore } from 'pinia';

export const useTimersStore = defineStore("serviceStore", {
    state: () => {
        return {
            nowIntervalId: 0,
            networkIsChanging: false,
        }
    }
})
