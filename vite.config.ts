import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Isso faz com que o servidor escute em todas as interfaces de rede
    port: 3000, // Você pode alterar a porta se necessário
  },
})
