/**
 * Common constants and configurations for the Pi Touch Calendar application
 */

// Screen dimensions for the touch display
export const SCREEN_CONFIG = {
  WIDTH: 1920,
  HEIGHT: 1200,
} as const;

// Window configuration defaults
export const WINDOW_DEFAULTS = {
  fullscreen: true,
  resizable: false,
  frame: false,
  alwaysOnTop: true,
  visibleOnAllWorkspaces: true,
} as const;

// Touch interface settings
export const TOUCH_CONFIG = {
  MIN_TOUCH_TARGET_HEIGHT: 50,
  MIN_BUTTON_HEIGHT: 60,
  SCALE_FACTOR: 1.2,
} as const;

// Development keyboard shortcuts
export const DEV_SHORTCUTS = {
  TOGGLE_FULLSCREEN: 'F11',
  EXIT_FULLSCREEN: 'Escape',
} as const;
