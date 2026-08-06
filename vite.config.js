import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'axios'],
          charts: ['chart.js']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['biforate-abiotically-migdalia.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://nginx:80',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
