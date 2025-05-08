import { InputType, OutputType } from '../../../types/model.types';

/**
 * Model data transfer object for communication between layers
 */
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

/**
 * Request interface for filtering models
 */
export interface ModelFilterRequest {
  inputType?: InputType;
  outputType?: OutputType;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

/**
 * Response interface for model listings
 */
export interface ModelListResponse {
  models: ModelDto[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Model test request containing input data
 */
export interface ModelTestRequest {
  modelId: string;
  inputData: any;
}

/**
 * Model test response with output data
 */
export interface ModelTestResponse {
  outputData: any;
  processingTime?: number;
} 