import { expect, test as setup } from '@playwright/test';

const adminFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  // Perform authentication steps.
  await page.goto('/login');

  // Fill in the login form
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
  }

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard or check for successful login element
  // Based on your code, dashboard is at /admin
  await page.waitForURL('/admin');
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: adminFile });
});
