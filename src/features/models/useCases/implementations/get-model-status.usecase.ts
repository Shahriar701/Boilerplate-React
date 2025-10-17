import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IModelRepository } from '../../repositories/model.repository.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import { IGetModelStatusUseCase, ModelStatusResponse } from '../interfaces/get-model-status.usecase.interface';

@injectable()
export class GetModelStatusUseCase implements IGetModelStatusUseCase {
    constructor(
        @inject(TYPES.ModelRepository) private readonly modelRepository: IModelRepository,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {}

    async execute(modelId: string): Promise<ModelStatusResponse> {
        try {
            this.logger.info(`Executing GetModelStatusUseCase for model: ${modelId}`);
            const status = await this.modelRepository.getModelStatus(modelId);
            this.logger.info(`Model ${modelId} status: ${status.status}`);
            return status;
        } catch (error) {
            this.logger.error(`Error in GetModelStatusUseCase for model: ${modelId}`, error);
            // Return NOT_FOUND status instead of throwing to provide graceful degradation
            return { status: 'NOT_FOUND' };
        }
    }
} 