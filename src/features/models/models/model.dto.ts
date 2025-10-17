import { InputType, OutputType } from '../../../types/model.types';

export interface ModelDto {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTested: string;
  imageUrl: string;
  inputType: InputType;
  outputType: OutputType;
  details?: {
    framework: string;
    version: string;
    size: string;
    type: string;
    created: string;
    author: string;
  };
}


export interface ModelFilterRequest {
  inputType?: InputType;
  outputType?: OutputType;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface ModelListResponse {
  models: ModelDto[];
  total: number;
  page: number;
  limit: number;
}

export interface ModelTestRequest {
  modelId: string;
  inputData: any;
}

export interface ModelTestResponse {
  outputData: any;
  processingTime?: number;
} 