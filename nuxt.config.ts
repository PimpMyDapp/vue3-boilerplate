// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-05',
  devtools: { enabled: true },
  modules: ['nuxt-icons', '@vueuse/nuxt', 'vuetify-nuxt-module'],
  plugins: [
    '~/plugins/popper.js',
    '~/plugins/modal.js',
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
    }
  },
  app: {
    baseURL: '/',
  },
  // styles below
  css: [
    '@/assets/scss/normalizer.css',
    '@/assets/scss/global.scss',
    'vue-final-modal/style.css',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "@/assets/fonts/_stylesheet.css" as *; @use "@/assets/scss/_mixins.scss" as *; @use "@/assets/scss/design-system/_vars.scss" as *; @use "@/assets/scss/design-system/_typography.scss" as *;',
        },
      },
    },
  },
})
