import { BrowserWindow } from 'electron';
import path from 'node:path';
import { SCREEN_CONFIG, WINDOW_DEFAULTS, DEV_SHORTCUTS, TOUCH_CONFIG } from '../common';

export class LoginWindow {
  private window: BrowserWindow | null = null;

  constructor() {
    this.createLoginWindow();
  }

  private createLoginWindow(): void {
    this.window = new BrowserWindow({
      width: SCREEN_CONFIG.WIDTH,
      height: SCREEN_CONFIG.HEIGHT,
      fullscreen: WINDOW_DEFAULTS.fullscreen,
      resizable: WINDOW_DEFAULTS.resizable,
      frame: WINDOW_DEFAULTS.frame, // Remove window frame for fullscreen experience
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      title: 'Pi Touch Calendar - Login'
    });

    // Load the login HTML content
    this.window.loadURL(`data:text/html,${this.getLoginHTML()}`);

    // Show window when ready
    this.window.once('ready-to-show', () => {
      this.window?.setFullScreen(WINDOW_DEFAULTS.fullscreen);
      this.window?.setAlwaysOnTop(WINDOW_DEFAULTS.alwaysOnTop);
      this.window?.setVisibleOnAllWorkspaces(WINDOW_DEFAULTS.visibleOnAllWorkspaces);
      this.window?.show();
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

  private getLoginHTML(): string {
    return encodeURIComponent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Login</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              color: #333;
            }
            .login-container {
              background: white;
              padding: 3rem;
              border-radius: 20px;
              box-shadow: 0 20px 50px rgba(0,0,0,0.3);
              width: 500px;
              max-width: 90vw;
              text-align: center;
              transform: scale(${TOUCH_CONFIG.SCALE_FACTOR}); /* Scale up for better touch interaction on large screen */
            }
            .login-title {
              margin-bottom: 2rem;
              color: #333;
              font-size: 2rem;
              font-weight: 300;
            }
            .form-group {
              margin-bottom: 1rem;
              text-align: left;
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
              color: #555;
            }
            input[type="text"],
            input[type="password"] {
              width: 100%;
              padding: 1rem;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.2rem;
              box-sizing: border-box;
              transition: border-color 0.3s ease;
              min-height: ${TOUCH_CONFIG.MIN_TOUCH_TARGET_HEIGHT}px; /* Better touch target */
            }
            input[type="text"]:focus,
            input[type="password"]:focus {
              outline: none;
              border-color: #667eea;
              box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }
            .login-button {
              width: 100%;
              padding: 1.2rem;
              background: #667eea;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 1.2rem;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.3s ease;
              margin-top: 1.5rem;
              min-height: ${TOUCH_CONFIG.MIN_BUTTON_HEIGHT}px; /* Better touch target */
            }
            .login-button:hover {
              background: #5a67d8;
            }
            .login-button:disabled {
              background: #ccc;
              cursor: not-allowed;
            }
            .error-message {
              color: #e53e3e;
              font-size: 0.875rem;
              margin-top: 0.5rem;
              display: none;
            }
            .app-logo {
              margin-bottom: 1.5rem;
              font-size: 3rem;
            }
          </style>
        </head>
        <body>
          <div class="login-container">
            <div class="app-logo">📅</div>
            <h2 class="login-title">Pi Touch Calendar</h2>
            <form id="loginForm">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autocomplete="username">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
              </div>
              <button type="submit" class="login-button" id="loginButton">Sign In</button>
              <div class="error-message" id="errorMessage"></div>
            </form>
          </div>

          <script>
            const form = document.getElementById('loginForm');
            const loginButton = document.getElementById('loginButton');
            const errorMessage = document.getElementById('errorMessage');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            form.addEventListener('submit', async (e) => {
              e.preventDefault();

              const username = usernameInput.value.trim();
              const password = passwordInput.value;

              if (!username || !password) {
                showError('Please enter both username and password');
                return;
              }

              loginButton.disabled = true;
              loginButton.textContent = 'Signing in...';
              errorMessage.style.display = 'none';

              try {
                // Send login data to main process
                const result = await window.electronAPI.login({ username, password });

                if (result.success) {
                  // Login successful, main process will handle navigation
                  console.log('Login successful');
                } else {
                  showError(result.error || 'Invalid credentials');
                }
              } catch (error) {
                showError('An error occurred during login');
              } finally {
                loginButton.disabled = false;
                loginButton.textContent = 'Sign In';
              }
            });

            function showError(message) {
              errorMessage.textContent = message;
              errorMessage.style.display = 'block';
            }

            // Focus on username field when loaded
            window.addEventListener('load', () => {
              usernameInput.focus();
            });

            // Enter key handling
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && !loginButton.disabled) {
                form.dispatchEvent(new Event('submit'));
              }
            });
          </script>
        </body>
      </html>
    `);
  }



  public getWindow(): BrowserWindow | null {
    return this.window;
  }

  public close(): void {
    if (this.window) {
      this.window.close();
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
}