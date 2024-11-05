import Popper from 'vue3-popper';

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.component('Popper', Popper);
});
