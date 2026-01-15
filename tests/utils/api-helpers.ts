import { type APIRequestContext, expect } from '@playwright/test';

// Use backend base URL directly (no /api prefix) as per server/src/routes/farmers.ts
const API_BASE = 'http://localhost:3000';

interface FarmerData {
  name: string;
  location: string;
  relationshipLevel: 'SELF' | 'FAMILY' | 'FRIEND' | 'BUSINESS';
  description?: string;
  isActive?: boolean;
}

interface ProductData {
  farmerId: string;
  name: string;
  unit: 'KG' | 'GRAM' | 'DOZEN' | 'PIECE';
  seasonStart?: string; // ISO Date string
  seasonEnd?: string; // ISO Date string
  isActive?: boolean;
}

export async function createFarmer(request: APIRequestContext, data: FarmerData) {
  const response = await request.post(`${API_BASE}/farmers`, {
    data: {
      location: 'Default Location',
      relationshipLevel: 'FRIEND',
      description: 'Default Description',
      ...data,
    },
  });

  if (!response.ok()) {
    console.error(`createFarmer failed: ${response.status()} ${await response.text()}`);
  }
  expect(response.ok()).toBeTruthy();
  // API returns { farmer: {...} } so we unwrap it
  return (await response.json()).farmer;
}

export async function deleteFarmer(request: APIRequestContext, id: string) {
  // Add force=true for hard delete to clean up test data completely
  const response = await request.delete(`${API_BASE}/farmers/${id}?force=true`);
  // Ignore 404 as it means already deleted
  if (!response.ok() && response.status() !== 404) {
    console.error(`deleteFarmer failed: ${response.status()} ${await response.text()}`);
    expect(response.ok()).toBeTruthy();
  }
}

export async function createProduct(request: APIRequestContext, data: ProductData) {
  const response = await request.post(`${API_BASE}/products`, {
    data: {
      unit: 'KG',
      // Schema expects proper ISO date strings if not provided
      seasonStart: new Date().toISOString(),
      seasonEnd: new Date(Date.now() + 86400000).toISOString(),
      ...data,
    },
  });

  if (!response.ok()) {
    console.error(`createProduct failed: ${response.status()} ${await response.text()}`);
  }
  expect(response.ok()).toBeTruthy();
  // API returns { product: {...} } so we unwrap it
  return (await response.json()).product;
}

export async function deleteProduct(request: APIRequestContext, id: string) {
  // Add force=true for hard delete to clean up test data completely
  const response = await request.delete(`${API_BASE}/products/${id}?force=true`);
  // Ignore 404
  if (!response.ok() && response.status() !== 404) {
    console.error(`deleteProduct failed: ${response.status()} ${await response.text()}`);
    expect(response.ok()).toBeTruthy();
  }
}

export async function getFarmerByName(request: APIRequestContext, name: string) {
  const response = await request.get(`${API_BASE}/farmers`);
  expect(response.ok()).toBeTruthy();
  const { farmers } = await response.json();
  return farmers.find((f: any) => f.name === name);
}

export async function getProductsByFarmerId(request: APIRequestContext, farmerId: string) {
  // Include inactive products so we find and delete everything
  const response = await request.get(
    `${API_BASE}/products?farmerId=${farmerId}&includeInactive=true`
  );
  expect(response.ok()).toBeTruthy();
  const { products } = await response.json();
  console.log(`Debug: Fetched ${products.length} products for farmer ${farmerId}`);
  return products;
}
