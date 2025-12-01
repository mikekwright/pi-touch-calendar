import { MainWindow } from './MainWindow';

/**
 * WindowManager - Manages application windows
 *
 * With the new React-based architecture, we use a single window
 * that shows different views (login/main app) based on auth state.
 * The React App component handles the routing between views.
 */
export class WindowManager {
  private mainWindow: MainWindow | null = null;

  constructor() {
    // Create and show the main window
    // The React app will handle showing login or main app based on auth state
    this.mainWindow = new MainWindow();
    this.mainWindow.load();
    this.mainWindow.show();
  }

  /**
   * showLogin - Legacy method for backward compatibility
   * Now a no-op since React app handles login view
   */
  public showLogin(): void {
    // React app handles showing login screen
    // This method exists for backward compatibility with IPC handlers
  }

  /**
   * showMainApp - Legacy method for backward compatibility
   * Now a no-op since React app handles main app view
   */
  public showMainApp(): void {
    // React app handles showing main app screen
    // This method exists for backward compatibility with IPC handlers
  }

  /**
   * isLoginVisible - Legacy method for backward compatibility
   */
  public isLoginVisible(): boolean {
    // Always return false since React app manages view state
    return false;
  }

  public close(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
      this.mainWindow = null;
    }
  }

  public getMainWindow(): MainWindow | null {
    return this.mainWindow;
  }
}
