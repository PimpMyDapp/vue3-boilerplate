import { onMounted, onUnmounted } from 'vue'
import { useCoreStore } from '~/stores/coreStore';

export function useEventListener(target, event, callback) {
    onMounted(() => target.addEventListener(event, callback))
    onUnmounted(() => target.removeEventListener(event, callback))
}

export function startGlobalListeners() {
    const coreStore = useCoreStore();
    // check if the app tab is active
    useEventListener(document, "visibilitychange", () => {
        coreStore.checkTabStatus();
    })
}
