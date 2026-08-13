import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    legacy({
      targets: ['Chrome >= 49', 'Firefox >= 52'],
      modernPolyfills: true,
    }),
  ],
})