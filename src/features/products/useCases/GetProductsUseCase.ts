import { injectable, inject } from 'inversify';
import { TYPES } from '../../../app/config/types';
import { IUseCase } from './UseCase.interface';
import { IProductRepository } from '../repositories/product.repository.interface';
import { ILoggerService } from '../../../infrastructure/logging/logger.interface';
import { ProductFilterRequest, ProductListResponse } from '../models/product.dto';

@injectable()
export class GetProductsUseCase implements IUseCase<ProductFilterRequest, ProductListResponse> {
    constructor(
        @inject(TYPES.ProductRepository) private readonly productRepository: IProductRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {}

    async execute(request: ProductFilterRequest): Promise<ProductListResponse> {
        try {
            this.logger.info('Executing GetProductsUseCase', request);
            return await this.productRepository.getProducts(request);
        } catch (error) {
            this.logger.error('Error in GetProductsUseCase', error);
            throw error;
        }
    }
} 