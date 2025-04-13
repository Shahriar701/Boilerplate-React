import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IProductRepository } from '../product.repository.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import { ProductDto, ProductFilterRequest, ProductListResponse } from '../../models/product.dto';

/**
 * A mock repository that returns fake product data
 */
@injectable()
export class ProductMockRepository implements IProductRepository {
    private products: ProductDto[] = [];

    constructor(
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {
        // Generate some mock products
        this.generateMockProducts();
    }

    private generateMockProducts(): void {
        // Generate 20 mock products
        for (let i = 1; i <= 20; i++) {
            this.products.push({
                id: `prod-${i}`,
                name: `Product ${i}`,
                description: `This is a description for product ${i}`,
                price: Math.round(Math.random() * 100 * 100) / 100,
                imageUrl: `https://via.placeholder.com/150?text=Product${i}`,
                category: i % 3 === 0 ? 'Electronics' : (i % 2 === 0 ? 'Clothing' : 'Home'),
                inStock: i % 4 !== 0,
                createdAt: new Date().toISOString()
            });
        }
    }

    async getProducts(filter: ProductFilterRequest): Promise<ProductListResponse> {
        this.logger.info('Getting mock products', filter);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const page = filter.page || 1;
        const pageSize = filter.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        let filteredProducts = [...this.products];

        // Apply any filters if needed
        if (filter.category) {
            filteredProducts = filteredProducts.filter(p => p.category === filter.category);
        }

        if (filter.inStock !== undefined) {
            filteredProducts = filteredProducts.filter(p => p.inStock === filter.inStock);
        }

        // Apply pagination
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        this.logger.info(`Returning ${paginatedProducts.length} mock products`);

        return {
            items: paginatedProducts,
            total: filteredProducts.length,
            page,
            pageSize,
            totalPages: Math.ceil(filteredProducts.length / pageSize)
        };
    }

    async getProductById(id: string): Promise<ProductDto | null> {
        this.logger.info(`Getting mock product by id: ${id}`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const product = this.products.find(p => p.id === id) || null;

        if (!product) {
            this.logger.error(`Product not found: ${id}`);
        }

        return product;
    }

    async getProductsByIds(ids: string[]): Promise<ProductDto[]> {
        this.logger.info(`Getting mock products by ids: ${ids.join(', ')}`);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const products = this.products.filter(p => ids.includes(p.id));
        
        this.logger.info(`Found ${products.length} products`);
        
        return products;
    }

    async createProduct(product: Omit<ProductDto, 'id'>): Promise<ProductDto> {
        this.logger.info('Creating mock product');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newProduct: ProductDto = {
            ...product,
            id: `prod-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        
        this.products.push(newProduct);
        
        this.logger.info('Product created successfully');
        return newProduct;
    }

    async updateProduct(id: string, product: Partial<ProductDto>): Promise<ProductDto> {
        this.logger.info(`Updating mock product with id: ${id}`);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            this.logger.error(`Product not found: ${id}`);
            throw new Error(`Product not found: ${id}`);
        }
        
        const updatedProduct = {
            ...this.products[index],
            ...product
        };
        
        this.products[index] = updatedProduct;
        
        this.logger.info('Product updated successfully');
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<boolean> {
        this.logger.info(`Deleting mock product with id: ${id}`);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            this.logger.error(`Product not found: ${id}`);
            return false;
        }
        
        this.products.splice(index, 1);
        
        this.logger.info('Product deleted successfully');
        return true;
    }
} 