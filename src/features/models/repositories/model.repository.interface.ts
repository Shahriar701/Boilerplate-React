import { ModelDto, ModelFilterRequest, ModelListResponse, ModelTestRequest, ModelTestResponse } from '../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../types/model.types';
import { ModelStatusResponse } from '../useCases/interfaces/get-model-status.usecase.interface';

export interface IModelRepository {
  getModels(filter?: ModelFilterRequest): Promise<ModelListResponse>;
  getModelById(id: string): Promise<ModelDto | null>;
  testModel(modelId: string, inputData: ModelInputData): Promise<ModelOutputData>;
  getModelTestHistory(modelId: string): Promise<any[]>;
  getModelStatus(modelId: string): Promise<ModelStatusResponse>;
  startModel(modelId: string): Promise<void>;
  stopModel(modelId: string): Promise<void>;
} 