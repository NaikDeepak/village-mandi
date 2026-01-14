import { expect, test } from '@playwright/test';

// Reset storage state for this test file to ensure we are logged out
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Page', () => {
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@admin.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Assuming the app shows a red error message
    // Based on AdminLoginPage exploration earlier: <div className="text-red-600">
    await expect(page.locator('.text-red-600')).toBeVisible();
    await expect(page.locator('.text-red-600')).toContainText(/Email or password is incorrect/i);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
    }

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/admin');
  });
});
