import MasonryWall from "@yeger/vue-masonry-wall";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    nuxtApp.vueApp.component("MasonryWall", MasonryWall);
  }
});
