import { expect, test } from '@playwright/test';

test.describe('Admin Product Management', () => {
  let _farmerId: string;
  let farmerName: string;

  // Setup: Ensure we have a farmer to add products to
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/farmers');
    await page.getByRole('link', { name: 'Add Farmer' }).click();
    farmerName = `Product Owner ${Date.now()}`;
    await page.fill('input[name="name"]', farmerName);
    await page.fill('input[name="location"]', 'Farm Location');
    await page.selectOption('select[id="relationshipLevel"]', 'FRIEND');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin/farmers');
    // In a real app we might grab the ID from the URL or API response,
    // but here we just need the name to appear in the dropdown or list.
  });

  test('should add a new product successfully', async ({ page }) => {
    await page.goto('/admin/products');

    // Navigate to add product page
    await page.getByRole('link', { name: 'Add Product' }).click();

    const productName = `Fresh Crop ${Date.now()}`;

    // Select the farmer we created
    // The select options might text match the name
    await page.selectOption('select[id="farmerId"]', { label: farmerName });

    // Fill product details
    await page.fill('input[name="name"]', productName);
    await page.selectOption('select[id="unit"]', 'KG');

    // Set dates
    // Using simple date strings, might need adjustment based on browser locale/input implementation
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    await page.fill('input[id="seasonStart"]', today);
    await page.fill('input[id="seasonEnd"]', nextMonth);

    // Submit
    await page.click('button[type="submit"]');

    // Verify redirect
    await expect(page).toHaveURL('/admin/products');

    // Verify product exists in list
    await expect(page.getByText(productName)).toBeVisible();
    await expect(page.getByRole('cell', { name: farmerName })).toBeVisible();
  });

  test('should deactivate and activate a product', async ({ page }) => {
    // First create a product
    await page.goto('/admin/products/new');
    const productName = `Toggle Product ${Date.now()}`;
    await page.selectOption('select[id="farmerId"]', { label: farmerName });
    await page.fill('input[name="name"]', productName);
    await page.selectOption('select[id="unit"]', 'KG');
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[id="seasonStart"]', today);
    await page.fill('input[id="seasonEnd"]', today);
    await page.click('button[type="submit"]');

    // Go to list
    await page.goto('/admin/products');

    const row = page.getByRole('row').filter({ hasText: productName });

    // Check initial state (Active)
    await expect(row.getByText('Active')).toBeVisible();

    // Deactivate
    page.once('dialog', (dialog) => dialog.accept());
    await row.getByRole('button', { name: 'Deactivate' }).click();
    await expect(row.getByText('Inactive')).toBeVisible();

    // Activate
    page.once('dialog', (dialog) => dialog.accept());
    await row.getByRole('button', { name: 'Activate' }).click();
    await expect(row.getByText('Active')).toBeVisible();
  });

  test('should edit a product successfully', async ({ page }) => {
    // Create product to edit
    await page.goto('/admin/products/new');
    const productName = `Edit Product ${Date.now()}`;
    await page.selectOption('select[id="farmerId"]', { label: farmerName });
    await page.fill('input[name="name"]', productName);
    await page.selectOption('select[id="unit"]', 'KG');
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[id="seasonStart"]', today);
    await page.fill('input[id="seasonEnd"]', today);
    await page.click('button[type="submit"]');

    // Find and edit
    await page.goto('/admin/products');
    const row = page.getByRole('row').filter({ hasText: productName });
    await row.getByRole('link', { name: 'Edit', exact: true }).click();

    // Verify edit page
    await expect(page).toHaveURL(/\/admin\/products\/.*\/edit/);

    // Wait for the form to be populated with original data to avoid race condition
    await expect(page.locator('input[name="name"]')).toHaveValue(productName);

    // Update details
    const newName = `${productName} Updated`;
    await page.fill('input[name="name"]', newName);
    await page.selectOption('select[id="unit"]', 'DOZEN');
    await page.click('button[type="submit"]');

    // Verify changes
    await expect(page).toHaveURL('/admin/products');
    await expect(page.getByText('Loading...')).not.toBeVisible();

    // Use toPass to retry reloading until the data appears
    await expect(async () => {
      await page.reload();
      await expect(page.getByText(newName)).toBeVisible();
      const updatedRow = page.getByRole('row').filter({ hasText: newName });
      await expect(updatedRow).toBeVisible();
      await expect(updatedRow.getByText('DOZEN')).toBeVisible();
    }).toPass({ timeout: 10000 });
  });
});
