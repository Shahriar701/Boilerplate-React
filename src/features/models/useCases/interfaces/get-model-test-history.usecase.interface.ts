import { ModelTestResponse } from '../../models/model.dto';

export interface IGetModelTestHistoryUseCase {
  execute(modelId: string): Promise<ModelTestResponse[]>;
} 