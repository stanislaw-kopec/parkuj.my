import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// W kontenerze VITE_API_PROXY_TARGET wskazuje na http://backend:8080 (docker-compose).
// Lokalnie (npm run dev bez Dockera) domyślnie http://localhost:8080.
const apiTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,            // nasłuch na 0.0.0.0 — dostępne spoza kontenera
    port: 5173,
    watch: { usePolling: true }, // niezawodny hot reload przy bind-mount (Docker na Mac/Windows)
    proxy: {
      // Frontend woła /api/... względnie; Vite proxuje to do backendu — brak CORS.
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
