import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IModelRepository } from '../../repositories/model.repository.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import { IStartModelUseCase } from '../interfaces/start-model.usecase.interface';

@injectable()
export class StartModelUseCase implements IStartModelUseCase {
    constructor(
        @inject(TYPES.ModelRepository) private readonly modelRepository: IModelRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {}

    async execute(modelId: string): Promise<void> {
        try {
            this.logger.info(`Executing StartModelUseCase for model: ${modelId}`);
            await this.modelRepository.startModel(modelId);
            this.logger.info(`Successfully started model: ${modelId}`);
        } catch (error) {
            this.logger.error(`Error in StartModelUseCase for model: ${modelId}`, error);
            throw error;
        }
    }
} 