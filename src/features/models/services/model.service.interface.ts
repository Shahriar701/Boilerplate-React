import { ModelDto, ModelFilterRequest, ModelListResponse } from '../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../types/model.types';

/**
 * Interface for model service operations
 */
export interface IModelService {
  /**
   * Get a list of models based on filter criteria
   */
  getModels(filter?: ModelFilterRequest): Promise<ModelListResponse>;
  
  /**
   * Get a single model by ID
   */
  getModelById(id: string): Promise<ModelDto | null>;
  
  /**
   * Run a test on the specified model with provided input data
   */
  testModel(modelId: string, inputData: ModelInputData): Promise<ModelOutputData>;
  
  /**
   * Get the test history for a specific model
   */
  getModelTestHistory(modelId: string): Promise<any[]>;
} 