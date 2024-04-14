import { resolve } from 'path'
import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import registerCodeCoverageTasks from '@cypress/code-coverage/task'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  projectId: '4967xy',

  env: {
    codeCoverage: {
      exclude: 'cypress/**/*.*'
    }
  },
  e2e: {
    baseUrl: 'http://localhost:8080/',
    viewportWidth: 1280,
    viewportHeight: 768,
    specPattern: '**/*.e2e.ts',
    video: false,
    screenshotOnRunFailure: false,

    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config)

      on('file:preprocessor', vitePreprocessor(resolve(__dirname, './vite.config.ts')))

      return config
    }
  },

  component: {
    specPattern: 'src/components/**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    },

    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config)

      on('file:preprocessor', vitePreprocessor(resolve(__dirname, './vite.config.ts')))

      return config
    }
  }
})

/*
import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    specPattern: "src/components/**.cy.{js,jsx,ts,tsx}",
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  },

  e2e: {
    specPattern: "src/components/**.cy.{js,jsx,ts,tsx}",

    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },

    supportFile: false
  },
})
*/
