import { injectable, inject } from 'inversify';
import { TYPES } from '../../../app/config/types';
import { IUseCase } from './UseCase.interface';
import { IProductRepository } from '../repositories/product.repository.interface';
import { ILoggerService } from '../../../infrastructure/logging/logger.interface';
import { ProductDto } from '../models/product.dto';

interface UpdateProductRequest {
    id: string;
    data: Partial<ProductDto>;
}

@injectable()
export class UpdateProductUseCase implements IUseCase<UpdateProductRequest, ProductDto> {
    constructor(
        @inject(TYPES.ProductRepository) private readonly productRepository: IProductRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {}

    async execute(request: UpdateProductRequest): Promise<ProductDto> {
        try {
            this.logger.info(`Executing UpdateProductUseCase for id: ${request.id}`, request.data);
            return await this.productRepository.updateProduct(request.id, request.data);
        } catch (error) {
            this.logger.error(`Error in UpdateProductUseCase for id: ${request.id}`, error);
            throw error;
        }
    }
} 