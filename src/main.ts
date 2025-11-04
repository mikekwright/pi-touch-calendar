import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { WindowManager } from './window-manager';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let windowManager: WindowManager | null = null;

const createWindow = () => {
  windowManager = new WindowManager();
  return windowManager;
};

const showMainApp = () => {
  if (!windowManager) {
    createWindow();
  }

  windowManager?.showMainApp();
};

// Handle login success
ipcMain.handle('login', async (event, credentials: { username: string; password: string }) => {
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
        showMainApp();
      }, 500); // Small delay for better UX

      return { success: true, user: { username } };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  }

  return { success: false, error: 'Username and password are required' };
});

// Handle logout
ipcMain.handle('logout', async () => {
  if (windowManager) {
    windowManager.showLogin();
    return { success: true };
  }
  return { success: false };
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    if (!windowManager) {
      createWindow();
    }
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
