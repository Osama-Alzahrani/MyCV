import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/backendApi': {
        target: 'https://cv.oaz.sa',
        changeOrigin: true,
      }
    }
  }
})
