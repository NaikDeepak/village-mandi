import { expect, test } from '@playwright/test';
import { createFarmer, deleteFarmer, getFarmerByName } from './utils/api-helpers';

test.describe('Admin Farmer Management', () => {
  test('should add a new farmer successfully', async ({ page, request }) => {
    const createdFarmerIds: string[] = [];

    try {
      await page.goto('/admin/farmers');

      // Navigate to add farmer page
      await page.getByRole('link', { name: 'Add Farmer' }).click();
      await expect(page).toHaveURL(/\/admin\/farmers\/new/);

      // Generate unique farmer name to avoid conflicts
      const farmerName = `Test Farmer ${Date.now()}`;

      // Fill the form
      await page.fill('input[name="name"]', farmerName);
      await page.fill('input[name="location"]', 'Test Village');
      await page.selectOption('select[id="relationshipLevel"]', 'SELF');
      await page.fill('textarea[id="description"]', 'This is a test farmer description');

      // Submit
      await page.click('button[type="submit"]');

      // Verify redirect back to farmers list
      await expect(page).toHaveURL('/admin/farmers');

      // Verify the new farmer is in the list
      const row = page.getByRole('row').filter({ hasText: farmerName });
      await expect(row).toBeVisible();
      await expect(row.getByText('Test Village')).toBeVisible();

      // Find ID for cleanup
      const farmer = await getFarmerByName(request, farmerName);
      if (farmer) {
        createdFarmerIds.push(farmer.id);
      }
    } finally {
      // Cleanup is scoped to this specific test
      for (const id of createdFarmerIds) {
        await deleteFarmer(request, id);
      }
    }
  });

  test('should deactivate and activate a farmer', async ({ page, request }) => {
    let farmerId: string | null = null;

    try {
      // Create via API
      const farmerName = `Toggle Farmer ${Date.now()}`;
      const farmer = await createFarmer(request, {
        name: farmerName,
        location: 'Toggle Village',
        relationshipLevel: 'FAMILY',
      });
      farmerId = farmer.id;

      await page.goto('/admin/farmers');

      // Find the row with our farmer
      const row = page.getByRole('row').filter({ hasText: farmerName });

      // Check initial state (should be Active)
      await expect(row.getByText('Active')).toBeVisible();

      // Click Deactivate
      page.once('dialog', (dialog) => dialog.accept()); // Handle confirmation dialog
      await row.getByRole('button', { name: 'Deactivate' }).click();

      // Wait for status change
      await expect(row.getByText('Inactive')).toBeVisible();

      // Click Activate
      page.once('dialog', (dialog) => dialog.accept()); // Handle confirmation dialog
      await row.getByRole('button', { name: 'Activate' }).click();

      // Wait for status change back to Active
      await expect(row.getByText('Active')).toBeVisible();
    } finally {
      // Cleanup is scoped to this specific test
      if (farmerId) {
        await deleteFarmer(request, farmerId);
      }
    }
  });

  test('should edit a farmer successfully', async ({ page, request }) => {
    let farmerId: string | null = null;

    try {
      // Create a farmer to edit via API
      const farmerName = `Edit Farmer ${Date.now()}`;
      const farmer = await createFarmer(request, {
        name: farmerName,
        location: 'Original Location',
        relationshipLevel: 'SELF',
      });
      farmerId = farmer.id;

      await page.goto('/admin/farmers');

      // Find the farmer and click edit
      const row = page.getByRole('row').filter({ hasText: farmerName });
      await row.getByRole('link', { name: 'Edit', exact: true }).click();

      // Verify we are on the edit page
      await expect(page).toHaveURL(/\/admin\/farmers\/.*\/edit/);

      // Wait for the form to be populated with original data
      await expect(page.locator('input[name="name"]')).toHaveValue(farmerName);

      // Update details
      const newName = `${farmerName} Updated`;
      await page.fill('input[name="name"]', newName);
      await page.fill('input[name="location"]', 'Updated Location');
      await page.click('button[type="submit"]');

      // Verify redirect and updated info
      await expect(page).toHaveURL('/admin/farmers');
      await expect(page.getByText('Loading...')).not.toBeVisible();

      // Use toPass to retry reloading until the data appears
      await expect(async () => {
        await page.reload();
        await expect(page.getByText('Loading...')).not.toBeVisible();
        await expect(page.getByText(newName)).toBeVisible();
        const updatedRow = page.getByRole('row').filter({ hasText: newName });
        await expect(updatedRow).toBeVisible();
        await expect(updatedRow.getByText('Updated Location')).toBeVisible();
      }).toPass({ timeout: 20000 });
    } finally {
      // Cleanup is scoped to this specific test
      if (farmerId) {
        await deleteFarmer(request, farmerId);
      }
    }
  });
});
