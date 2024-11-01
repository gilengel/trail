// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  compatibilityDate: "2024-07-31",

  modules: [
    "@pinia/nuxt",
    '@vueuse/nuxt',
    "@nuxtjs/google-fonts",
    "@nuxt/test-utils/module",
    "vuetify-nuxt-module"
  ],

  runtimeConfig: {
    public: {
      baseURL: process.env.API_ENDPOINT_BASE_URL || "http://localhost:3000",
    },
  },

  css: [
    "line-awesome/dist/line-awesome/css/line-awesome.css",
    "assets/maplibre-gl.css",
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/scss/global.scss";',
        },
      },
    },
  },

  googleFonts: {
    families: {
      Roboto: true,
      "Josefin+Sans": true,
      Lato: [100, 300],
      Raleway: {
        wght: [100, 400],
        ital: [100],
      },
      Inter: "200..700",
      "Crimson Pro": {
        wght: "200..900",
        ital: "200..700",
      },
      "Amatic SC": {
        wght: [400, 700],
      },
    },
    /*
    families: {
      Roboto: true,
      "Amatic SC": {
        wght: [400, 700],
        display: "swap",
      },
    },
    */

    download: true,
    inject: true,
  },
});