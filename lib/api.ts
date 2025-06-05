// API service for making requests to the backend

/**
 * Base API URL from environment variables
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bnbindiabeta.vercel.app';

console.log('API Base URL:', API_BASE_URL);

/**
 * Makes a fetch request to the API with the appropriate headers and error handling
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`Making API request to: ${url}`, { 
    method: options.method,
    headers: options.headers,
  });
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Merge default headers with provided options
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    console.log(`API response status: ${response.status} ${response.statusText}`);
    
    // Parse JSON response
    const data = await response.json();
    console.log('API response data:', data);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data as T;
  } catch (error: any) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * API service for authentication endpoints
 */
export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (email: string, password: string) => {
    console.log('API login function called with email:', email);
    // Use external API endpoint directly
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://bnbindiabeta.vercel.app'}/api/auth/login`;
    return fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      const data = await res.json();
      return data;
    });
  },
  
  /**
   * Register a new user
   */
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => {
    return fetchApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  /**
   * Get current user information
   */
  getCurrentUser: async (token: string) => {
    return fetchApi('/api/auth/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  /**
   * Update user profile
   */
  updateUserProfile: async (token: string, userData: any) => {
    return fetchApi('/api/auth/user', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },
  
  /**
   * Request password reset
   */
  forgotPassword: async (email: string) => {
    return fetchApi('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

/**
 * API service for listings endpoints
 */
export const listingsApi = {
  /**
   * Get all listings with filters
   */
  getListings: async (filters: any = {}) => {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/api/listings${queryString ? `?${queryString}` : ''}`;
    
    return fetchApi(endpoint, {
      method: 'GET',
    });
  },
  
  /**
   * Get a single listing by ID
   */
  getListing: async (id: string) => {
    return fetchApi(`/api/listings/${id}`, {
      method: 'GET',
    });
  },
  
  /**
   * Create a new listing (host only)
   */
  createListing: async (token: string, listingData: any) => {
    return fetchApi('/api/listings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingData),
    });
  },
  
  /**
   * Update an existing listing (host only)
   */
  updateListing: async (token: string, id: string, listingData: any) => {
    return fetchApi(`/api/listings/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingData),
    });
  },
  
  /**
   * Delete a listing (host only)
   */
  deleteListing: async (token: string, id: string) => {
    return fetchApi(`/api/listings/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

/**
 * API service for booking endpoints
 */
export const bookingsApi = {
  /**
   * Create a new booking
   */
  createBooking: async (token: string, bookingData: any) => {
    return fetchApi('/api/bookings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  },
  
  /**
   * Get user bookings
   */
  getUserBookings: async (token: string) => {
    return fetchApi('/api/bookings/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  /**
   * Get host bookings
   */
  getHostBookings: async (token: string) => {
    return fetchApi('/api/bookings/host', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  /**
   * Get a single booking by ID
   */
  getBooking: async (token: string, id: string) => {
    return fetchApi(`/api/bookings/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

/**
 * API service for payment endpoints
 */
export const paymentsApi = {
  /**
   * Create a payment order
   */
  createOrder: async (token: string, orderData: any) => {
    return fetchApi('/api/payments/create-order', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
  },
  
  /**
   * Verify a payment
   */
  verifyPayment: async (token: string, paymentData: any) => {
    return fetchApi('/api/payments/verify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
  },
};
