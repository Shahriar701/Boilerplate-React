import { injectable, inject } from 'inversify';
import { TYPES } from '../../../app/config/types';
import { IUseCase } from './UseCase.interface';
import { IProductRepository } from '../repositories/product.repository.interface';
import { ILoggerService } from '../../../infrastructure/logging/logger.interface';
import { ProductDto } from '../models/product.dto';

@injectable()
export class GetProductByIdUseCase implements IUseCase<string, ProductDto | null> {
    constructor(
        @inject(TYPES.ProductRepository) private readonly productRepository: IProductRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {}

    async execute(productId: string): Promise<ProductDto | null> {
        try {
            this.logger.info(`Executing GetProductByIdUseCase for id: ${productId}`);
            return await this.productRepository.getProductById(productId);
        } catch (error) {
            this.logger.error(`Error in GetProductByIdUseCase for id: ${productId}`, error);
            return null;
        }
    }
} 