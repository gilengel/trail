import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

const componentsDir = path.resolve(__dirname, 'src/runtime/components')

// collect all .vue files in the folder
const input: Record<string, string> = {}
fs.readdirSync(componentsDir).forEach((file) => {
  if (file.endsWith('.vue')) {
    const name = path.basename(file, '.vue')
    input[name] = path.resolve(componentsDir, file)
  }
})

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: path.resolve(__dirname, 'dist/runtime/components'),
    emptyOutDir: true,
    rollupOptions: {
      input,
      external: ['vue', 'vuetify'],
      output: {
        format: 'es',
        entryFileNames: '[name].mjs'
      }
    }
  }
})
