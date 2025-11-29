/**
 * Authentication IPC Handlers
 * Handles authentication-related IPC calls from renderer process
 */

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    username: string;
  };
  error?: string;
}

/**
 * Register all authentication IPC handlers
 * @param windowManager WindowManager instance to handle window transitions
 */
export function registerAuthHandlers(windowManager: any): void {
  // Handle login
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGIN, async (_event: IpcMainInvokeEvent, credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simple authentication logic - you can replace this with your actual authentication
    const { username, password } = credentials;

    // For demo purposes, accept any non-empty credentials
    // In a real app, you'd validate against a database or API
    if (username && password) {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo: accept "admin"/"password" or any username with password length > 3
      if ((username === 'admin' && password === 'password') || password.length > 3) {
        // Show main app on successful login
        setTimeout(() => {
          windowManager.showMainApp();
        }, 500); // Small delay for better UX

        return { success: true, user: { username } };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    }

    return { success: false, error: 'Username and password are required' };
  });

  // Handle logout
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGOUT, async (): Promise<{ success: boolean }> => {
    windowManager.showLogin();
    return { success: true };
  });
}
