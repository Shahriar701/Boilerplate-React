import { injectable, inject } from 'inversify';
import { IGetModelTestHistoryUseCase } from '../interfaces/get-model-test-history.usecase.interface';
import { IModelService } from '../../services/model.service.interface';
import { ModelTestResponse } from '../../models/model.dto';
import { TYPES } from '../../../../app/config/types';

@injectable()
export class GetModelTestHistoryUseCase implements IGetModelTestHistoryUseCase {
  constructor(
    @inject(TYPES.ModelService) private modelService: IModelService
  ) {}

  async execute(modelId: string): Promise<ModelTestResponse[]> {
    try {
      return await this.modelService.getModelTestHistory(modelId);
    } catch (error) {
      console.error(`Error getting test history for model ${modelId}:`, error);
      throw error;
    }
  }
} 