/// <reference types='vitest' />
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../node_modules/.vite/pizza',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001/pizza-app-394/us-central1/main',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
