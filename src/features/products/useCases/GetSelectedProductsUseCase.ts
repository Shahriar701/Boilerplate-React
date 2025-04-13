import { injectable, inject } from 'inversify';
import { TYPES } from '../../../app/config/types';
import { IUseCase } from './UseCase.interface';
import { IProductRepository } from '../repositories/product.repository.interface';
import { ILoggerService } from '../../../infrastructure/logging/logger.interface';
import { ProductDto } from '../models/product.dto';

@injectable()
export class GetSelectedProductsUseCase implements IUseCase<string[], ProductDto[]> {
    constructor(
        @inject(TYPES.ProductRepository) private readonly productRepository: IProductRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    async execute(productIds: string[]): Promise<ProductDto[]> {
        try {
            if (!productIds || productIds.length === 0) {
                this.logger.info('GetSelectedProductsUseCase: No product IDs provided, returning empty array');
                return [];
            }

            this.logger.info(`Executing GetSelectedProductsUseCase for ${productIds.length} products`);
            return await this.productRepository.getProductsByIds(productIds);
        } catch (error) {
            this.logger.error('Error in GetSelectedProductsUseCase', error);
            throw error;
        }
    }
} 