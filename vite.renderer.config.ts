import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config
// Note: React plugin will be added dynamically when we create React components
export default defineConfig(async () => {
  // Dynamically import ESM-only packages
  const react = await import('@vitejs/plugin-react').then(m => m.default);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@main': path.resolve(__dirname, './src/main'),
        '@renderer': path.resolve(__dirname, './src/renderer'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@preload': path.resolve(__dirname, './src/preload'),
        '@test': path.resolve(__dirname, './test'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/renderer/index.html'),
        },
      },
    },
  };
});
