import { ModelDto, ModelFilterRequest, ModelListResponse } from '../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../types/model.types';

/**
 * Interface for model service operations
 */
export interface IModelService {
  getModels(filter?: ModelFilterRequest): Promise<ModelListResponse>;
  
  getModelById(id: string): Promise<ModelDto | null>;
  
  testModel(modelId: string, inputData: ModelInputData): Promise<ModelOutputData>;
  
  getModelTestHistory(modelId: string): Promise<any[]>;
} 