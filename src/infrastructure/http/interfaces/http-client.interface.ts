export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers?: Record<string, string>;
}

export interface HttpRequest {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

export interface IHttpClient {
  request<T = any>(config: HttpRequest): Promise<HttpResponse<T>>;
  get<T = any>(url: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Promise<HttpResponse<T>>;
  post<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;
  put<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;
  delete<T = any>(url: string, headers?: Record<string, string>): Promise<HttpResponse<T>>;
  patch<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;
} 