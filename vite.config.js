import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // listen on all network interfaces (makes Elastic IP accessible)
    port: 5173,         // frontend dev server port (can be changed, just not 3001)
    strictPort: true,   // if port is taken, Vite will fail instead of using another
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
