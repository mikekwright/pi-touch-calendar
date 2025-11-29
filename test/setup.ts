/**
 * Global test setup file
 * Runs before all tests
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock Electron API globally
global.window = global.window || {};
(global.window as any).electronAPI = {
  login: vi.fn(),
  logout: vi.fn(),
  onLoginSuccess: vi.fn(),
  removeAllListeners: vi.fn(),
};

// Suppress console errors in tests (optional)
// You can remove this if you want to see all console output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Not implemented: HTMLFormElement.prototype.submit')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
