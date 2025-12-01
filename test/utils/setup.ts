/**
 * Global test setup file
 * This file runs before all tests
 */

import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Electron APIs for testing
global.window = global.window || ({} as any);

// Mock electron IPC
if (!global.window.electron) {
  global.window.electron = {
    ipcRenderer: {
      send: vi.fn(),
      on: vi.fn(),
      once: vi.fn(),
      removeListener: vi.fn(),
      invoke: vi.fn(),
    },
  };
}

// Suppress console errors in tests (optional - comment out for debugging)
// global.console.error = vi.fn();
// global.console.warn = vi.fn();
