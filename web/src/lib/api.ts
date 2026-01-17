import { getToken } from 'firebase/app-check';
import { appCheck } from './firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL.replace(/\/$/, '')}/api`;

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers = { ...options.headers } as Record<string, string>;

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach App Check token
  try {
    const appCheckToken = await getToken(appCheck);
    if (appCheckToken.token) {
      headers['X-Firebase-AppCheck'] = appCheckToken.token;
    }
  } catch (err) {
    // Log error but continue - backend handles enforcement policy
    console.warn('App Check token retrieval failed:', err);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
    });

    if (response.status === 204) {
      return { data: {} as T };
    }

    // Try to parse response body, but handle non-JSON responses gracefully
    let data: Record<string, unknown> | undefined;
    try {
      data = await response.json();
    } catch {
      // Response body is not valid JSON (e.g., 502 Bad Gateway returning HTML)
      if (!response.ok) {
        return { error: response.statusText || 'Request failed' };
      }
      return { error: 'Invalid response format' };
    }

    if (!response.ok) {
      return {
        error: (data?.error as string) || (data?.message as string) || response.statusText,
        message: data?.message as string | undefined,
      };
    }

    return { data: data as T };
  } catch (error) {
    return {
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Auth API
export const authApi = {
  // Admin login
  adminLogin: (email: string, password: string) =>
    request<{ success: boolean; user: { id: string; role: string; name: string; email: string } }>(
      '/auth/admin/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    ),

  // Buyer - Request OTP
  requestOtp: (phone: string) =>
    request<{ success: boolean; message: string; devOtp?: string }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  // Buyer - Verify OTP (Mock legacy flow)
  verifyOtp: (phone: string, otp: string) =>
    request<{ success: boolean; user: { id: string; role: string; name: string; phone: string } }>(
      '/auth/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      }
    ),

  // Firebase Token Verification
  verifyFirebaseToken: (idToken: string) =>
    request<{ success: boolean; user: { id: string; role: string; name: string; phone: string } }>(
      '/auth/firebase-verify',
      {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      }
    ),

  // Get current user
  me: () =>
    request<{ user: { id: string; role: string; name: string; email?: string; phone?: string } }>(
      '/auth/me'
    ),

  // Logout
  logout: () =>
    request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
};

import type {
  AddBatchProductInput,
  Batch,
  BatchAggregation,
  BatchPayoutsResponse,
  BatchProduct,
  CreateBatchInput,
  CreateFarmerInput,
  CreateOrderInput,
  CreatePayoutInput,
  CreateProductInput,
  Farmer,
  FarmerPayout,
  Hub,
  LogPaymentInput,
  Order,
  OrderItem,
  Payment,
  Product,
  UpdateBatchInput,
  UpdateBatchProductInput,
  UpdateFarmerInput,
  UpdateProductInput,
} from '@/types';

// Farmers API
export const farmersApi = {
  getAll: (includeInactive = false) =>
    request<{ farmers: Farmer[] }>(`/farmers?includeInactive=${includeInactive}`),

  getById: (id: string) => request<{ farmer: Farmer }>(`/farmers/${id}`),

  create: (data: CreateFarmerInput) =>
    request<{ farmer: Farmer }>('/farmers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateFarmerInput) =>
    request<{ farmer: Farmer }>(`/farmers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/farmers/${id}`, {
      method: 'DELETE',
    }),
};

// Products API
export const productsApi = {
  getAll: (params: { farmerId?: string; includeInactive?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.farmerId) query.append('farmerId', params.farmerId);
    if (params.includeInactive) query.append('includeInactive', 'true');
    return request<{ products: Product[] }>(`/products?${query.toString()}`);
  },

  getById: (id: string) => request<{ product: Product }>(`/products/${id}`),

  create: (data: CreateProductInput) =>
    request<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateProductInput) =>
    request<{ product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// Hubs API
export const hubsApi = {
  getAll: () => request<{ hubs: Hub[] }>('/hubs'),

  getById: (id: string) => request<{ hub: Hub }>(`/hubs/${id}`),
};

// Batches API
export const batchesApi = {
  getAll: () => request<{ batches: Batch[] }>('/batches'),

  getCurrent: () => request<{ batch: Batch | null }>('/batches/current'),

  getById: (id: string) => request<{ batch: Batch }>(`/batches/${id}`),

  create: (data: CreateBatchInput) =>
    request<{ batch: Batch }>('/batches', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateBatchInput) =>
    request<{ batch: Batch }>(`/batches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  transition: (id: string, targetStatus: Batch['status']) =>
    request<{ batch: Batch }>(`/batches/${id}/transition`, {
      method: 'POST',
      body: JSON.stringify({ targetStatus }),
    }),

  getAggregation: (id: string) => request<BatchAggregation>(`/batches/${id}/aggregation`),
};

// Batch Products API
export const batchProductsApi = {
  getByBatch: (batchId: string, isActive?: boolean) => {
    const query = isActive !== undefined ? `?isActive=${isActive}` : '';
    return request<{ products: BatchProduct[] }>(`/batches/${batchId}/products${query}`);
  },

  getById: (id: string) => request<{ batchProduct: BatchProduct }>(`/batch-products/${id}`),

  add: (batchId: string, data: AddBatchProductInput) =>
    request<{ batchProduct: BatchProduct }>(`/batches/${batchId}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateBatchProductInput) =>
    request<{ batchProduct: BatchProduct }>(`/batch-products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: async (
    id: string,
    force = false
  ): Promise<ApiResponse<{ batchProduct?: BatchProduct; success?: boolean }>> => {
    // Hard delete returns 204 (no JSON body), so don't go through JSON-parsing `request()`.
    if (force) {
      const res = await fetch(`${API_BASE}/batch-products/${id}?force=true`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        // fall back to best-effort text; callers can map this into UI
        const message = await res.text();
        return { error: message || 'Failed to delete' };
      }
      return { data: { success: true } };
    }

    // Soft delete returns `{ batchProduct }`
    return request<{ batchProduct: BatchProduct }>(`/batch-products/${id}?force=false`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersApi = {
  getAll: (params: { batchId?: string; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.batchId) query.append('batchId', params.batchId);
    if (params.status) query.append('status', params.status);
    return request<{
      orders: (Order & {
        buyer: { id: string; name: string; phone: string };
        batch: { name: string };
      })[];
    }>(`/orders?${query.toString()}`);
  },

  getById: (id: string) =>
    request<{
      order: Order & {
        buyer: { name: string; phone: string; email?: string };
        batch: { name: string; hub: { name: string } };
        payments: Payment[];
        items: (OrderItem & { batchProduct: { product: { name: string; unit: string } } })[];
      };
    }>(`/orders/${id}`),

  create: (data: CreateOrderInput) =>
    request<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyOrders: () => request<{ orders: Order[] }>('/orders/my'),
  editOrder: (
    orderId: string,
    data: {
      fulfillmentType?: 'PICKUP' | 'DELIVERY';
      items?: Array<{ batchProductId: string; orderedQty: number }>;
    }
  ) =>
    request<{ order: Order }>(`/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Packing API
export const packingApi = {
  getPackingList: (batchId: string) =>
    request<{
      orders: (Order & {
        buyer: { id: string; name: string; phone: string };
        items: (OrderItem & { batchProduct: { product: { name: string; unit: string } } })[];
      })[];
    }>(`/batches/${batchId}/packing`),

  updateOrderStatus: (orderId: string, status: Order['status']) =>
    request<{ order: Order }>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Payments API
export const paymentsApi = {
  logPayment: (orderId: string, data: LogPaymentInput) =>
    request<{ payment: Payment }>(`/orders/${orderId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Payouts API
export const payoutsApi = {
  getByBatch: (batchId: string) => request<BatchPayoutsResponse>(`/batches/${batchId}/payouts`),

  logPayout: (batchId: string, data: CreatePayoutInput) =>
    request<{ payout: FarmerPayout }>(`/batches/${batchId}/payouts`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Logs API
export const logsApi = {
  logCommunication: (data: {
    entityType: 'ORDER' | 'BATCH' | 'FARMER';
    entityId: string;
    messageType: string;
    recipientPhone: string;
    channel?: string;
    metadata?: Record<string, unknown>;
  }) =>
    request<{ log: unknown }>('/logs/communication', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCommunicationHistory: <T = unknown>(entityType: string, entityId: string) =>
    request<{ logs: T[] }>(`/logs/communication/${entityType}/${entityId}`),
};
