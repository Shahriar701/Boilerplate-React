import { injectable, inject } from 'inversify';
import { IGetModelByIdUseCase } from '../interfaces/get-model-by-id.usecase.interface';
import { IModelService } from '../../services/model.service.interface';
import { ModelDto } from '../../models/model.dto';
import { TYPES } from '../../../../app/config/types';

@injectable()
export class GetModelByIdUseCase implements IGetModelByIdUseCase {
  constructor(
    @inject(TYPES.ModelService) private modelService: IModelService
  ) {}

  /**
   * Execute the use case to retrieve a model by ID
   * @param id The unique identifier of the model to retrieve
   */
  async execute(id: string): Promise<ModelDto | null> {
    return await this.modelService.getModelById(id);
  }
} 