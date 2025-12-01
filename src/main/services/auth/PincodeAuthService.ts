/**
 * PincodeAuthService
 *
 * Handles pincode authentication logic
 */

import { configManager, ConfigManager } from '../../config/ConfigManager';

export interface AuthResult {
  success: boolean;
  message?: string;
  isFirstTimeSetup?: boolean;
}

export class PincodeAuthService {
  private configManager: ConfigManager;

  constructor(configManagerInstance: ConfigManager = configManager) {
    this.configManager = configManagerInstance;
  }

  /**
   * Initialize the authentication service
   * Creates config directory if needed
   */
  public initialize(): void {
    this.configManager.initialize();
  }

  /**
   * Check if this is the first-time setup (no pincode exists)
   */
  public isFirstTimeSetup(): boolean {
    return !this.configManager.credentialsFileExists();
  }

  /**
   * Create a new pincode (first-time setup)
   */
  public createPincode(pincode: string, confirmation: string): AuthResult {
    // Validate both pincodes
    if (!this.configManager.validatePincode(pincode)) {
      return {
        success: false,
        message: 'Invalid pincode format. Must be 4-8 digits.',
      };
    }

    if (!this.configManager.validatePincode(confirmation)) {
      return {
        success: false,
        message: 'Invalid confirmation pincode format. Must be 4-8 digits.',
      };
    }

    // Check if pincodes match
    if (pincode !== confirmation) {
      return {
        success: false,
        message: 'Pincodes do not match.',
      };
    }

    // Check if pincode already exists
    if (!this.isFirstTimeSetup()) {
      return {
        success: false,
        message: 'Pincode already exists. Use authentication instead.',
      };
    }

    try {
      this.configManager.savePincode(pincode);
      return {
        success: true,
        message: 'Pincode created successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create pincode: ${error.message}`,
      };
    }
  }

  /**
   * Authenticate with pincode
   */
  public authenticate(pincode: string): AuthResult {
    // Check if first-time setup is needed
    if (this.isFirstTimeSetup()) {
      return {
        success: false,
        message: 'No pincode configured. Please complete first-time setup.',
        isFirstTimeSetup: true,
      };
    }

    // Validate pincode format
    if (!this.configManager.validatePincode(pincode)) {
      return {
        success: false,
        message: 'Invalid pincode format.',
      };
    }

    // Verify pincode
    const isValid = this.configManager.verifyPincode(pincode);

    if (isValid) {
      return {
        success: true,
        message: 'Authentication successful.',
      };
    } else {
      return {
        success: false,
        message: 'Incorrect pincode.',
      };
    }
  }

  /**
   * Change existing pincode
   */
  public changePincode(
    currentPincode: string,
    newPincode: string,
    confirmation: string
  ): AuthResult {
    // First authenticate with current pincode
    const authResult = this.authenticate(currentPincode);
    if (!authResult.success) {
      return {
        success: false,
        message: 'Current pincode is incorrect.',
      };
    }

    // Validate new pincode
    if (!this.configManager.validatePincode(newPincode)) {
      return {
        success: false,
        message: 'Invalid new pincode format. Must be 4-8 digits.',
      };
    }

    if (!this.configManager.validatePincode(confirmation)) {
      return {
        success: false,
        message: 'Invalid confirmation pincode format. Must be 4-8 digits.',
      };
    }

    // Check if new pincodes match
    if (newPincode !== confirmation) {
      return {
        success: false,
        message: 'New pincodes do not match.',
      };
    }

    // Save new pincode
    try {
      this.configManager.savePincode(newPincode);
      return {
        success: true,
        message: 'Pincode changed successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to change pincode: ${error.message}`,
      };
    }
  }

  /**
   * Reset pincode (for testing or recovery)
   * WARNING: This deletes the credentials file
   */
  public resetPincode(): void {
    this.configManager.deleteCredentials();
  }
}

// Export a singleton instance
export const pincodeAuthService = new PincodeAuthService();
