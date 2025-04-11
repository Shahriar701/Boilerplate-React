import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { injectable } from 'inversify';
import { HttpRequest, HttpResponse, IHttpClient } from '../../infrastructure/http/interfaces/http-client.interface';

@injectable()
export class AxiosHttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle session expiry, network errors, etc.
        if (error.response?.status === 401) {
          // Redirect to login or refresh token
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async request<T = any>(config: HttpRequest): Promise<HttpResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
      params: config.params,
    };

    try {
      const response = await this.axiosInstance.request<T>(axiosConfig);
      return {
        data: response.data,
        status: response.status,
        headers: response.headers as Record<string, string>,
      };
    } catch (error: any) {
      if (error.response) {
        // Server responded with an error status
        throw {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          data: { message: 'No response received from server' },
          status: 0,
        };
      } else {
        // Something else happened
        throw {
          data: { message: error.message || 'Unknown error occurred' },
          status: 0,
        };
      }
    }
  }

  async get<T = any>(
    url: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'get',
      params,
      headers,
    });
  }

  async post<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'post',
      data,
      headers,
    });
  }

  async put<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'put',
      data,
      headers,
    });
  }

  async delete<T = any>(
    url: string,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'delete',
      headers,
    });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'patch',
      data,
      headers,
    });
  }
} 