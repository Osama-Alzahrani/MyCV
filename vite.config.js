import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/backendApi': {
        target: 'https://cv.oaz.sa',
        changeOrigin: true,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      external: [
        '/public/js/boxicons.js',
        '/public/js/bootstrap.bundle.min.js',
      ],
      output: {
        manualChunks: {
          three: ['three'],
          tween: ['@tweenjs/tween.js'],
        }
      }
    }
  }
})
