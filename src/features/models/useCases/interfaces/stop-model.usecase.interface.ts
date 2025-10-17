/**
 * Use case for stopping a model instance
 */
export interface IStopModelUseCase {
  /**
   * Execute the use case to stop a model
   * @param modelId The ID of the model to stop
   */
  execute(modelId: string): Promise<void>;
} 