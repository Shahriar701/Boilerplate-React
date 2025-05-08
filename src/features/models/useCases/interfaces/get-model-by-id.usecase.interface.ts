import { ModelDto } from '../../models/model.dto';

/**
 * Use case for retrieving a specific model by its ID
 */
export interface IGetModelByIdUseCase {
  /**
   * Execute the use case to retrieve a model by ID
   * @param id The unique identifier of the model to retrieve
   */
  execute(id: string): Promise<ModelDto | null>;
} 