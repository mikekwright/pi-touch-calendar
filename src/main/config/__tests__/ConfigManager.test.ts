/**
 * ConfigManager Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigManager } from '../ConfigManager';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  let testConfigDir: string;

  beforeEach(() => {
    // Create a temporary directory for testing
    testConfigDir = path.join(os.tmpdir(), 'pi-touch-calendar-test-' + Date.now());
    configManager = new ConfigManager({ configDir: testConfigDir });
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testConfigDir)) {
      fs.rmSync(testConfigDir, { recursive: true, force: true });
    }
  });

  describe('initialize()', () => {
    it('should create config directory if it does not exist', () => {
      configManager.initialize();
      expect(fs.existsSync(testConfigDir)).toBe(true);
    });

    it('should create logs directory', () => {
      configManager.initialize();
      const logsDir = configManager.getLogsDir();
      expect(fs.existsSync(logsDir)).toBe(true);
    });

    it('should set correct permissions on config directory (700)', () => {
      configManager.initialize();
      const stats = fs.statSync(testConfigDir);
      const mode = stats.mode & parseInt('777', 8);
      expect(mode).toBe(parseInt('700', 8));
    });

    it('should throw error if directory creation fails', () => {
      // Create a file at the config dir path to simulate failure
      fs.mkdirSync(path.dirname(testConfigDir), { recursive: true });
      fs.writeFileSync(testConfigDir, 'blocking file');

      expect(() => configManager.initialize()).toThrow(/Failed to initialize config directory/);

      // Cleanup
      fs.unlinkSync(testConfigDir);
    });
  });

  describe('getConfigDir()', () => {
    it('should return the config directory path', () => {
      expect(configManager.getConfigDir()).toBe(testConfigDir);
    });
  });

  describe('getLogsDir()', () => {
    it('should return the logs directory path', () => {
      const expected = path.join(testConfigDir, 'logs');
      expect(configManager.getLogsDir()).toBe(expected);
    });
  });

  describe('getCredentialsFile()', () => {
    it('should return the credentials file path', () => {
      const expected = path.join(testConfigDir, 'credentials.json');
      expect(configManager.getCredentialsFile()).toBe(expected);
    });
  });

  describe('credentialsFileExists()', () => {
    it('should return false when credentials file does not exist', () => {
      expect(configManager.credentialsFileExists()).toBe(false);
    });

    it('should return true when credentials file exists', () => {
      configManager.initialize();
      configManager.savePincode('1234');
      expect(configManager.credentialsFileExists()).toBe(true);
    });
  });

  describe('validatePincode()', () => {
    it('should accept valid 4-digit pincode', () => {
      expect(configManager.validatePincode('1234')).toBe(true);
    });

    it('should accept valid 8-digit pincode', () => {
      expect(configManager.validatePincode('12345678')).toBe(true);
    });

    it('should accept valid 6-digit pincode', () => {
      expect(configManager.validatePincode('123456')).toBe(true);
    });

    it('should reject pincode with less than 4 digits', () => {
      expect(configManager.validatePincode('123')).toBe(false);
    });

    it('should reject pincode with more than 8 digits', () => {
      expect(configManager.validatePincode('123456789')).toBe(false);
    });

    it('should reject pincode with non-numeric characters', () => {
      expect(configManager.validatePincode('12a4')).toBe(false);
      expect(configManager.validatePincode('abcd')).toBe(false);
    });

    it('should reject empty pincode', () => {
      expect(configManager.validatePincode('')).toBe(false);
    });

    it('should reject null pincode', () => {
      expect(configManager.validatePincode(null as any)).toBe(false);
    });

    it('should reject undefined pincode', () => {
      expect(configManager.validatePincode(undefined as any)).toBe(false);
    });
  });

  describe('hashPincode()', () => {
    it('should hash pincode using SHA-256', () => {
      const hash = configManager.hashPincode('1234');
      expect(hash).toBe('03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');
    });

    it('should produce different hashes for different pincodes', () => {
      const hash1 = configManager.hashPincode('1234');
      const hash2 = configManager.hashPincode('5678');
      expect(hash1).not.toBe(hash2);
    });

    it('should produce same hash for same pincode', () => {
      const hash1 = configManager.hashPincode('1234');
      const hash2 = configManager.hashPincode('1234');
      expect(hash1).toBe(hash2);
    });
  });

  describe('savePincode()', () => {
    beforeEach(() => {
      configManager.initialize();
    });

    it('should save hashed pincode to credentials file', () => {
      configManager.savePincode('1234');

      const credentialsFile = configManager.getCredentialsFile();
      expect(fs.existsSync(credentialsFile)).toBe(true);

      const data = JSON.parse(fs.readFileSync(credentialsFile, 'utf-8'));
      expect(data.pincode).toBe(configManager.hashPincode('1234'));
    });

    it('should include createdAt timestamp', () => {
      configManager.savePincode('1234');

      const credentialsFile = configManager.getCredentialsFile();
      const data = JSON.parse(fs.readFileSync(credentialsFile, 'utf-8'));
      expect(data.createdAt).toBeDefined();
      expect(new Date(data.createdAt)).toBeInstanceOf(Date);
    });

    it('should throw error for invalid pincode (too short)', () => {
      expect(() => configManager.savePincode('123')).toThrow(/Invalid pincode format/);
    });

    it('should throw error for invalid pincode (too long)', () => {
      expect(() => configManager.savePincode('123456789')).toThrow(/Invalid pincode format/);
    });

    it('should throw error for invalid pincode (non-numeric)', () => {
      expect(() => configManager.savePincode('abcd')).toThrow(/Invalid pincode format/);
    });

    it('should set correct file permissions (600)', () => {
      configManager.savePincode('1234');

      const credentialsFile = configManager.getCredentialsFile();
      const stats = fs.statSync(credentialsFile);
      const mode = stats.mode & parseInt('777', 8);
      expect(mode).toBe(parseInt('600', 8));
    });
  });

  describe('loadPincode()', () => {
    beforeEach(() => {
      configManager.initialize();
    });

    it('should return null when credentials file does not exist', () => {
      expect(configManager.loadPincode()).toBeNull();
    });

    it('should load hashed pincode from credentials file', () => {
      configManager.savePincode('1234');
      const loadedHash = configManager.loadPincode();
      expect(loadedHash).toBe(configManager.hashPincode('1234'));
    });

    it('should throw error when credentials file is corrupted', () => {
      const credentialsFile = configManager.getCredentialsFile();
      fs.writeFileSync(credentialsFile, 'invalid json');

      expect(() => configManager.loadPincode()).toThrow(/Failed to load credentials/);
    });
  });

  describe('verifyPincode()', () => {
    beforeEach(() => {
      configManager.initialize();
    });

    it('should return true for correct pincode', () => {
      configManager.savePincode('1234');
      expect(configManager.verifyPincode('1234')).toBe(true);
    });

    it('should return false for incorrect pincode', () => {
      configManager.savePincode('1234');
      expect(configManager.verifyPincode('5678')).toBe(false);
    });

    it('should return false when no pincode is stored', () => {
      expect(configManager.verifyPincode('1234')).toBe(false);
    });
  });

  describe('verifyFilePermissions()', () => {
    beforeEach(() => {
      configManager.initialize();
    });

    it('should return true for file with correct permissions (600)', () => {
      configManager.savePincode('1234');
      const credentialsFile = configManager.getCredentialsFile();
      expect(configManager.verifyFilePermissions(credentialsFile)).toBe(true);
    });

    it('should return true for directory with correct permissions (700)', () => {
      const configDir = configManager.getConfigDir();
      expect(configManager.verifyFilePermissions(configDir)).toBe(true);
    });

    it('should return false for non-existent file', () => {
      expect(configManager.verifyFilePermissions('/non/existent/file')).toBe(false);
    });
  });

  describe('deleteCredentials()', () => {
    beforeEach(() => {
      configManager.initialize();
    });

    it('should delete credentials file if it exists', () => {
      configManager.savePincode('1234');
      expect(configManager.credentialsFileExists()).toBe(true);

      configManager.deleteCredentials();
      expect(configManager.credentialsFileExists()).toBe(false);
    });

    it('should not throw error if credentials file does not exist', () => {
      expect(() => configManager.deleteCredentials()).not.toThrow();
    });
  });
});
