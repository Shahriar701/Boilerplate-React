import { injectable, inject } from 'inversify';
import { IModelService } from '../model.service.interface';
import { IModelRepository } from '../../repositories/model.repository.interface';
import { ModelDto, ModelFilterRequest, ModelListResponse } from '../../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../../types/model.types';
import { TYPES } from '../../../../app/config/types';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';

@injectable()
export class ModelService implements IModelService {
  constructor(
    @inject(TYPES.ModelRepository) private modelRepository: IModelRepository,
    @inject(TYPES.LoggerService) private loggerService: ILoggerService
  ) {}

  async getModels(filter?: ModelFilterRequest): Promise<ModelListResponse> {
    try {
      this.loggerService.info('Getting models with filter', { filter });
      const response = await this.modelRepository.getModels(filter);
      return response;
    } catch (error) {
      this.loggerService.error('Error getting models', { error, filter });
      throw error;
    }
  }

  async getModelById(id: string): Promise<ModelDto | null> {
    try {
      this.loggerService.info('Getting model by ID', { id });
      const model = await this.modelRepository.getModelById(id);
      return model;
    } catch (error) {
      this.loggerService.error('Error getting model by ID', { error, id });
      throw error;
    }
  }

  async testModel(modelId: string, inputData: ModelInputData): Promise<ModelOutputData> {
    try {
      this.loggerService.info('Testing model', { modelId });
      const result = await this.modelRepository.testModel(modelId, inputData);
      return result;
    } catch (error) {
      this.loggerService.error('Error testing model', { error, modelId });
      throw error;
    }
  }

  async getModelTestHistory(modelId: string): Promise<any[]> {
    try {
      this.loggerService.info('Getting model test history', { modelId });
      const history = await this.modelRepository.getModelTestHistory(modelId);
      return history;
    } catch (error) {
      this.loggerService.error('Error getting model test history', { error, modelId });
      throw error;
    }
  }
} 