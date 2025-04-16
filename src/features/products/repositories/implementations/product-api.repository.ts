import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IProductRepository } from '../product.repository.interface';
import { IHttpClient } from '../../../../adapters/api/http-client.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import { ProductDto, ProductFilterRequest, ProductListResponse } from '../../models/product.dto';
import { Product, ProductCreationDto, ProductUpdateDto } from '../../models/product.model';
import axios from "axios";

@injectable()
export class ProductApiRepository implements IProductRepository {
    private readonly baseUrl = "http://localhost:3000/api/products";

    constructor(
        @inject(TYPES.HttpClient) private readonly httpClient: IHttpClient,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    // Implement the IProductRepository interface methods
    async getAll(filter?: ProductFilterRequest): Promise<Product[]> {
        try {
            console.log("Fetching products with filters:", filter);

            let url = this.baseUrl;
            if (filter) {
                const params = new URLSearchParams();
                if (filter.category) params.append("category", filter.category);
                if (filter.minPrice) params.append("minPrice", filter.minPrice.toString());
                if (filter.maxPrice) params.append("maxPrice", filter.maxPrice.toString());
                if (filter.search) params.append("search", filter.search);
                if (filter.page) params.append("page", filter.page.toString());
                if (filter.pageSize) params.append("pageSize", filter.pageSize.toString());
                if (filter.sortBy) params.append("sortBy", filter.sortBy);
                if (filter.sortOrder) params.append("sortOrder", filter.sortOrder);

                url += `?${params.toString()}`;
            }

            const response = await axios.get<ProductListResponse>(url);
            console.log("API response for getAll:", response.status);
            
            return response.data.items.map(this.mapDtoToModel);
        } catch (error) {
            console.error("Error fetching products:", error);
            return []; // Return empty array instead of throwing
        }
    }

    async getById(id: string): Promise<Product | null> {
        try {
            console.log(`Fetching product with ID: ${id}`);
            const response = await axios.get<ProductDto>(`${this.baseUrl}/${id}`);
            console.log(`API response for getById(${id}):`, response.status);
            return this.mapDtoToModel(response.data);
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
            return null;
        }
    }

    async create(product: ProductCreationDto): Promise<Product> {
        try {
            console.log("Creating product:", product);
            const response = await axios.post<ProductDto>(this.baseUrl, product);
            console.log("API response for create:", response.status);
            return this.mapDtoToModel(response.data);
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    async update(product: ProductUpdateDto): Promise<Product> {
        try {
            // Extract ID from the product object
            const id = product.id;
            if (!id) {
                throw new Error('Product ID is required for update');
            }
            
            console.log(`Updating product with ID ${id}:`, product);
            const response = await axios.put<ProductDto>(`${this.baseUrl}/${id}`, product);
            console.log(`API response for update(${id}):`, response.status);
            return this.mapDtoToModel(response.data);
        } catch (error) {
            console.error(`Error updating product:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            console.log(`Deleting product with ID: ${id}`);
            await axios.delete(`${this.baseUrl}/${id}`);
            console.log(`API response for delete(${id}): success`);
            return true;
        } catch (error) {
            console.error(`Error deleting product with ID ${id}:`, error);
            return false; // Return false instead of throwing
        }
    }

    // ProductDto methods
    async getProducts(filter: ProductFilterRequest): Promise<ProductListResponse> {
        try {
            this.logger.info('Fetching products with filter:', filter);
            
            // Use the same baseUrl as the getAll method
            let url = this.baseUrl;

            // Build query parameters
            const params = new URLSearchParams();
            if (filter.category) params.append("category", filter.category);
            if (filter.minPrice !== undefined) params.append("minPrice", filter.minPrice.toString());
            if (filter.maxPrice !== undefined) params.append("maxPrice", filter.maxPrice.toString());
            if (filter.search) params.append("search", filter.search);
            if (filter.query) params.append("query", filter.query);
            if (filter.page) params.append("page", filter.page.toString());
            if (filter.pageSize) params.append("pageSize", filter.pageSize.toString());
            if (filter.sortBy) params.append("sortBy", filter.sortBy);
            if (filter.sortOrder) params.append("sortOrder", filter.sortOrder);

            // Append query string to URL if there are params
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            this.logger.info(`Fetching products: GET ${url}`);
            
            // Make direct Axios request like in getAll
            const response = await axios.get(url);
            
            // Check if response is an array (unstructured response) or has expected fields
            const products = Array.isArray(response.data) ? response.data : (response.data.items || []);
            
            // Create a proper response object
            const result: ProductListResponse = {
                items: products,
                total: Array.isArray(response.data) ? products.length : (response.data.total || products.length),
                page: Array.isArray(response.data) ? 1 : (response.data.page || 1),
                pageSize: Array.isArray(response.data) ? products.length : (response.data.pageSize || 10),
                totalPages: Array.isArray(response.data) ? 1 : (response.data.totalPages || 1)
            };
            
            // Log the response data for debugging
            this.logger.info('Products API response:', {
                total: result.total,
                page: result.page,
                count: result.items?.length || 0
            });
            
            return result;
        } catch (error) {
            this.logger.error('Failed to fetch products:', error);
            // Return an empty response to avoid null errors
            return {
                items: [],
                total: 0,
                page: 1,
                pageSize: 10,
                totalPages: 0
            };
        }
    }

    async getProductById(id: string): Promise<ProductDto | null> {
        try {
            this.logger.info(`Fetching product with id ${id}`);
            const response = await axios.get<ProductDto>(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to fetch product with id ${id}:`, error);
            return null;
        }
    }

    async getProductsByIds(ids: string[]): Promise<ProductDto[]> {
        try {
            // Try to fetch products individually since we don't have a batch endpoint
            this.logger.info(`Fetching multiple products by ids: ${ids.join(', ')}`);
            const promises = ids.map(id => this.getProductById(id));
            const products = await Promise.all(promises);
            return products.filter(product => product !== null) as ProductDto[];
        } catch (error) {
            this.logger.error('Failed to fetch products by ids:', error);
            return [];
        }
    }

    async createProduct(product: Omit<ProductDto, 'id'>): Promise<ProductDto> {
        try {
            this.logger.info('Creating product:', product);
            const response = await axios.post<ProductDto>(this.baseUrl, product);
            return response.data;
        } catch (error) {
            this.logger.error('Failed to create product:', error);
            throw error;
        }
    }

    async updateProduct(id: string, product: Partial<ProductDto>): Promise<ProductDto> {
        try {
            this.logger.info(`Updating product ${id}:`, product);
            const response = await axios.put<ProductDto>(`${this.baseUrl}/${id}`, product);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to update product with id ${id}:`, error);
            throw error;
        }
    }

    async deleteProduct(id: string): Promise<boolean> {
        try {
            this.logger.info(`Deleting product ${id}`);
            await axios.delete(`${this.baseUrl}/${id}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete product with id ${id}:`, error);
            return false;
        }
    }

    // Helper method to map DTO to domain model
    private mapDtoToModel(dto: ProductDto): Product {
        return {
            id: dto.id || dto.productId || '',
            name: dto.name,
            description: dto.description,
            price: dto.price,
            imageUrl: dto.imageUrl || '',
            category: dto.category || dto.type || '',
            inStock: dto.inStock || (dto.inventory && dto.inventory > 0) || false
        };
    }
} 