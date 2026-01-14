import { expect, test } from '@playwright/test';

test.describe('Admin Dashboard and General', () => {
  test('should display dashboard stats', async ({ page }) => {
    await page.goto('/admin');

    // Check header
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Welcome to the Virtual Mandi admin panel')).toBeVisible();

    // Check stats cards
    await expect(page.getByRole('heading', { name: 'Batches' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Farmers' })).toBeVisible();

    // Check values (just visibility of any number in the cards)
    // We can't know exact numbers, but we know the structure
    await expect(page.getByText('Total batches')).toBeVisible();
    await expect(page.getByText('Active orders')).toBeVisible();
    await expect(page.getByText('Registered farmers')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/admin');

    // Find logout button in navigation/header
    // Based on previous exploration, it's a button with text "Logout"
    const logoutBtn = page.getByRole('button', { name: 'Logout' });
    await expect(logoutBtn).toBeVisible();

    await logoutBtn.click();

    // Verify redirect to login page
    await expect(page).toHaveURL(/\/login/);

    // Verify we can't go back to admin without logging in
    await page.goto('/admin');
    // Should be redirected back to login or shown an error
    // Assuming protected route logic redirects to login
    await expect(page).toHaveURL(/\/login/);
  });
});
