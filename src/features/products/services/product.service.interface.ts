import { ProductDto, ProductFilterRequest, ProductListResponse, SelectedProductsState } from '../models/product.dto';

export interface IProductService {
    // Product retrieval methods
    getProducts(filter: ProductFilterRequest): Promise<ProductListResponse>;
    getProductById(id: string): Promise<ProductDto | null>;
    getSelectedProducts(ids: string[]): Promise<ProductDto[]>;
    
    // Product management methods (admin)
    createProduct(product: Omit<ProductDto, 'id'>): Promise<ProductDto>;
    updateProduct(id: string, product: Partial<ProductDto>): Promise<ProductDto>;
    deleteProduct(id: string): Promise<boolean>;
    
    // Selection state management
    selectProduct(id: string): void;
    unselectProduct(id: string): void;
    getSelectedProductIds(): string[];
    clearSelectedProducts(): void;
} 