import OpenLayers from "vue3-openlayers";

export default defineNuxtPlugin({
  name: "my-plugin",
  enforce: "pre", // or 'post'
  async setup(nuxtApp) {
    nuxtApp.vueApp.use(OpenLayers);
    // this is the equivalent of a normal functional plugin
  },
  hooks: {
    // You can directly register Nuxt app runtime hooks here
    "app:created"() {
      const nuxtApp = useNuxtApp();
      // do something in the hook
    },
  },
  env: {
    // Set this value to `false` if you don't want the plugin to run when rendering server-only or island components.
    islands: true,
  },
});
