import { defineStore } from 'pinia';
import { useTimersStore } from '~/stores/_service/timersStore';

export const useCoreStore = defineStore("coreStore", {
    state: () => {
        return {
            is_active_tab: true,
            now: 0,
        }
    },

    actions: {
        checkTabStatus() {
            this.is_active_tab = !document.hidden;
        },
        setNow() {
            const _timers = useTimersStore();
            if (_timers.nowIntervalId) {
                clearInterval(_timers.nowIntervalId);
                _timers.nowIntervalId = 0;
            }
            _timers.nowIntervalId = setInterval(() => {
                this.now = Math.round(new Date().getTime() / 1000);
            }, 1000)
        },
    }
});
