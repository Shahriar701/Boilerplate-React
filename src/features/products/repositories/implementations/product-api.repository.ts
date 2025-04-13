import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IProductRepository } from '../product.repository.interface';
import { IHttpClient } from '../../../../adapters/api/http-client.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import { ProductDto, ProductFilterRequest, ProductListResponse } from '../../models/product.dto';

@injectable()
export class ProductApiRepository implements IProductRepository {
    constructor(
        @inject(TYPES.HttpClient) private readonly httpClient: IHttpClient,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    async getProducts(filter: ProductFilterRequest): Promise<ProductListResponse> {
        try {
            let url = '/products';

            // Use search endpoint if search query is provided
            if (filter.search) {
                url = `/products/search?q=${encodeURIComponent(filter.search)}`;
                return this.httpClient.get<ProductListResponse>(url);
            }

            // Use type endpoint if category/type is provided
            if (filter.category) {
                url = `/products/type/${encodeURIComponent(filter.category)}`;
                return this.httpClient.get<ProductListResponse>(url);
            }

            // Default list with pagination
            const params = {
                page: filter.page?.toString() || '1',
                limit: filter.pageSize?.toString() || '10',
                ...(filter.inStock !== undefined && { inStock: filter.inStock.toString() })
            };

            return this.httpClient.get<ProductListResponse>(url, params);
        } catch (error) {
            this.logger.error('Failed to fetch products:', error);
            throw error;
        }
    }

    async getProductById(id: string): Promise<ProductDto | null> {
        try {
            return this.httpClient.get<ProductDto>(`/products/${id}`);
        } catch (error) {
            this.logger.error(`Failed to fetch product with id ${id}:`, error);
            return null;
        }
    }

    async getProductsByIds(ids: string[]): Promise<ProductDto[]> {
        try {
            // Since there's no dedicated endpoint for fetching multiple products by IDs,
            // we'll make individual requests for each product
            const promises = ids.map(id => this.getProductById(id));
            const products = await Promise.all(promises);

            // Filter out null values (products that weren't found)
            return products.filter(product => product !== null) as ProductDto[];
        } catch (error) {
            this.logger.error('Failed to fetch products by ids:', error);
            throw error;
        }
    }

    async createProduct(product: Omit<ProductDto, 'id'>): Promise<ProductDto> {
        try {
            return this.httpClient.post<ProductDto>('/products', product);
        } catch (error) {
            this.logger.error('Failed to create product:', error);
            throw error;
        }
    }

    async updateProduct(id: string, product: Partial<ProductDto>): Promise<ProductDto> {
        try {
            return this.httpClient.put<ProductDto>(`/products/${id}`, product);
        } catch (error) {
            this.logger.error(`Failed to update product with id ${id}:`, error);
            throw error;
        }
    }

    async deleteProduct(id: string): Promise<boolean> {
        try {
            await this.httpClient.delete(`/products/${id}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete product with id ${id}:`, error);
            return false;
        }
    }
} 