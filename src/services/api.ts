import { USE_MOCK } from '../utils/mockData';
import type { ApiResponse } from '../types';

const BASE_URL = ''; // Se debe establecer mediante setBaseUrl tras recibir INIT por postMessage

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  token?: string;
  signal?: AbortSignal;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, token, signal } = options;

    if (USE_MOCK) {
      return {
        success: true,
        data: {} as T,
        message: 'Mock response',
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        data: {} as T,
        message,
      };
    }
  }

  async get<T>(endpoint: string, token?: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', token, signal });
  }

  async post<T>(endpoint: string, body: Record<string, unknown>, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, token });
  }
}

export const apiService = new ApiService(BASE_URL);
export default apiService;
