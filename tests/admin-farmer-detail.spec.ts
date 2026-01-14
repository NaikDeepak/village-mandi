import { expect, test } from '@playwright/test';

test.describe('Admin Farmer Details', () => {
  test('should view farmer details and their products', async ({ page }) => {
    // 1. Create a farmer
    await page.goto('/admin/farmers/new');
    const farmerName = `Detail Farmer ${Date.now()}`;
    await page.fill('input[name="name"]', farmerName);
    await page.fill('input[name="location"]', 'Detail Location');
    await page.selectOption('select[id="relationshipLevel"]', 'FAMILY');
    await page.fill('textarea[id="description"]', 'Detailed Description');
    await page.click('button[type="submit"]');

    // 2. Add a product for this farmer (so we can check product list in detail view)
    // We need to go to products page or use the API, let's use UI flow
    await page.goto('/admin/products/new');
    await page.selectOption('select[id="farmerId"]', { label: farmerName });
    const productName = `Detail Product ${Date.now()}`;
    await page.fill('input[name="name"]', productName);
    await page.selectOption('select[id="unit"]', 'KG');
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[id="seasonStart"]', today);
    await page.fill('input[id="seasonEnd"]', today);
    await page.click('button[type="submit"]');

    // 3. Go to Farmers list
    await page.goto('/admin/farmers');

    // 4. Click on farmer name to go to details
    // The name is a link in the list
    await page.getByRole('link', { name: farmerName }).click();

    // 5. Verify Detail Page
    await expect(page).toHaveURL(/\/admin\/farmers\/.+/); // matches UUID
    await expect(page.getByRole('heading', { name: farmerName })).toBeVisible();
    await expect(page.getByText('Detail Location')).toBeVisible();
    await expect(page.getByText('Detailed Description')).toBeVisible();
    await expect(page.getByText('FAMILY')).toBeVisible();

    // 6. Verify Product List on Detail Page
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();
    await expect(page.getByText('KG')).toBeVisible();

    // 7. Verify Back Link
    await page.click('text=Back to Farmers');
    await expect(page).toHaveURL('/admin/farmers');
  });
});
