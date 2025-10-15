import config from './config';
import { getAuthHeaders, getUser } from './auth';

export const apiClient = {
  baseUrl: config.apiBaseUrl,
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    };
    
    return fetch(url, { ...defaultOptions, ...options });
  },
  
  get: (endpoint: string, options?: RequestInit) => 
    apiClient.request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),

  auth: {
    signup: (data: { name: string; email: string; password: string; rePassword: string; phone: string }) =>
      fetch(`${config.apiBaseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    
    signin: (data: { email: string; password: string }) =>
      fetch(`${config.apiBaseUrl}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    forgotPassword: (data: { email: string }) =>
      fetch(`${config.apiBaseUrl}/auth/forgotPasswords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    verifyResetCode: (data: { resetCode: string }) =>
      fetch(`${config.apiBaseUrl}/auth/verifyResetCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    resetPassword: (data: { email: string; newPassword: string }) =>
      fetch(`${config.apiBaseUrl}/auth/resetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  },

  user: {
    changePassword: (data: { currentPassword: string; password: string; rePassword: string }) =>
      fetch(`${config.apiBaseUrl}/users/changeMyPassword`, {
        method: 'PUT',
        headers: { ...getAuthHeaders() },
        body: JSON.stringify(data),
      }),

    updateProfile: (data: { name: string; email: string; phone: string }) =>
      fetch(`${config.apiBaseUrl}/users/updateMe`, {
        method: 'PUT',
        headers: { ...getAuthHeaders() },
        body: JSON.stringify(data),
      }),
  },

  products: {
    getAll: (params?: { page?: number; limit?: number; sort?: string; category?: string; brand?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.sort) searchParams.append('sort', params.sort);
      if (params?.category) searchParams.append('category', params.category);
      if (params?.brand) searchParams.append('brand', params.brand);
      
      const queryString = searchParams.toString();
      return fetch(`${config.apiBaseUrl}/products${queryString ? `?${queryString}` : ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    },

    getById: (id: string) => {
      const url = `${config.apiBaseUrl}/products/${id}`;
      return fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    },

    search: (query: string) =>
      fetch(`${config.apiBaseUrl}/products?keyword=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
  },

  cart: {
    get: () =>
      fetch(`${config.apiBaseUrl}/cart`, {
        method: 'GET',
        headers: { ...getAuthHeaders() },
      }),

    add: (productId: string) =>
      fetch(`${config.apiBaseUrl}/cart`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: JSON.stringify({ productId }),
      }),

    removeItem: (itemId: string) =>
      fetch(`${config.apiBaseUrl}/cart/${itemId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }),
  },

  orders: {
    getAll: () =>
      fetch(`${config.apiBaseUrl}/orders`, {
        method: 'GET',
        headers: { ...getAuthHeaders() },
      }),

    getById: (orderId: string) =>
      fetch(`${config.apiBaseUrl}/orders/${orderId}`, {
        method: 'GET',
        headers: { ...getAuthHeaders() },
      }),

    createCash: (cartId: string, shippingAddress: { details: string; phone: string; city: string }) =>
      fetch(`${config.apiBaseUrl}/orders/${cartId}`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: JSON.stringify({ 
          shippingAddress,
          paymentMethodType: 'cash'
        }),
      }),

    createCheckoutSession: (
      cartId: string,
      url: string,
      shippingAddress: { details: string; phone: string; city: string }
    ) =>
      fetch(`${config.apiBaseUrl}/orders/checkout-session/${cartId}?url=${encodeURIComponent(url)}`,
        {
          method: 'POST',
          headers: { ...getAuthHeaders() },
          body: JSON.stringify({ shippingAddress }),
        }
      ),
  },

  wishlist: {
    add: (productId: string) => {
      const headers = getAuthHeaders();
      return fetch(`${config.apiBaseUrl}/wishlist`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ productId }),
      });
    },

    remove: (productId: string) => {
      const headers = getAuthHeaders();
      return fetch(`${config.apiBaseUrl}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: headers,
      });
    },

    getAll: () => {
      const headers = getAuthHeaders();
      return fetch(`${config.apiBaseUrl}/wishlist`, {
        method: 'GET',
        headers: headers,
      });
    },
  },

  categories: {
    getAll: () =>
      fetch(`${config.apiBaseUrl}/categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),

    getSubcategories: (categoryId: string) =>
      fetch(`${config.apiBaseUrl}/categories/${categoryId}/subcategories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
  },

  subcategories: {
    getAll: () =>
      fetch(`${config.apiBaseUrl}/subcategories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),

    getById: (id: string) =>
      fetch(`${config.apiBaseUrl}/subcategories/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
  },
};

export default apiClient;
