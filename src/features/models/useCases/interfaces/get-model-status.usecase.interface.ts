/**
 * Response structure for model status
 */
export interface ModelStatusResponse {
  status: 'RUNNING' | 'STOPPED' | 'STARTING' | 'STOPPING' | 'PENDING' | 'NOT_FOUND';
  instanceName?: string;
  lastInvocation?: Date;
  created?: Date;
}

/**
 * Use case for getting the status of a model
 */
export interface IGetModelStatusUseCase {
  /**
   * Execute the use case to get model status
   * @param modelId The ID of the model to check status for
   */
  execute(modelId: string): Promise<ModelStatusResponse>;
} 