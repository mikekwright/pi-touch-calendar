/**
 * AuthLogger Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthLogger } from '../AuthLogger';
import { ConfigManager } from '../../../config/ConfigManager';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('AuthLogger', () => {
  let authLogger: AuthLogger;
  let configManager: ConfigManager;
  let testConfigDir: string;
  let testLogsDir: string;

  beforeEach(() => {
    // Create a temporary directory for testing
    testConfigDir = path.join(os.tmpdir(), 'pi-touch-calendar-logger-test-' + Date.now());
    configManager = new ConfigManager({ configDir: testConfigDir });
    authLogger = new AuthLogger(configManager);
    testLogsDir = configManager.getLogsDir();
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testConfigDir)) {
      fs.rmSync(testConfigDir, { recursive: true, force: true });
    }
  });

  describe('initialize()', () => {
    it('should create logs directory', () => {
      authLogger.initialize();
      expect(fs.existsSync(testLogsDir)).toBe(true);
    });
  });

  describe('logAuthAttempt()', () => {
    beforeEach(() => {
      authLogger.initialize();
    });

    it('should log successful authentication', () => {
      authLogger.logAuthAttempt(true, 'Test success');

      const logFiles = authLogger.getLogFiles();
      expect(logFiles.length).toBe(1);

      const content = fs.readFileSync(logFiles[0], 'utf-8');
      const entry = JSON.parse(content);

      expect(entry.success).toBe(true);
      expect(entry.message).toBe('Test success');
      expect(entry.timestamp).toBeDefined();
    });

    it('should log failed authentication', () => {
      authLogger.logAuthAttempt(false, 'Test failure');

      const logFiles = authLogger.getLogFiles();
      expect(logFiles.length).toBe(1);

      const content = fs.readFileSync(logFiles[0], 'utf-8');
      const entry = JSON.parse(content);

      expect(entry.success).toBe(false);
      expect(entry.message).toBe('Test failure');
    });

    it('should include IP address when provided', () => {
      authLogger.logAuthAttempt(true, 'Test', '192.168.1.1');

      const logs = authLogger.readAllLogs();
      expect(logs[0].ipAddress).toBe('192.168.1.1');
    });

    it('should append multiple log entries to same file', () => {
      authLogger.logAuthAttempt(true, 'Entry 1');
      authLogger.logAuthAttempt(false, 'Entry 2');
      authLogger.logAuthAttempt(true, 'Entry 3');

      const logs = authLogger.readAllLogs();
      expect(logs.length).toBe(3);
      expect(logs[0].message).toBe('Entry 1');
      expect(logs[1].message).toBe('Entry 2');
      expect(logs[2].message).toBe('Entry 3');
    });

    it('should create log file with correct permissions (600)', () => {
      authLogger.logAuthAttempt(true, 'Test');

      const logFiles = authLogger.getLogFiles();
      const stats = fs.statSync(logFiles[0]);
      const mode = stats.mode & parseInt('777', 8);
      expect(mode).toBe(parseInt('600', 8));
    });
  });

  describe('logSuccess()', () => {
    beforeEach(() => {
      authLogger.initialize();
    });

    it('should log success with default message', () => {
      authLogger.logSuccess();

      const logs = authLogger.readAllLogs();
      expect(logs[0].success).toBe(true);
      expect(logs[0].message).toBe('Authentication successful');
    });

    it('should log success with custom message', () => {
      authLogger.logSuccess('Custom success message');

      const logs = authLogger.readAllLogs();
      expect(logs[0].success).toBe(true);
      expect(logs[0].message).toBe('Custom success message');
    });
  });

  describe('logFailure()', () => {
    beforeEach(() => {
      authLogger.initialize();
    });

    it('should log failure with default message', () => {
      authLogger.logFailure();

      const logs = authLogger.readAllLogs();
      expect(logs[0].success).toBe(false);
      expect(logs[0].message).toBe('Authentication failed');
    });

    it('should log failure with custom message', () => {
      authLogger.logFailure('Invalid pincode');

      const logs = authLogger.readAllLogs();
      expect(logs[0].success).toBe(false);
      expect(logs[0].message).toBe('Invalid pincode');
    });
  });

  describe('getLogFiles()', () => {
    beforeEach(() => {
      authLogger.initialize();
    });

    it('should return empty array when no log files exist', () => {
      const logFiles = authLogger.getLogFiles();
      expect(logFiles).toEqual([]);
    });

    it('should return log files after logging', () => {
      authLogger.logSuccess();
      const logFiles = authLogger.getLogFiles();
      expect(logFiles.length).toBe(1);
      expect(logFiles[0]).toContain('auth-');
      expect(logFiles[0]).toContain('.log');
    });

    it('should only return auth log files', () => {
      authLogger.logSuccess();

      // Create a non-auth log file
      fs.writeFileSync(path.join(testLogsDir, 'other.log'), 'test');

      const logFiles = authLogger.getLogFiles();
      expect(logFiles.length).toBe(1);
      expect(logFiles[0]).toContain('auth-');
    });
  });

  describe('cleanupOldLogs()', () => {
    beforeEach(() => {
      authLogger.initialize();
    });

    it('should not delete recent logs', () => {
      authLogger.logSuccess();
      const deletedCount = authLogger.cleanupOldLogs(90);

      expect(deletedCount).toBe(0);
      expect(authLogger.getLogFiles().length).toBe(1);
    });

    it('should delete logs older than retention period', () => {
      // Create old log file manually
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100); // 100 days ago
      const oldDateStr = oldDate.toISOString().split('T')[0];
      const oldLogFile = path.join(testLogsDir, `auth-${oldDateStr}.log`);
      fs.writeFileSync(oldLogFile, JSON.stringify({ test: true }) + '\n');

      // Create recent log
      authLogger.logSuccess();

      expect(authLogger.getLogFiles().length).toBe(2);

      const deletedCount = authLogger.cleanupOldLogs(90);

      expect(deletedCount).toBe(1);
      expect(authLogger.getLogFiles().length).toBe(1);
    });

    it('should delete multiple old logs', () => {
      // Create multiple old log files
      for (let i = 91; i <= 95; i++) {
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - i);
        const oldDateStr = oldDate.toISOString().split('T')[0];
        const oldLogFile = path.join(testLogsDir, `auth-${oldDateStr}.log`);
        fs.writeFileSync(oldLogFile, JSON.stringify({ test: true }) + '\n');
      }

      expect(authLogger.getLogFiles().length).toBe(5);

      const deletedCount = authLogger.cleanupOldLogs(90);

      expect(deletedCount).toBe(5);
      expect(authLogger.getLogFiles().length).toBe(0);
    });

    it('should use custom retention period', () => {
      // Create log 40 days old
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 40);
      const oldDateStr = oldDate.toISOString().split('T')[0];
      const oldLogFile = path.join(testLogsDir, `auth-${oldDateStr}.log`);
      fs.writeFileSync(oldLogFile, JSON.stringify({ test: true }) + '\n');

      // Should not be deleted with 90-day retention
      expect(authLogger.cleanupOldLogs(90)).toBe(0);

      // Should be deleted with 30-day retention
      expect(authLogger.cleanupOldLogs(30)).toBe(1);
    });
  });

  describe('readLogsByDate()', () => {
    beforeEach(() => {
      authLogger.initialize();
    });

    it('should return empty array for date with no logs', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const logs = authLogger.readLogsByDate(yesterday);
      expect(logs).toEqual([]);
    });

    it('should read logs for specific date', () => {
      authLogger.logSuccess('Test 1');
      authLogger.logFailure('Test 2');

      const today = new Date();
      const logs = authLogger.readLogsByDate(today);

      expect(logs.length).toBe(2);
      expect(logs[0].message).toBe('Test 1');
      expect(logs[1].message).toBe('Test 2');
    });
  });

  describe('readAllLogs()', () => {
    beforeEach(() => {
      authLogger.initialize();
    });

    it('should return empty array when no logs exist', () => {
      const logs = authLogger.readAllLogs();
      expect(logs).toEqual([]);
    });

    it('should read all logs from current day', () => {
      authLogger.logSuccess('Entry 1');
      authLogger.logSuccess('Entry 2');
      authLogger.logFailure('Entry 3');

      const logs = authLogger.readAllLogs();
      expect(logs.length).toBe(3);
    });

    it('should read logs from multiple days', () => {
      // Create log for today
      authLogger.logSuccess('Today');

      // Create log for yesterday (manually)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const yesterdayLogFile = path.join(testLogsDir, `auth-${yesterdayStr}.log`);
      fs.writeFileSync(
        yesterdayLogFile,
        JSON.stringify({
          timestamp: yesterday.toISOString(),
          success: false,
          message: 'Yesterday',
        }) + '\n'
      );

      const logs = authLogger.readAllLogs();
      expect(logs.length).toBe(2);
    });
  });

  describe('getLogStats()', () => {
    beforeEach(() => {
      authLogger.initialize();
    });

    it('should return zero stats when no logs exist', () => {
      const stats = authLogger.getLogStats();
      expect(stats.totalAttempts).toBe(0);
      expect(stats.successfulAttempts).toBe(0);
      expect(stats.failedAttempts).toBe(0);
      expect(stats.successRate).toBe(0);
    });

    it('should calculate stats correctly', () => {
      authLogger.logSuccess();
      authLogger.logSuccess();
      authLogger.logSuccess();
      authLogger.logFailure();
      authLogger.logFailure();

      const stats = authLogger.getLogStats();
      expect(stats.totalAttempts).toBe(5);
      expect(stats.successfulAttempts).toBe(3);
      expect(stats.failedAttempts).toBe(2);
      expect(stats.successRate).toBe(60);
    });

    it('should calculate 100% success rate', () => {
      authLogger.logSuccess();
      authLogger.logSuccess();

      const stats = authLogger.getLogStats();
      expect(stats.successRate).toBe(100);
    });

    it('should calculate 0% success rate', () => {
      authLogger.logFailure();
      authLogger.logFailure();

      const stats = authLogger.getLogStats();
      expect(stats.successRate).toBe(0);
    });

    it('should filter by date range', () => {
      // Create old log (40 days ago)
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 40);
      const oldDateStr = oldDate.toISOString().split('T')[0];
      const oldLogFile = path.join(testLogsDir, `auth-${oldDateStr}.log`);
      fs.writeFileSync(
        oldLogFile,
        JSON.stringify({
          timestamp: oldDate.toISOString(),
          success: true,
          message: 'Old entry',
        }) + '\n'
      );

      // Create recent log
      authLogger.logSuccess('Recent entry');

      // Stats for last 30 days should not include old log
      const stats30 = authLogger.getLogStats(30);
      expect(stats30.totalAttempts).toBe(1);

      // Stats for last 60 days should include old log
      const stats60 = authLogger.getLogStats(60);
      expect(stats60.totalAttempts).toBe(2);
    });
  });
});
