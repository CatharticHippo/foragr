import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000' 
  : 'https://api.cedarlume.com';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    STATS: '/users/me/stats',
    BADGES: '/users/me/badges',
    XP_HISTORY: '/users/me/xp-history',
  },
  
  // Organizations
  ORGANIZATIONS: {
    BASE: '/organizations',
    BY_ID: (id: string) => `/organizations/${id}`,
  },
  
  // Listings
  LISTINGS: {
    BASE: '/listings',
    BY_ID: (id: string) => `/listings/${id}`,
    SEARCH: '/listings/search',
    NEARBY: '/listings/nearby',
  },
  
  // Applications
  APPLICATIONS: {
    BASE: '/applications',
    BY_ID: (id: string) => `/applications/${id}`,
    MY_APPLICATIONS: '/applications/my',
  },
  
  // Attendance
  ATTENDANCE: {
    BASE: '/attendance',
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
  },
  
  // Donations
  DONATIONS: {
    BASE: '/donations',
    CHECKOUT: '/donations/checkout',
    WEBHOOK: '/donations/webhook',
    MY_DONATIONS: '/donations/my',
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    REGISTER_TOKEN: '/notifications/register-token',
  },
} as const;

// Request timeout
export const REQUEST_TIMEOUT = 10000; // 10 seconds

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryBackoff: 2,
};

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data;
            await AsyncStorage.setItem('auth_token', accessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
          // You might want to emit an event here to trigger logout
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Export the API client instance
export const apiClient = createApiClient();
