import { ModelInputData, ModelOutputData } from '../../../../types/model.types';

/**
 * Request structure for testing a model
 */
export interface TestModelRequest {
  modelId: string;
  inputData: ModelInputData;
}

/**
 * Use case for testing a model with provided input data
 */
export interface ITestModelUseCase {
  /**
   * Execute the use case to test a model with provided input
   * @param request The model ID and input data for testing
   */
  execute(request: TestModelRequest): Promise<ModelOutputData>;
} 