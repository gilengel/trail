import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'istanbul',
        reporter: ['html', 'text'],
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        }
      }
    }
  })
)
