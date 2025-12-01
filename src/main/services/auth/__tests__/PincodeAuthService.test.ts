/**
 * PincodeAuthService Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PincodeAuthService } from '../PincodeAuthService';
import { ConfigManager } from '../../../config/ConfigManager';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('PincodeAuthService', () => {
  let authService: PincodeAuthService;
  let configManager: ConfigManager;
  let testConfigDir: string;

  beforeEach(() => {
    // Create a temporary directory for testing
    testConfigDir = path.join(os.tmpdir(), 'pi-touch-calendar-auth-test-' + Date.now());
    configManager = new ConfigManager({ configDir: testConfigDir });
    authService = new PincodeAuthService(configManager);
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testConfigDir)) {
      fs.rmSync(testConfigDir, { recursive: true, force: true });
    }
  });

  describe('initialize()', () => {
    it('should initialize config manager and create directories', () => {
      authService.initialize();
      expect(fs.existsSync(testConfigDir)).toBe(true);
      expect(fs.existsSync(configManager.getLogsDir())).toBe(true);
    });
  });

  describe('isFirstTimeSetup()', () => {
    beforeEach(() => {
      authService.initialize();
    });

    it('should return true when no pincode exists', () => {
      expect(authService.isFirstTimeSetup()).toBe(true);
    });

    it('should return false when pincode exists', () => {
      const result = authService.createPincode('1234', '1234');
      expect(result.success).toBe(true);
      expect(authService.isFirstTimeSetup()).toBe(false);
    });
  });

  describe('createPincode()', () => {
    beforeEach(() => {
      authService.initialize();
    });

    it('should successfully create pincode with matching confirmation', () => {
      const result = authService.createPincode('1234', '1234');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Pincode created successfully.');
    });

    it('should create pincode with 4 digits', () => {
      const result = authService.createPincode('1234', '1234');
      expect(result.success).toBe(true);
    });

    it('should create pincode with 8 digits', () => {
      const result = authService.createPincode('12345678', '12345678');
      expect(result.success).toBe(true);
    });

    it('should fail with invalid pincode format (too short)', () => {
      const result = authService.createPincode('123', '123');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid pincode format');
    });

    it('should fail with invalid pincode format (too long)', () => {
      const result = authService.createPincode('123456789', '123456789');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid pincode format');
    });

    it('should fail with invalid pincode format (non-numeric)', () => {
      const result = authService.createPincode('abcd', 'abcd');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid pincode format');
    });

    it('should fail with invalid confirmation format', () => {
      const result = authService.createPincode('1234', 'abc');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid confirmation pincode format');
    });

    it('should fail when pincodes do not match', () => {
      const result = authService.createPincode('1234', '5678');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Pincodes do not match');
    });

    it('should fail when pincode already exists', () => {
      authService.createPincode('1234', '1234');
      const result = authService.createPincode('5678', '5678');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Pincode already exists');
    });
  });

  describe('authenticate()', () => {
    beforeEach(() => {
      authService.initialize();
    });

    it('should successfully authenticate with correct pincode', () => {
      authService.createPincode('1234', '1234');
      const result = authService.authenticate('1234');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Authentication successful.');
    });

    it('should fail authentication with incorrect pincode', () => {
      authService.createPincode('1234', '1234');
      const result = authService.authenticate('5678');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Incorrect pincode');
    });

    it('should fail authentication with invalid format', () => {
      authService.createPincode('1234', '1234');
      const result = authService.authenticate('abc');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid pincode format');
    });

    it('should fail when no pincode is configured', () => {
      const result = authService.authenticate('1234');
      expect(result.success).toBe(false);
      expect(result.message).toContain('No pincode configured');
      expect(result.isFirstTimeSetup).toBe(true);
    });

    it('should authenticate multiple times with same pincode', () => {
      authService.createPincode('1234', '1234');
      expect(authService.authenticate('1234').success).toBe(true);
      expect(authService.authenticate('1234').success).toBe(true);
      expect(authService.authenticate('1234').success).toBe(true);
    });
  });

  describe('changePincode()', () => {
    beforeEach(() => {
      authService.initialize();
      authService.createPincode('1234', '1234');
    });

    it('should successfully change pincode with correct current pincode', () => {
      const result = authService.changePincode('1234', '5678', '5678');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Pincode changed successfully.');

      // Verify old pincode no longer works
      expect(authService.authenticate('1234').success).toBe(false);

      // Verify new pincode works
      expect(authService.authenticate('5678').success).toBe(true);
    });

    it('should fail with incorrect current pincode', () => {
      const result = authService.changePincode('9999', '5678', '5678');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Current pincode is incorrect');

      // Verify original pincode still works
      expect(authService.authenticate('1234').success).toBe(true);
    });

    it('should fail with invalid new pincode format', () => {
      const result = authService.changePincode('1234', 'abc', 'abc');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid new pincode format');
    });

    it('should fail with invalid confirmation format', () => {
      const result = authService.changePincode('1234', '5678', 'abc');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid confirmation pincode format');
    });

    it('should fail when new pincodes do not match', () => {
      const result = authService.changePincode('1234', '5678', '9999');
      expect(result.success).toBe(false);
      expect(result.message).toContain('New pincodes do not match');

      // Verify original pincode still works
      expect(authService.authenticate('1234').success).toBe(true);
    });

    it('should fail with invalid current pincode format', () => {
      const result = authService.changePincode('abc', '5678', '5678');
      expect(result.success).toBe(false);
      // Note: authenticate() is called first, which returns "Current pincode is incorrect"
      // for invalid formats (since it validates format and returns generic error)
      expect(result.message).toContain('Current pincode is incorrect');
    });
  });

  describe('resetPincode()', () => {
    beforeEach(() => {
      authService.initialize();
      authService.createPincode('1234', '1234');
    });

    it('should delete credentials file', () => {
      expect(authService.isFirstTimeSetup()).toBe(false);
      authService.resetPincode();
      expect(authService.isFirstTimeSetup()).toBe(true);
    });

    it('should allow creating new pincode after reset', () => {
      authService.resetPincode();
      const result = authService.createPincode('5678', '5678');
      expect(result.success).toBe(true);
      expect(authService.authenticate('5678').success).toBe(true);
    });

    it('should not throw error when resetting non-existent pincode', () => {
      authService.resetPincode();
      expect(() => authService.resetPincode()).not.toThrow();
    });
  });
});
