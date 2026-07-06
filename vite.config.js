import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
