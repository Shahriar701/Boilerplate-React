import { injectable, inject } from 'inversify';
import { IModelRepository } from '../model.repository.interface';
import { ModelDto, ModelFilterRequest, ModelListResponse } from '../../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../../types/model.types';
import { IHttpClient } from '../../../../adapters/api/http-client.interface';
import { TYPES } from '../../../../app/config/types';

@injectable()
export class ModelApiRepository implements IModelRepository {
  constructor(
    @inject(TYPES.HttpClient) private httpClient: IHttpClient
  ) {}

  async getModels(filter?: ModelFilterRequest): Promise<ModelListResponse> {
    return await this.httpClient.get<ModelListResponse>(
      '/api/models',
      filter as Record<string, any>
    );
  }

  async getModelById(id: string): Promise<ModelDto | null> {
    try {
      return await this.httpClient.get<ModelDto>(`/api/models/${id}`);
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async testModel(modelId: string, inputData: ModelInputData): Promise<ModelOutputData> {
    return await this.httpClient.post<ModelOutputData>(
      `/api/models/${modelId}/test`,
      { inputData }
    );
  }

  async getModelTestHistory(modelId: string): Promise<any[]> {
    return await this.httpClient.get<any[]>(`/api/models/${modelId}/history`);
  }
} 