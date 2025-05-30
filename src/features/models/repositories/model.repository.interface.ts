import { ModelDto, ModelFilterRequest, ModelListResponse, ModelTestRequest, ModelTestResponse } from '../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../types/model.types';
import { ModelStatusResponse } from '../useCases/interfaces/get-model-status.usecase.interface';

/**
 * Interface for model repository operations
 */
export interface IModelRepository {
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

  /**
   * Get the status of a model instance
   */
  getModelStatus(modelId: string): Promise<ModelStatusResponse>;

  /**
   * Start a model instance
   */
  startModel(modelId: string): Promise<void>;

  /**
   * Stop a model instance
   */
  stopModel(modelId: string): Promise<void>;
} 