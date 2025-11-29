import { LoginWindow } from './LoginWindow';
import { MainWindow } from './MainWindow';

export class WindowManager {
  private loginWindow: LoginWindow | null = null;
  private mainWindow: MainWindow | null = null;
  private isShowingLogin: boolean = true;

  constructor() {
    this.showLogin();
  }

  public showLogin(): void {
    this.isShowingLogin = true;

    // Close main window if it exists
    if (this.mainWindow) {
      this.mainWindow.close();
      this.mainWindow = null;
    }

    // Create or show login window
    if (!this.loginWindow) {
      this.loginWindow = new LoginWindow();
    } else {
      this.loginWindow.show();
    }
  }

  public showMainApp(): void {
    this.isShowingLogin = false;

    // In test mode, don't close the login window to allow Playwright to continue testing
    // Just hide it instead
    if (process.env.NODE_ENV === 'test') {
      if (this.loginWindow) {
        this.loginWindow.hide();
      }
    } else {
      // Close login window if it exists (production mode)
      if (this.loginWindow) {
        this.loginWindow.close();
        this.loginWindow = null;
      }
    }

    // Create or show main window
    if (!this.mainWindow) {
      this.mainWindow = new MainWindow();
      this.mainWindow.load();
    }

    this.mainWindow.show();
  }

  public isLoginVisible(): boolean {
    return this.isShowingLogin;
  }

  public close(): void {
    if (this.loginWindow) {
      this.loginWindow.close();
      this.loginWindow = null;
    }
    if (this.mainWindow) {
      this.mainWindow.close();
      this.mainWindow = null;
    }
  }
}
