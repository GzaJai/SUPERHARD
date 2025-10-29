import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // 👈 Permite acceso desde red local
    port: 5173,  // 👈 Fuerza siempre este puerto
    strictPort: true, // Si está ocupado, tira error en lugar de cambiarlo
    allowedHosts: [
      'delsie-noneffusive-unperturbedly.ngrok-free.dev', // tu URL de ngrok
      'localhost',
      '127.0.0.1'
    ],
    // 🔥 NUEVO: Proxy para redirigir llamadas API al backend
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})

