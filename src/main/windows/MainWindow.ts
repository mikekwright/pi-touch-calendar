import { BrowserWindow } from 'electron';
import path from 'node:path';
import { SCREEN_CONFIG, WINDOW_DEFAULTS, DEV_SHORTCUTS, TOUCH_CONFIG } from '@shared/constants';

export class MainWindow {
  private window: BrowserWindow | null = null;

  constructor() {
    this.createWindow();
  }

  private createWindow(): void {
    // Preload is in the same directory as the main bundle (both in .vite/build)
    const preloadPath = path.resolve(__dirname, 'preload.js');

    this.window = new BrowserWindow({
      width: SCREEN_CONFIG.WIDTH,
      height: SCREEN_CONFIG.HEIGHT,
      fullscreen: WINDOW_DEFAULTS.fullscreen,
      resizable: WINDOW_DEFAULTS.resizable,
      frame: WINDOW_DEFAULTS.frame,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preloadPath,
      },
      title: 'Pi Touch Calendar',
    });

    // Add keyboard shortcuts for development
    this.window.webContents.on('before-input-event', (event, input) => {
      // Press F11 to toggle fullscreen during development
      if (input.key === DEV_SHORTCUTS.TOGGLE_FULLSCREEN && input.type === 'keyDown') {
        const isFullScreen = this.window?.isFullScreen();
        this.window?.setFullScreen(!isFullScreen);
      }
      // Press Escape to exit fullscreen during development
      if (input.key === DEV_SHORTCUTS.EXIT_FULLSCREEN && input.type === 'keyDown' && process.env.NODE_ENV === 'development') {
        this.window?.setFullScreen(false);
      }
    });

    // Handle window closed
    this.window.on('closed', () => {
      this.window = null;
    });
  }

  public load(): void {
    if (!this.window) return;

    // Load the main application
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this.window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      this.window.loadFile(
        path.join(__dirname, `../../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      );
    }

    // Open DevTools for main app in development
    if (process.env.NODE_ENV === 'development') {
      this.window.webContents.openDevTools();
    }
  }

  public show(): void {
    if (this.window) {
      this.window.setFullScreen(WINDOW_DEFAULTS.fullscreen);
      this.window.setAlwaysOnTop(WINDOW_DEFAULTS.alwaysOnTop);
      this.window.setVisibleOnAllWorkspaces(WINDOW_DEFAULTS.visibleOnAllWorkspaces);
      this.window.show();
      this.window.focus();
    }
  }

  public hide(): void {
    if (this.window) {
      this.window.hide();
    }
  }

  public close(): void {
    if (this.window) {
      this.window.close();
    }
  }

  public getWindow(): BrowserWindow | null {
    return this.window;
  }
}
