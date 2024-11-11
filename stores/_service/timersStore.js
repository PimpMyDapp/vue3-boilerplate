// This store used for service processes of another stores and should not be ever used in app directly

import { defineStore } from 'pinia';

export const useTimersStore = defineStore("serviceStore", {
    state: () => {
        return {
            nowIntervalId: 0,
        }
    }
})
