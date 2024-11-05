import { defineStore } from 'pinia';
import { useServiceStore } from '~/stores/serviceStore';

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
            const _service = useServiceStore();
            if (_service.nowIntervalId) {
                clearInterval(_service.nowIntervalId);
                _service.nowIntervalId = 0;
            }
            _service.nowIntervalId = setInterval(() => {
                this.now = Math.round(new Date().getTime() / 1000);
            }, 1000)
        },
    }
});
