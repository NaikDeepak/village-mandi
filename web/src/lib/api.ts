const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'Request failed',
        message: data.message,
      };
    }

    return { data };
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

  // Buyer - Verify OTP
  verifyOtp: (phone: string, otp: string) =>
    request<{ success: boolean; user: { id: string; role: string; name: string; phone: string } }>(
      '/auth/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
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
  CreateFarmerInput,
  CreateProductInput,
  Farmer,
  Product,
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
