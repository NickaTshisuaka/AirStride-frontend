import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
7
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // remove "/api" prefix
      },
    },
  },
})
