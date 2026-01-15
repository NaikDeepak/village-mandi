import { expect, test } from '@playwright/test';
import {
  createFarmer,
  createProduct,
  deleteFarmer,
  deleteProduct,
  getProductsByFarmerId,
} from './utils/api-helpers';

test.describe('Admin Product Management', () => {
  test('should add a new product successfully', async ({ page, request }) => {
    let farmerId: string | null = null;

    try {
      // Setup: Create a farmer to add products to
      const farmer = await createFarmer(request, {
        name: `Product Owner ${Date.now()}`,
        location: 'Farm Location',
        relationshipLevel: 'FRIEND',
      });
      farmerId = farmer.id;
      const farmerName = farmer.name;

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
    } finally {
      // Cleanup: delete all products for this farmer, then delete the farmer
      if (farmerId) {
        const products = await getProductsByFarmerId(request, farmerId);
        for (const product of products) {
          await deleteProduct(request, product.id);
        }
        await deleteFarmer(request, farmerId);
      }
    }
  });

  test('should deactivate and activate a product', async ({ page, request }) => {
    let farmerId: string | null = null;
    let productId: string | null = null;

    try {
      // Setup: Create a farmer
      const farmer = await createFarmer(request, {
        name: `Product Owner ${Date.now()}`,
        location: 'Farm Location',
        relationshipLevel: 'FRIEND',
      });
      farmerId = farmer.id;

      // Create a product via API
      const productName = `Toggle Product ${Date.now()}`;
      const product = await createProduct(request, {
        farmerId,
        name: productName,
        unit: 'KG',
      });
      productId = product.id;

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
    } finally {
      // Cleanup is scoped to this specific test
      if (productId) {
        await deleteProduct(request, productId);
      }
      if (farmerId) {
        await deleteFarmer(request, farmerId);
      }
    }
  });

  test('should edit a product successfully', async ({ page, request }) => {
    let farmerId: string | null = null;
    let productId: string | null = null;

    try {
      // Setup: Create a farmer
      const farmer = await createFarmer(request, {
        name: `Product Owner ${Date.now()}`,
        location: 'Farm Location',
        relationshipLevel: 'FRIEND',
      });
      farmerId = farmer.id;

      // Create product to edit via API
      const productName = `Edit Product ${Date.now()}`;
      const product = await createProduct(request, {
        farmerId,
        name: productName,
        unit: 'KG',
      });
      productId = product.id;

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
    } finally {
      // Cleanup is scoped to this specific test
      if (productId) {
        await deleteProduct(request, productId);
      }
      if (farmerId) {
        await deleteFarmer(request, farmerId);
      }
    }
  });
});
