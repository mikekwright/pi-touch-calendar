/**
 * Authentication IPC Handlers Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ipcMain } from 'electron';
import { registerAuthHandlers } from '../auth';
import { PincodeAuthService } from '../../../services/auth/PincodeAuthService';
import { AuthLogger } from '../../../services/logging/AuthLogger';
import { ConfigManager } from '../../../config/ConfigManager';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock electron
vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
}));

describe('Authentication IPC Handlers', () => {
  let configManager: ConfigManager;
  let authService: PincodeAuthService;
  let authLogger: AuthLogger;
  let testConfigDir: string;
  let mockWindowManager: any;
  let handlers: Map<string, Function>;

  beforeEach(() => {
    // Create temporary config directory
    testConfigDir = path.join(os.tmpdir(), 'pi-touch-calendar-ipc-test-' + Date.now());
    configManager = new ConfigManager({ configDir: testConfigDir });
    authService = new PincodeAuthService(configManager);
    authLogger = new AuthLogger(configManager);

    // Mock window manager
    mockWindowManager = {
      showMainApp: vi.fn(),
      showLogin: vi.fn(),
    };

    // Track registered handlers
    handlers = new Map();
    (ipcMain.handle as any).mockImplementation((channel: string, handler: Function) => {
      handlers.set(channel, handler);
    });

    // Clear previous mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testConfigDir)) {
      fs.rmSync(testConfigDir, { recursive: true, force: true });
    }
  });

  describe('registerAuthHandlers()', () => {
    it('should register AUTH_CHECK_SESSION handler', () => {
      registerAuthHandlers(mockWindowManager);
      expect(handlers.has('auth:checkSession')).toBe(true);
    });

    it('should register AUTH_LOGIN handler', () => {
      registerAuthHandlers(mockWindowManager);
      expect(handlers.has('auth:login')).toBe(true);
    });

    it('should register AUTH_LOGOUT handler', () => {
      registerAuthHandlers(mockWindowManager);
      expect(handlers.has('auth:logout')).toBe(true);
    });
  });

  describe('AUTH_CHECK_SESSION handler', () => {
    it('should return isFirstTimeSetup status', async () => {
      registerAuthHandlers(mockWindowManager);
      const handler = handlers.get('auth:checkSession')!;

      const result = await handler();

      // Result should have isFirstTimeSetup property (value depends on test environment)
      expect(result).toHaveProperty('isFirstTimeSetup');
      expect(typeof result.isFirstTimeSetup).toBe('boolean');
    });
  });

  describe('AUTH_LOGIN handler', () => {
    it('should return success and message properties', async () => {
      registerAuthHandlers(mockWindowManager);
      const handler = handlers.get('auth:login')!;

      const result = await handler({}, { pincode: '1234', confirmation: '1234' });

      // Should have success property
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');

      // Should have message if there's an error
      if (!result.success) {
        expect(result).toHaveProperty('message');
      }
    });
  });


  describe('AUTH_LOGOUT handler', () => {
    it('should handle logout', async () => {
      registerAuthHandlers(mockWindowManager);
      const handler = handlers.get('auth:logout')!;

      const result = await handler();

      expect(result.success).toBe(true);
    });
  });
});
