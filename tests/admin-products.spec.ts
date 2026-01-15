import { expect, test } from '@playwright/test';
import {
  createFarmer,
  createProduct,
  deleteFarmer,
  deleteProduct,
  getProductsByFarmerId,
} from './utils/api-helpers';

test.describe('Admin Product Management', () => {
  let _farmerId: string;
  let farmerName: string;
  const createdProductIds: string[] = [];

  // Setup: Ensure we have a farmer to add products to
  test.beforeEach(async ({ request }) => {
    const farmer = await createFarmer(request, {
      name: `Product Owner ${Date.now()}`,
      location: 'Farm Location',
      relationshipLevel: 'FRIEND',
    });
    farmerName = farmer.name;
    _farmerId = farmer.id;
  });

  // Cleanup
  test.afterEach(async ({ request }) => {
    // Explicitly delete all products for this farmer first
    // This handles both API-created products and UI-created products (where we might not have captured the ID)
    if (_farmerId) {
      const products = await getProductsByFarmerId(request, _farmerId);
      for (const product of products) {
        await deleteProduct(request, product.id);
      }
      // Delete the farmer
      await deleteFarmer(request, _farmerId);
    }
  });

  test('should add a new product successfully', async ({ page }) => {
    await page.goto('/admin/products');

    // Navigate to add product page
    await page.getByRole('link', { name: 'Add Product' }).click();

    const productName = `Fresh Crop ${Date.now()}`;

    // Select the farmer we created
    await page.selectOption('select[id="farmerId"]', { label: farmerName });

    // Fill product details
    await page.fill('input[name="name"]', productName);
    await page.selectOption('select[id="unit"]', 'KG');

    // Set dates
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

    // Note: We can't easily get the ID of the UI-created product for cleanup without querying API.
    // However, since we clean up the farmer, the product should ideally be cascade/orphan deleted,
    // or we accept this one artifact if cascade delete isn't set up (user request was to add cleanup).
    // Given the limitations, we focus on cleaning up API-created resources.
  });

  test('should deactivate and activate a product', async ({ page, request }) => {
    // First create a product via API
    const productName = `Toggle Product ${Date.now()}`;
    const product = await createProduct(request, {
      farmerId: _farmerId,
      name: productName,
      unit: 'KG',
    });
    createdProductIds.push(product.id);

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

  test('should edit a product successfully', async ({ page, request }) => {
    // Create product to edit via API
    const productName = `Edit Product ${Date.now()}`;
    const product = await createProduct(request, {
      farmerId: _farmerId,
      name: productName,
      unit: 'KG',
    });
    createdProductIds.push(product.id);

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
    }).toPass({ timeout: 30000 });
  });
});
