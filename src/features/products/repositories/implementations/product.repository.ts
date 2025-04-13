import axios from 'axios';
import { API_URL } from '../../../../config/constants';
import { Product, ProductCreationDto, ProductUpdateDto } from '../../models/product.model';
import { IProductRepository } from '../product.repository.interface';
import { ProductDto, ProductFilterRequest, ProductListResponse } from '../../models/product.dto';

export class ProductRepository implements IProductRepository {
    private readonly apiUrl = `${API_URL}/products`;

    async getAll(): Promise<Product[]> {
        try {
            const response = await axios.get<Product[]>(this.apiUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    async getById(id: string): Promise<Product | null> {
        try {
            const response = await axios.get<Product>(`${this.apiUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error);
            return null;
        }
    }

    async getProducts(filter: ProductFilterRequest): Promise<ProductListResponse> {
        try {
            const params = {
                ...(filter.category && { category: filter.category }),
                ...(filter.minPrice && { minPrice: filter.minPrice.toString() }),
                ...(filter.maxPrice && { maxPrice: filter.maxPrice.toString() }),
                ...(filter.query && { query: filter.query }),
                ...(filter.page && { page: filter.page.toString() }),
                ...(filter.pageSize && { pageSize: filter.pageSize.toString() }),
                ...(filter.sortBy && { sortBy: filter.sortBy }),
                ...(filter.sortOrder && { sortOrder: filter.sortOrder })
            };

            const response = await axios.get<ProductListResponse>(this.apiUrl, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching products with filters:', error);
            throw error;
        }
    }

    async getProductById(id: string): Promise<ProductDto | null> {
        try {
            const response = await axios.get<ProductDto>(`${this.apiUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product DTO with id ${id}:`, error);
            return null;
        }
    }

    async getProductsByIds(ids: string[]): Promise<ProductDto[]> {
        try {
            // If API supports batch fetching by IDs
            const response = await axios.post<ProductDto[]>(`${this.apiUrl}/batch`, { ids });
            return response.data;
        } catch (error) {
            console.error('Error fetching products by ids:', error);

            // Fallback: fetch products one by one if batch endpoint is not available
            try {
                const promises = ids.map(id => this.getProductById(id));
                const products = await Promise.all(promises);
                return products.filter(product => product !== null) as ProductDto[];
            } catch (innerError) {
                console.error('Error in fallback fetch of products by ids:', innerError);
                return [];
            }
        }
    }

    async create(product: ProductCreationDto): Promise<Product> {
        const response = await axios.post<Product>(this.apiUrl, product);
        return response.data;
    }

    async update(product: ProductUpdateDto): Promise<Product> {
        const response = await axios.put<Product>(`${this.apiUrl}/${product.id}`, product);
        return response.data;
    }

    async delete(id: string): Promise<boolean> {
        try {
            await axios.delete(`${this.apiUrl}/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting product with id ${id}:`, error);
            return false;
        }
    }
} 