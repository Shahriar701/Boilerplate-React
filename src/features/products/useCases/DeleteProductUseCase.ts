import { injectable, inject } from 'inversify';
import { TYPES } from '../../../app/config/types';
import { IUseCase } from './UseCase.interface';
import { IProductRepository } from '../repositories/product.repository.interface';
import { ILoggerService } from '../../../infrastructure/logging/logger.interface';

@injectable()
export class DeleteProductUseCase implements IUseCase<string, boolean> {
    constructor(
        @inject(TYPES.ProductRepository) private readonly productRepository: IProductRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {}

    async execute(productId: string): Promise<boolean> {
        try {
            this.logger.info(`Executing DeleteProductUseCase for id: ${productId}`);
            return await this.productRepository.deleteProduct(productId);
        } catch (error) {
            this.logger.error(`Error in DeleteProductUseCase for id: ${productId}`, error);
            throw error;
        }
    }
} 