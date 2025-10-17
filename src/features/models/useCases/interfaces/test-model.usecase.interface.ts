import { ModelInputData, ModelOutputData } from '../../../../types/model.types';

export interface TestModelRequest {
  modelId: string;
  inputData: ModelInputData;
}

export interface ITestModelUseCase {
  execute(request: TestModelRequest): Promise<ModelOutputData>;
} 