import { ModelFilterRequest, ModelListResponse } from '../../models/model.dto';

/**
 * Use case for retrieving a list of models with filtering options
 */
export interface IGetModelsUseCase {
  /**
   * Execute the use case to retrieve models
   * @param filter Optional filters to apply to the model list
   */
  execute(filter?: ModelFilterRequest): Promise<ModelListResponse>;
} 