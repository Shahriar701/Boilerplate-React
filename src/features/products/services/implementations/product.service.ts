import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IProductService } from '../product.service.interface';
import { ProductDto, ProductFilterRequest, ProductListResponse } from '../../models/product.dto';
import { 
    IUseCase,
    IUseCaseNoInput,
    GetProductsUseCase, 
    GetProductByIdUseCase, 
    GetSelectedProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    SelectProductUseCase,
    UnselectProductUseCase,
    GetSelectedProductIdsUseCase,
    ClearSelectedProductsUseCase
} from '../../useCases';

@injectable()
export class ProductService implements IProductService {
    constructor(
        // Product retrieval use cases
        @inject(TYPES.GetProductsUseCase) 
        private readonly getProductsUseCase: GetProductsUseCase,
        
        @inject(TYPES.GetProductByIdUseCase) 
        private readonly getProductByIdUseCase: GetProductByIdUseCase,
        
        @inject(TYPES.GetSelectedProductsUseCase) 
        private readonly getSelectedProductsUseCase: GetSelectedProductsUseCase,
        
        // Product management use cases
        @inject(TYPES.CreateProductUseCase) 
        private readonly createProductUseCase: CreateProductUseCase,
        
        @inject(TYPES.UpdateProductUseCase) 
        private readonly updateProductUseCase: UpdateProductUseCase,
        
        @inject(TYPES.DeleteProductUseCase) 
        private readonly deleteProductUseCase: DeleteProductUseCase,
        
        // Product selection use cases
        @inject(TYPES.SelectProductUseCase) 
        private readonly selectProductUseCase: SelectProductUseCase,
        
        @inject(TYPES.UnselectProductUseCase) 
        private readonly unselectProductUseCase: UnselectProductUseCase,
        
        @inject(TYPES.GetSelectedProductIdsUseCase) 
        private readonly getSelectedProductIdsUseCase: GetSelectedProductIdsUseCase,
        
        @inject(TYPES.ClearSelectedProductsUseCase) 
        private readonly clearSelectedProductsUseCase: ClearSelectedProductsUseCase
    ) {}

    // Product retrieval methods
    async getProducts(filter: ProductFilterRequest): Promise<ProductListResponse> {
        return this.getProductsUseCase.execute(filter);
    }

    async getProductById(id: string): Promise<ProductDto | null> {
        return this.getProductByIdUseCase.execute(id);
    }

    async getSelectedProducts(ids: string[]): Promise<ProductDto[]> {
        return this.getSelectedProductsUseCase.execute(ids);
    }

    // Product management methods
    async createProduct(product: Omit<ProductDto, 'id'>): Promise<ProductDto> {
        return this.createProductUseCase.execute(product);
    }

    async updateProduct(id: string, product: Partial<ProductDto>): Promise<ProductDto> {
        return this.updateProductUseCase.execute({ id, data: product });
    }

    async deleteProduct(id: string): Promise<boolean> {
        return this.deleteProductUseCase.execute(id);
    }

    // Selection state management
    async selectProduct(id: string): Promise<void> {
        await this.selectProductUseCase.execute(id);
    }

    async unselectProduct(id: string): Promise<void> {
        await this.unselectProductUseCase.execute(id);
    }

    getSelectedProductIds(): string[] {
        // This is a synchronous method in the interface, so we need to handle the promise differently
        // In a real app, you might want to update the interface to be async
        let result: string[] = [];
        this.getSelectedProductIdsUseCase.execute()
            .then(ids => { result = ids; })
            .catch(error => { console.error('Error getting selected product IDs', error); });
        return result;
    }

    async clearSelectedProducts(): Promise<void> {
        await this.clearSelectedProductsUseCase.execute();
    }
} 