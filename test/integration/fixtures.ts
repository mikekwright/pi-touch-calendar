/**
 * Playwright fixtures for Electron testing
 * This file provides utilities to launch and interact with the Electron app
 */

import { test as base, _electron as electron, ElectronApplication, Page } from '@playwright/test';
import path from 'path';

type ElectronFixtures = {
  electronApp: ElectronApplication;
  page: Page;
};

/**
 * Extended test with Electron fixtures
 */
export const test = base.extend<ElectronFixtures>({
  /**
   * Launch Electron app before each test
   */
  electronApp: async ({}, use) => {
    // Launch Electron with the app
    const electronApp = await electron.launch({
      args: [path.join(__dirname, '../../.vite/build/index.js')],
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    });

    // Wait for the app to be ready
    await electronApp.firstWindow();

    // Use the app in tests
    await use(electronApp);

    // Clean up: close the app
    await electronApp.close();
  },

  /**
   * Get the first window page
   */
  page: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await use(page);
  },
});

export { expect } from '@playwright/test';
