import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), basicSsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Workspace package aliases for development - points to source instead of dist
      '@asgardeo/react': path.resolve(__dirname, '../../packages/react/src'),
      '@asgardeo/react-router': path.resolve(__dirname, '../../packages/react-router/src'),
      '@asgardeo/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
      '@asgardeo/browser': path.resolve(__dirname, '../../packages/browser/src'),
    },
  },
  // Enable source maps for better debugging
  build: {
    sourcemap: true,
  },
  // Ensure proper dev server configuration
  server: {
    sourcemapIgnoreList: false,
  },
});
