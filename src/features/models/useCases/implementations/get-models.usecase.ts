import { injectable, inject } from 'inversify';
import { IGetModelsUseCase } from '../interfaces/get-models.usecase.interface';
import { IModelService } from '../../services/model.service.interface';
import { ModelFilterRequest, ModelListResponse } from '../../models/model.dto';
import { TYPES } from '../../../../app/config/types';

@injectable()
export class GetModelsUseCase implements IGetModelsUseCase {
  constructor(
    @inject(TYPES.ModelService) private modelService: IModelService
  ) {}

  /**
   * Execute the use case to retrieve models
   * @param filter Optional filters to apply to the model list
   */
  async execute(filter?: ModelFilterRequest): Promise<ModelListResponse> {
    return await this.modelService.getModels(filter);
  }
} 