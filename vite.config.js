import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Resolved CORS issue with DeepSeek API
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
