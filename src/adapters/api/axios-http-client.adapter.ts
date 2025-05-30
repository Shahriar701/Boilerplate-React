import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../app/config/types';
import { IHttpClient } from './http-client.interface';
import { IStorageService } from '../storage/storage.interface';
import { ILoggerService } from '../../infrastructure/logging/logger.interface';

@injectable()
export class AxiosHttpClientAdapter implements IHttpClient {
  private readonly client: AxiosInstance;

  constructor(
    @inject(TYPES.StorageService) private readonly storageService: IStorageService,
    @inject(TYPES.LoggerService) private readonly logger: ILoggerService
  ) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
    
    this.logger.info(`Initializing HTTP client with base URL: ${baseURL}`);
    
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor to attach the token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.storageService.get('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          this.logger.error('API Response Error:', {
            status: error.response.status,
            data: error.response.data,
            url: error.config?.url
          });

          // Pass the error through with the response data
          return Promise.reject(error);
        } else if (error.request) {
          // The request was made but no response was received
          this.logger.error('API Request Error (No Response):', {
            request: error.request,
            url: error.config?.url
          });
          
          // Create a more user-friendly error for connection issues
          const connectionError = new Error(
            'Cannot connect to the server. Please check your internet connection and try again.'
          );
          return Promise.reject(connectionError);
        } else {
          // Something happened in setting up the request
          this.logger.error('API Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const config: AxiosRequestConfig = { params };
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.logger.error(`GET ${url} failed:`, error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data);
      return response.data;
    } catch (error) {
      this.logger.error(`POST ${url} failed:`, error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data);
      return response.data;
    } catch (error) {
      this.logger.error(`PUT ${url} failed:`, error);
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<T>(url);
      return response.data;
    } catch (error) {
      this.logger.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  }
} 