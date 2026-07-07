import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'HabitFlow',
        short_name: 'HabitFlow',
        description: 'Track your habits effortlessly',
        theme_color: '#FBFBFA',
        background_color: '#FBFBFA',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia')) return 'vue-vendor';
            if (id.includes('lucide') || id.includes('sonner') || id.includes('confetti')) return 'ui-vendor';
            if (id.includes('chart.js') || id.includes('vue-chartjs')) return 'chart-vendor';
            if (id.includes('date-fns')) return 'date-vendor';
            if (id.includes('@dicebear')) return 'avatar-vendor';
            return 'vendor'; // fallback for other dependencies
          }
        }
      }
    }
  }
})
