/**
 * Integration test for login flow
 * Tests the complete login user journey using Playwright
 */

import { test, expect } from './fixtures';

test.describe('Login Flow', () => {
  test('should display login window on app start', async ({ page }) => {
    // Wait for the login window to be visible
    await page.waitForSelector('text=Pi Touch Calendar');

    // Check that login form elements are present
    const usernameInput = await page.locator('input[name="username"]');
    const passwordInput = await page.locator('input[name="password"]');
    const loginButton = await page.locator('button[type="submit"]');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[name="username"]', 'invalid');
    await page.fill('input[name="password"]', 'bad');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForSelector('.error-message', { state: 'visible' });

    const errorMessage = await page.locator('.error-message');
    await expect(errorMessage).toContainText('Invalid credentials');
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Fill in valid credentials (based on current demo auth)
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for main app to load (login window should be replaced)
    // This will need to be updated based on actual main app content
    await page.waitForTimeout(2000); // Allow time for transition

    // Verify we're no longer on login page
    const loginForm = await page.locator('#loginForm');
    await expect(loginForm).not.toBeVisible();
  });

  test('should handle Enter key press for login', async ({ page }) => {
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password');

    // Press Enter
    await page.press('input[name="password"]', 'Enter');

    // Wait for navigation
    await page.waitForTimeout(2000);

    // Verify login succeeded
    const loginForm = await page.locator('#loginForm');
    await expect(loginForm).not.toBeVisible();
  });
});
