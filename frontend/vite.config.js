import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  console.log(`🔧 Vite building in ${mode} mode`);
  
  return {
    plugins: [react()],
    server: {
      port: 5173,          // Development server port
      open: true,          // Auto open in browser
      host: true,          // Listen on all addresses
    },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
    resolve: {
      alias: {
        '@': '/src',       // optional: use @ as alias for /src
      },
    },
  };
});
