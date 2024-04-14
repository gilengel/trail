import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,

    rollupOptions: {
      output: {
        manualChunks: () => 'bundle'
      }
    }
  },
  plugins: [
    vue(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: ['.ts', '.vue'],
      cypress: true,
      requireEnv: false,
      nycrcPath: './.nycrc.json',
      forceBuildInstrument: true
    }),
    tsconfigPaths()
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['src/**/*.cy.ts'],
    coverage: {
      exclude: ['coverage*', 'e2e*', 'src/**/*.cy.ts', '**/*.cy.e2e.ts', '.eslintrc.cjs']
    }
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8080,

    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  preview: {
    host: '0.0.0.0',
    port: 8080,

    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
