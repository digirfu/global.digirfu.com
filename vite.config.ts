import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        // Every top-level page is a separate entry so `npm run build` emits them all.
        input: {
          main: path.resolve(__dirname, 'index.html'),
          services: path.resolve(__dirname, 'services.html'),
          capabilities: path.resolve(__dirname, 'capabilities.html'),
          works: path.resolve(__dirname, 'works.html'),
          results: path.resolve(__dirname, 'results.html'),
          security: path.resolve(__dirname, 'security.html'),
          discovery: path.resolve(__dirname, 'discovery.html'),
          terms: path.resolve(__dirname, 'terms.html'),
        },
      },
    },
  };
});
