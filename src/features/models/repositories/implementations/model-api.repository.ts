import { injectable, inject } from 'inversify';
import { IModelRepository } from '../model.repository.interface';
import { ModelDto, ModelFilterRequest, ModelListResponse } from '../../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../../types/model.types';
import { ModelStatusResponse } from '../../useCases/interfaces/get-model-status.usecase.interface';
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

  async getModelStatus(modelId: string): Promise<ModelStatusResponse> {
    const response = await this.httpClient.get<ModelStatusResponse>(`/api/models/${modelId}/status`);
    // Extract the status field if the response has the backend ModelStatus structure
    if (typeof response === 'object' && 'status' in response) {
      return {
        status: response.status,
        instanceName: response.instanceName,
        lastInvocation: response.lastInvocation,
        created: response.created
      };
    }
    // If it's just a string status, wrap it
    return { status: response as any };
  }

  async startModel(modelId: string): Promise<void> {
    await this.httpClient.post<void>(`/api/models/${modelId}/start`);
  }

  async stopModel(modelId: string): Promise<void> {
    await this.httpClient.post<void>(`/api/models/${modelId}/stop`);
  }
} 