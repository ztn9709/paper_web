import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8000
  },
  resolve: {
    alias: {
      // 键必须以斜线开始和结束
      '@': resolve(__dirname, './src')
    }
  }
})
