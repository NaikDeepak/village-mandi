import { expect, test } from '@playwright/test';
import { createFarmer, createProduct, deleteFarmer, deleteProduct } from './utils/api-helpers';

test.describe('Admin Farmer Details', () => {
  test('should view farmer details and their products', async ({ page }) => {
    let farmer: any;
    let product: any;

    try {
      // 1. Create a farmer via API
      farmer = await createFarmer(page.request, {
        name: `Detail Farmer ${Date.now()}`,
        location: 'Detail Location',
        relationshipLevel: 'FAMILY',
        description: 'Detailed Description',
      });
      const farmerName = farmer.name;

      // 2. Add a product for this farmer via API
      const productName = `Detail Product ${Date.now()}`;
      product = await createProduct(page.request, {
        farmerId: farmer.id,
        name: productName,
        unit: 'KG',
      });

      // 3. Go to Farmers list
      await page.goto('/admin/farmers');

      // 4. Click on farmer name to go to details
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
    } finally {
      // Cleanup
      if (product?.id) await deleteProduct(page.request, product.id);
      if (farmer?.id) await deleteFarmer(page.request, farmer.id);
    }
  });
});
