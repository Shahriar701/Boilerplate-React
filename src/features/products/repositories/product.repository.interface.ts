import { Product, ProductCreationDto, ProductUpdateDto } from "../models/product.model";
import { ProductDto, ProductFilterRequest, ProductListResponse } from "../models/product.dto";

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    getById(id: string): Promise<Product | null>;
    getProducts(filter: ProductFilterRequest): Promise<ProductListResponse>;
    getProductById(id: string): Promise<ProductDto | null>;
    getProductsByIds(ids: string[]): Promise<ProductDto[]>;
    create(product: ProductCreationDto): Promise<Product>;
    update(product: ProductUpdateDto): Promise<Product>;
    delete(id: string): Promise<boolean>;
} 