const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
    }),
};
