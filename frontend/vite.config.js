import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,          // optional: set your dev port
    open: true,          // optional: auto open in browser
  },
  resolve: {
    alias: {
      '@': '/src',       // optional: use @ as alias for /src
    },
  },
});
