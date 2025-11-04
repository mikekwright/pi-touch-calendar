// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  login: (credentials: { username: string; password: string }) =>
    ipcRenderer.invoke('login', credentials),

  logout: () =>
    ipcRenderer.invoke('logout'),

  onLoginSuccess: (callback: (user: any) => void) =>
    ipcRenderer.on('login-success', (_event, user) => callback(user)),

  removeAllListeners: (channel: string) =>
    ipcRenderer.removeAllListeners(channel)
});

// Type declaration for the exposed API
declare global {
  interface Window {
    electronAPI: {
      login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; user?: any; error?: string }>;
      logout: () => Promise<{ success: boolean }>;
      onLoginSuccess: (callback: (user: any) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
