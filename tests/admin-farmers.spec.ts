import { expect, test } from '@playwright/test';

test.describe('Admin Farmer Management', () => {
  test('should add a new farmer successfully', async ({ page }) => {
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
  });

  test('should deactivate and activate a farmer', async ({ page }) => {
    await page.goto('/admin/farmers');

    // We need at least one active farmer to test deactivation.
    // Assuming the "add farmer" test ran first or there's seeded data.
    // Let's create one just in case to be safe, or just find the first active one.

    // For stability, let's create a specific one for this test
    await page.getByRole('link', { name: 'Add Farmer' }).click();
    const farmerName = `Toggle Farmer ${Date.now()}`;
    await page.fill('input[name="name"]', farmerName);
    await page.fill('input[name="location"]', 'Toggle Village');
    await page.selectOption('select[id="relationshipLevel"]', 'FAMILY');
    await page.click('button[type="submit"]');
    await expect(page.getByText(farmerName)).toBeVisible();

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
  });

  test('should edit a farmer successfully', async ({ page }) => {
    await page.goto('/admin/farmers');

    // Create a farmer to edit
    await page.getByRole('link', { name: 'Add Farmer' }).click();
    const farmerName = `Edit Farmer ${Date.now()}`;
    await page.fill('input[name="name"]', farmerName);
    await page.fill('input[name="location"]', 'Original Location');
    await page.selectOption('select[id="relationshipLevel"]', 'SELF');
    await page.click('button[type="submit"]');

    // Find the farmer and click edit
    const row = page.getByRole('row').filter({ hasText: farmerName });
    await row.getByRole('link', { name: 'Edit', exact: true }).click();

    // Verify we are on the edit page
    await expect(page).toHaveURL(/\/admin\/farmers\/.*\/edit/);

    // Wait for the form to be populated with original data to avoid race condition where fetch overwrites our fill
    await expect(page.locator('input[name="name"]')).toHaveValue(farmerName);

    // Update details
    const newName = `${farmerName} Updated`;
    await page.fill('input[name="name"]', newName);
    await page.fill('input[name="location"]', 'Updated Location');
    await page.click('button[type="submit"]');

    // Verify redirect and updated info
    await expect(page).toHaveURL('/admin/farmers');
    await expect(page.getByText('Loading...')).not.toBeVisible();

    // Use toPass to retry reloading until the data appears (handles eventual consistency)
    await expect(async () => {
      await page.reload();
      await expect(page.getByText('Loading...')).not.toBeVisible();
      await expect(page.getByText(newName)).toBeVisible();
      const updatedRow = page.getByRole('row').filter({ hasText: newName });
      await expect(updatedRow).toBeVisible();
      await expect(updatedRow.getByText('Updated Location')).toBeVisible();
    }).toPass({ timeout: 20000 });
  });
});
