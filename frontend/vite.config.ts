import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    process.env.NODE_ENV !== 'test' && tailwindcss(),
  ].filter(Boolean) as import('vite').PluginOption[],
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:4000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    server: {
      deps: {
        inline: [/@testing-library\/jest-dom/],
      },
    },
  },
});
