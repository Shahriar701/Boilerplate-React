/**
 * Use case for starting a model instance
 */
export interface IStartModelUseCase {
  /**
   * Execute the use case to start a model
   * @param modelId The ID of the model to start
   */
  execute(modelId: string): Promise<void>;
} 