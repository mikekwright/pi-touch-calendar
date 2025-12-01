// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/ipc';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  checkSession: () =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTH_CHECK_SESSION),

  login: (credentials: { pincode: string; confirmation?: string }) =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTH_LOGIN, credentials),

  logout: () =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTH_LOGOUT),
});

// Type declaration for the exposed API
declare global {
  interface Window {
    electronAPI: {
      checkSession: () => Promise<{ isFirstTimeSetup: boolean }>;
      login: (credentials: { pincode: string; confirmation?: string }) => Promise<{
        success: boolean;
        message?: string;
        isFirstTimeSetup?: boolean;
      }>;
      logout: () => Promise<{ success: boolean }>;
    };
  }
}
