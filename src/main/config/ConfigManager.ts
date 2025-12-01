/**
 * ConfigManager
 *
 * Manages application configuration directory and files
 * Config directory: ~/.config/pi-touch-calendar/
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

export interface ConfigManagerOptions {
  configDir?: string;
}

export class ConfigManager {
  private readonly configDir: string;
  private readonly credentialsFile: string;
  private readonly logsDir: string;

  constructor(options: ConfigManagerOptions = {}) {
    // Default config directory: ~/.config/pi-touch-calendar/
    this.configDir = options.configDir || path.join(
      os.homedir(),
      '.config',
      'pi-touch-calendar'
    );

    this.credentialsFile = path.join(this.configDir, 'credentials.json');
    this.logsDir = path.join(this.configDir, 'logs');
  }

  /**
   * Initialize the configuration directory and required subdirectories
   */
  public initialize(): void {
    try {
      // Create config directory if it doesn't exist
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true, mode: 0o700 });
      }

      // Ensure directory has correct permissions (user-only access)
      fs.chmodSync(this.configDir, 0o700);

      // Create logs directory
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true, mode: 0o700 });
      }
    } catch (error) {
      throw new Error(`Failed to initialize config directory: ${error.message}`);
    }
  }

  /**
   * Get the config directory path
   */
  public getConfigDir(): string {
    return this.configDir;
  }

  /**
   * Get the logs directory path
   */
  public getLogsDir(): string {
    return this.logsDir;
  }

  /**
   * Get the credentials file path
   */
  public getCredentialsFile(): string {
    return this.credentialsFile;
  }

  /**
   * Check if credentials file exists
   */
  public credentialsFileExists(): boolean {
    return fs.existsSync(this.credentialsFile);
  }

  /**
   * Validate pincode format (4-8 digits)
   */
  public validatePincode(pincode: string): boolean {
    if (!pincode || typeof pincode !== 'string') {
      return false;
    }

    // Must be 4-8 digits only
    const pincodeRegex = /^\d{4,8}$/;
    return pincodeRegex.test(pincode);
  }

  /**
   * Hash a pincode using SHA-256
   */
  public hashPincode(pincode: string): string {
    return crypto.createHash('sha256').update(pincode).digest('hex');
  }

  /**
   * Save hashed pincode to credentials file
   */
  public savePincode(pincode: string): void {
    if (!this.validatePincode(pincode)) {
      throw new Error('Invalid pincode format. Must be 4-8 digits.');
    }

    const hashedPincode = this.hashPincode(pincode);
    const credentials = {
      pincode: hashedPincode,
      createdAt: new Date().toISOString(),
    };

    try {
      fs.writeFileSync(
        this.credentialsFile,
        JSON.stringify(credentials, null, 2),
        { mode: 0o600 } // Read/write for user only
      );
    } catch (error) {
      throw new Error(`Failed to save credentials: ${error.message}`);
    }
  }

  /**
   * Load hashed pincode from credentials file
   */
  public loadPincode(): string | null {
    if (!this.credentialsFileExists()) {
      return null;
    }

    try {
      const data = fs.readFileSync(this.credentialsFile, 'utf-8');
      const credentials = JSON.parse(data);
      return credentials.pincode || null;
    } catch (error) {
      throw new Error(`Failed to load credentials: ${error.message}`);
    }
  }

  /**
   * Verify pincode against stored hash
   */
  public verifyPincode(pincode: string): boolean {
    const storedHash = this.loadPincode();
    if (!storedHash) {
      return false;
    }

    const inputHash = this.hashPincode(pincode);
    return inputHash === storedHash;
  }

  /**
   * Check file permissions (user-only access)
   */
  public verifyFilePermissions(filePath: string): boolean {
    try {
      const stats = fs.statSync(filePath);
      const mode = stats.mode & parseInt('777', 8);

      // Should be 600 (read/write for user only) or 700 (for directories)
      return mode === parseInt('600', 8) || mode === parseInt('700', 8);
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete credentials file (for testing or reset)
   */
  public deleteCredentials(): void {
    if (this.credentialsFileExists()) {
      fs.unlinkSync(this.credentialsFile);
    }
  }
}

// Export a singleton instance
export const configManager = new ConfigManager();
