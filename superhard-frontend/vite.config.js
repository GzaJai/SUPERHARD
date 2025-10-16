import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,  // 👈 Fuerza siempre este puerto
    strictPort: true // Si está ocupado, tira error en lugar de cambiarlo
  }
})


