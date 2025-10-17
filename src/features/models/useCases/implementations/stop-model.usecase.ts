import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IModelRepository } from '../../repositories/model.repository.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import { IStopModelUseCase } from '../interfaces/stop-model.usecase.interface';

@injectable()
export class StopModelUseCase implements IStopModelUseCase {
    constructor(
        @inject(TYPES.ModelRepository) private readonly modelRepository: IModelRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {}

    async execute(modelId: string): Promise<void> {
        try {
            this.logger.info(`Executing StopModelUseCase for model: ${modelId}`);
            await this.modelRepository.stopModel(modelId);
            this.logger.info(`Successfully stopped model: ${modelId}`);
        } catch (error) {
            this.logger.error(`Error in StopModelUseCase for model: ${modelId}`, error);
            throw error;
        }
    }
} 