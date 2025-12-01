import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom', // Use jsdom for React component tests

    // Global test setup
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '.vite/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/index.ts', // Entry points often just export other modules
        'test/**',
        '**/__tests__/**',
      ],
      // Minimum coverage thresholds
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },

    // Setup files
    setupFiles: ['./test/setup.ts'],

    // Include patterns
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.vite',
      '.idea',
      '.git',
      '.cache',
    ],

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
  },

  resolve: {
    alias: {
      '@main': path.resolve(__dirname, './src/main'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@preload': path.resolve(__dirname, './src/preload'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
});
