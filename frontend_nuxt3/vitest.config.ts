import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",

    coverage: {
      provider: "istanbul",
      reporter: ["json", "lcov", "html"],

      /*
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      */
    },
  },
});
