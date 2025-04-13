import { injectable, inject } from 'inversify';
import { TYPES } from '../../../app/config/types';
import { IUseCase } from './UseCase.interface';
import { IProductRepository } from '../repositories/product.repository.interface';
import { ILoggerService } from '../../../infrastructure/logging/logger.interface';
import { ProductDto } from '../models/product.dto';

@injectable()
export class CreateProductUseCase implements IUseCase<Omit<ProductDto, 'id'>, ProductDto> {
    constructor(
        @inject(TYPES.ProductRepository) private readonly productRepository: IProductRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    async execute(productData: Omit<ProductDto, 'id'>): Promise<ProductDto> {
        try {
            this.logger.info('Executing CreateProductUseCase', productData);
            return await this.productRepository.createProduct(productData);
        } catch (error) {
            this.logger.error('Error in CreateProductUseCase', error);
            throw error;
        }
    }
} 