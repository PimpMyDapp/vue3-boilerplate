import { onMounted, onUnmounted } from 'vue'
import { useCoreStore } from '~/stores/coreStore';

export function useEventListener(target, event, callback) {
    // if you want, you can also make this
    // support selector strings as target
    onMounted(() => target.addEventListener(event, callback))
    onUnmounted(() => target.removeEventListener(event, callback))
}

export function startGlobalListeners() {
    const coreStore = useCoreStore();
    if (process.client) {
        // check if app tab is active and set required
        useEventListener(document, "visibilitychange", () => {
            coreStore.checkTabStatus();
        })
    }
}
