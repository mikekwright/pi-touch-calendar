/**
 * Authentication IPC Handlers
 * Handles authentication-related IPC calls from renderer process
 */

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import { pincodeAuthService } from '../../services/auth/PincodeAuthService';
import { authLogger } from '../../services/logging/AuthLogger';

interface PincodeCredentials {
  pincode: string;
  confirmation?: string; // Only for first-time setup
}

interface AuthResponse {
  success: boolean;
  message?: string;
  isFirstTimeSetup?: boolean;
}

/**
 * Register all authentication IPC handlers
 * @param windowManager WindowManager instance to handle window transitions
 */
export function registerAuthHandlers(windowManager: any): void {
  // Initialize services
  pincodeAuthService.initialize();
  authLogger.initialize();

  // Check if first-time setup is needed
  ipcMain.handle(IPC_CHANNELS.AUTH_CHECK_SESSION, async (): Promise<{ isFirstTimeSetup: boolean }> => {
    return { isFirstTimeSetup: pincodeAuthService.isFirstTimeSetup() };
  });

  // Handle pincode authentication or creation
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGIN, async (_event: IpcMainInvokeEvent, credentials: PincodeCredentials): Promise<AuthResponse> => {
    const { pincode, confirmation } = credentials;

    try {
      // Check if this is first-time setup
      if (pincodeAuthService.isFirstTimeSetup()) {
        // First-time setup: create pincode
        if (!confirmation) {
          return {
            success: false,
            message: 'Confirmation pincode required for setup',
            isFirstTimeSetup: true,
          };
        }

        const result = pincodeAuthService.createPincode(pincode, confirmation);

        if (result.success) {
          authLogger.logSuccess('Pincode created - first-time setup complete');

          // Show main app after successful setup
          setTimeout(() => {
            windowManager.showMainApp();
          }, 500);
        } else {
          authLogger.logFailure(`Pincode creation failed: ${result.message}`);
        }

        return result;
      } else {
        // Normal authentication
        const result = pincodeAuthService.authenticate(pincode);

        if (result.success) {
          authLogger.logSuccess('Pincode authentication successful');

          // Show main app on successful login
          setTimeout(() => {
            windowManager.showMainApp();
          }, 500);
        } else {
          authLogger.logFailure(`Pincode authentication failed: ${result.message}`);
        }

        return result;
      }
    } catch (error) {
      const errorMessage = `Authentication error: ${error.message}`;
      authLogger.logFailure(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  });

  // Handle logout
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGOUT, async (): Promise<{ success: boolean }> => {
    authLogger.logSuccess('User logged out');
    windowManager.showLogin();
    return { success: true };
  });

  // Clean up old logs periodically (run on startup)
  const cleanupOldLogs = () => {
    const deletedCount = authLogger.cleanupOldLogs(90);
    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old authentication log files`);
    }
  };

  // Run cleanup on startup
  cleanupOldLogs();

  // Schedule daily cleanup at 2:00 AM
  const scheduleCleanup = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0);

    const timeUntilCleanup = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      cleanupOldLogs();
      // Reschedule for next day
      scheduleCleanup();
    }, timeUntilCleanup);
  };

  scheduleCleanup();
}
