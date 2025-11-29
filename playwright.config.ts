import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright configuration for Electron app testing
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './test/integration',

  // Maximum time one test can run
  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL for navigation
    // baseURL: 'http://localhost:3000', // Not applicable for Electron

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers (not applicable for Electron, but kept for reference)
  // For Electron, we'll use a custom setup
  projects: [
    {
      name: 'electron',
      use: {
        // Electron-specific configuration will be in test fixtures
      },
    },
  ],

  // Output directory for test artifacts
  outputDir: 'test-results/',
});
