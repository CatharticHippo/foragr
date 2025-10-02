
// Base API client configuration
export interface ApiClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request options
export interface RequestOptions {
  method: HttpMethod;
  path: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  timestamp: string;
}

// Error response
export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  method: string;
}

// Custom error class
export class CedarlumeApiError extends Error {
  public statusCode: number;
  public timestamp: string;
  public path: string;
  public method: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'CedarlumeApiError';
    this.statusCode = error.statusCode;
    this.timestamp = error.timestamp;
    this.path = error.path;
    this.method = error.method;
  }
}

// Base API client class
export class CedarlumeApiClient {
  private config: ApiClientConfig;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 10000,
      ...config,
    };
    
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (config.apiKey) {
      this.defaultHeaders['Authorization'] = `Bearer ${config.apiKey}`;
    }
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Make HTTP request
  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, body, headers = {}, params } = options;
    
    // Build URL with query parameters
    const url = new URL(path, this.config.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Prepare request
    const requestInit: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestInit.body = JSON.stringify(body);
    }

    // Make request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url.toString(), {
        ...requestInit,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        throw new CedarlumeApiError(responseData);
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof CedarlumeApiError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Convenience methods
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'GET', path, params: params || {} });
  }

  async post<T>(path: string, body?: any): Promise<T> {
    return this.request<T>({ method: 'POST', path, body });
  }

  async put<T>(path: string, body?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', path, body });
  }

  async patch<T>(path: string, body?: any): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', path });
  }
}

// Create default client instance
export function createClient(config: ApiClientConfig): CedarlumeApiClient {
  return new CedarlumeApiClient(config);
}
