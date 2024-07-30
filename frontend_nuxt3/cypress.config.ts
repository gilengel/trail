// cypress.config.ts
import { defineConfig } from "cypress";
import { loadNuxt, buildNuxt } from "@nuxt/kit";
import type { InlineConfig } from "vite";
import * as vitejs from "@vitejs/plugin-vue";

async function getNuxtViteConfig() {
  const nuxt = await loadNuxt({
    cwd: process.cwd(),
    dev: false,
    overrides: {
      ssr: false,
    },
  });
  return new Promise<InlineConfig>((resolve, reject) => {
    nuxt.hook("vite:extendConfig", (config) => {
      resolve(config);
      throw new Error("_stop_");
    });
    buildNuxt(nuxt).catch((err) => {
      if (!err.toString().includes("_stop_")) {
        reject(err);
      }
    });
  }).finally(() => nuxt.close());
}

export default defineConfig({
  //...
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
      async viteConfig() {
        const config = await getNuxtViteConfig();

        config.plugins = config?.plugins?.filter(
          // @ts-ignore
          (item) => !["replace", "vite-plugin-eslint"].includes(item.name)
        );

        config.plugins?.push(vitejs.default());

        if (config.server) {
          config.server.middlewareMode = false;
        }

        return config;
      },
    },
  },
});
