import { injectable, inject } from 'inversify';
import { ITestModelUseCase, TestModelRequest } from '../interfaces/test-model.usecase.interface';
import { IModelService } from '../../services/model.service.interface';
import { ModelOutputData } from '../../../../types/model.types';
import { TYPES } from '../../../../app/config/types';

@injectable()
export class TestModelUseCase implements ITestModelUseCase {
  constructor(
    @inject(TYPES.ModelService) private modelService: IModelService
  ) {}

  /**
   * Execute the use case to test a model with provided input
   * @param request The model ID and input data for testing
   */
  async execute(request: TestModelRequest): Promise<ModelOutputData> {
    const { modelId, inputData } = request;
    return await this.modelService.testModel(modelId, inputData);
  }
} 