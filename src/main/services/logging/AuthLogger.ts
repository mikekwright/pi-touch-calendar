/**
 * AuthLogger
 *
 * Handles authentication logging with daily rotation and 90-day retention
 */

import * as fs from 'fs';
import * as path from 'path';
import { configManager, ConfigManager } from '../../config/ConfigManager';

export interface AuthLogEntry {
  timestamp: string;
  success: boolean;
  message?: string;
  ipAddress?: string;
}

export class AuthLogger {
  private configManager: ConfigManager;
  private logsDir: string;

  constructor(configManagerInstance: ConfigManager = configManager) {
    this.configManager = configManagerInstance;
    this.logsDir = this.configManager.getLogsDir();
  }

  /**
   * Initialize the logger (ensure logs directory exists)
   */
  public initialize(): void {
    this.configManager.initialize();
  }

  /**
   * Get current log file path (based on today's date)
   */
  private getCurrentLogFile(): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logsDir, `auth-${today}.log`);
  }

  /**
   * Format log entry as JSON line
   */
  private formatLogEntry(entry: AuthLogEntry): string {
    return JSON.stringify(entry) + '\n';
  }

  /**
   * Log an authentication attempt
   */
  public logAuthAttempt(success: boolean, message?: string, ipAddress?: string): void {
    const entry: AuthLogEntry = {
      timestamp: new Date().toISOString(),
      success,
      message,
      ipAddress,
    };

    const logFile = this.getCurrentLogFile();
    const logLine = this.formatLogEntry(entry);

    try {
      // Append to log file (create if doesn't exist)
      fs.appendFileSync(logFile, logLine, { mode: 0o600 });
    } catch (error) {
      console.error(`Failed to write auth log: ${error.message}`);
    }
  }

  /**
   * Log successful authentication
   */
  public logSuccess(message?: string): void {
    this.logAuthAttempt(true, message || 'Authentication successful');
  }

  /**
   * Log failed authentication
   */
  public logFailure(message?: string): void {
    this.logAuthAttempt(false, message || 'Authentication failed');
  }

  /**
   * Get all log files in the logs directory
   */
  public getLogFiles(): string[] {
    if (!fs.existsSync(this.logsDir)) {
      return [];
    }

    return fs.readdirSync(this.logsDir)
      .filter(file => file.startsWith('auth-') && file.endsWith('.log'))
      .map(file => path.join(this.logsDir, file));
  }

  /**
   * Parse log file date from filename (auth-YYYY-MM-DD.log)
   */
  private parseLogFileDate(filePath: string): Date | null {
    const fileName = path.basename(filePath);
    const match = fileName.match(/auth-(\d{4}-\d{2}-\d{2})\.log/);

    if (!match) {
      return null;
    }

    const date = new Date(match[1]);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Clean up logs older than specified days
   */
  public cleanupOldLogs(retentionDays: number = 90): number {
    const logFiles = this.getLogFiles();
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000);

    let deletedCount = 0;

    for (const logFile of logFiles) {
      const fileDate = this.parseLogFileDate(logFile);

      if (fileDate && fileDate < cutoffDate) {
        try {
          fs.unlinkSync(logFile);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete old log file ${logFile}: ${error.message}`);
        }
      }
    }

    return deletedCount;
  }

  /**
   * Read log entries from a specific date
   */
  public readLogsByDate(date: Date): AuthLogEntry[] {
    const dateStr = date.toISOString().split('T')[0];
    const logFile = path.join(this.logsDir, `auth-${dateStr}.log`);

    if (!fs.existsSync(logFile)) {
      return [];
    }

    try {
      const content = fs.readFileSync(logFile, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line.length > 0);

      return lines.map(line => {
        try {
          return JSON.parse(line);
        } catch (error) {
          console.error(`Failed to parse log line: ${line}`);
          return null;
        }
      }).filter(entry => entry !== null) as AuthLogEntry[];
    } catch (error) {
      console.error(`Failed to read log file ${logFile}: ${error.message}`);
      return [];
    }
  }

  /**
   * Read all log entries
   */
  public readAllLogs(): AuthLogEntry[] {
    const logFiles = this.getLogFiles();
    const allEntries: AuthLogEntry[] = [];

    for (const logFile of logFiles) {
      const fileDate = this.parseLogFileDate(logFile);
      if (fileDate) {
        const entries = this.readLogsByDate(fileDate);
        allEntries.push(...entries);
      }
    }

    return allEntries;
  }

  /**
   * Get log statistics
   */
  public getLogStats(days: number = 30): {
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    successRate: number;
  } {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const allLogs = this.readAllLogs();
    const recentLogs = allLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= cutoffDate;
    });

    const totalAttempts = recentLogs.length;
    const successfulAttempts = recentLogs.filter(log => log.success).length;
    const failedAttempts = totalAttempts - successfulAttempts;
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;

    return {
      totalAttempts,
      successfulAttempts,
      failedAttempts,
      successRate,
    };
  }
}

// Export a singleton instance
export const authLogger = new AuthLogger();
