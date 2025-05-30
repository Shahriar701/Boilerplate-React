import { injectable, inject } from 'inversify';
import { IModelRepository } from '../model.repository.interface';
import { ModelDto, ModelFilterRequest, ModelListResponse } from '../../models/model.dto';
import { ModelInputData, ModelOutputData, isImageInput, isTextInput, isAudioInput, isImageOutput, isTextOutput, isAudioOutput } from '../../../../types/model.types';
import { ModelStatusResponse } from '../../useCases/interfaces/get-model-status.usecase.interface';
import { IHttpClient } from '../../../../adapters/api/http-client.interface';
import { TYPES } from '../../../../app/config/types';

@injectable()
export class ModelHybridRepository implements IModelRepository {
  private realModels: ModelDto[] = [
    {
      id: 'depth-anything-v2',
      name: 'Depth Anything V2',
      description: 'A depth estimation model based on 2D images.',
      accuracy: 94.2,
      lastTested: '2023-12-15',
      imageUrl: 'https://via.placeholder.com/300x200?text=Depth+Estimation',
      inputType: 'image',
      outputType: 'image',
      details: {
        framework: 'PyTorch',
        version: '1.0.0',
        size: '145MB',
        type: 'Computer Vision',
        created: '2023-11-20',
        author: 'Neuraverse Team'
      }
    },
    {
      id: 'depth-anything-v2-grpc',
      name: 'Depth Anything V2 (gRPC)',
      description: 'A depth estimation model based on 2D images with gRPC interface.',
      accuracy: 94.2,
      lastTested: '2023-12-15',
      imageUrl: 'https://via.placeholder.com/300x200?text=Depth+gRPC',
      inputType: 'image',
      outputType: 'image',
      details: {
        framework: 'PyTorch',
        version: '1.0.0',
        size: '145MB',
        type: 'Computer Vision (gRPC)',
        created: '2023-11-20',
        author: 'Neuraverse Team'
      }
    },
    {
      id: 'yolo-v11',
      name: 'YOLO Object Detection V11',
      description: 'An object detection model based on 2D images.',
      accuracy: 92.8,
      lastTested: '2023-12-14',
      imageUrl: 'https://via.placeholder.com/300x200?text=Object+Detection',
      inputType: 'image',
      outputType: 'image',
      details: {
        framework: 'PyTorch',
        version: '1.0.0',
        size: '120MB',
        type: 'Object Detection',
        created: '2023-11-18',
        author: 'Neuraverse Team'
      }
    }
  ];

  constructor(
    @inject(TYPES.HttpClient) private httpClient: IHttpClient
  ) {}

  // Mock implementation for listing models
  async getModels(filter?: ModelFilterRequest): Promise<ModelListResponse> {
    await this.delay(800);
    
    let filteredModels = [...this.realModels];
    
    if (filter) {
      if (filter.inputType) {
        filteredModels = filteredModels.filter(model => model.inputType === filter.inputType);
      }
      
      if (filter.outputType) {
        filteredModels = filteredModels.filter(model => model.outputType === filter.outputType);
      }
      
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        filteredModels = filteredModels.filter(model => 
          model.name.toLowerCase().includes(searchTerm) || 
          model.description.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    const page = filter?.page || 1;
    const limit = filter?.limit || filteredModels.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedModels = filteredModels.slice(startIndex, endIndex);
    
    return {
      models: paginatedModels,
      total: filteredModels.length,
      page,
      limit
    };
  }

  async getModelById(id: string): Promise<ModelDto | null> {
    await this.delay(400);
    const model = this.realModels.find(model => model.id === id);
    return model || null;
  }

  async testModel(modelId: string, inputData: ModelInputData): Promise<ModelOutputData> {
    const backendModels = ['depth-anything-v2', 'depth-anything-v2-grpc', 'yolo-v11'];
    
    if (!backendModels.includes(modelId)) {
      throw new Error(`Model ${modelId} not found or not available`);
    }
    
    if (!isImageInput(inputData) || !inputData.file) {
      throw new Error('Invalid input data for this model - image file required');
    }
    
    try {
      console.log(`Making real API call for model: ${modelId}`);
      console.log('Input file type:', inputData.file.type);
      console.log('Input file size:', inputData.file.size);
      
      const base64Image = await this.fileToBase64(inputData.file);
      console.log('Image converted to base64, length:', base64Image.length);
      
      const payload = {
        image: base64Image
      };
      
      console.log('Making API call to:', `/models/${modelId}/invoke`);
      
      const response = await this.httpClient.post<any>(`/models/${modelId}/invoke`, payload);
      
      console.log('Backend response received:', response);
      console.log('Response type:', typeof response);
      
      if (response && typeof response === 'object') {
        if (response.image_url || response.output_image || response.result) {
          console.log('Found image URL in response');
          return {
            imageUrl: response.image_url || response.output_image || response.result,
            processingTime: response.processing_time || 2.5,
            confidence: response.confidence || 0.94,
            metadata: {
              modelId: modelId,
              modelVersion: '1.0.0',
              timestamp: new Date().toISOString(),
              inputFormat: 'image',
              outputFormat: modelId.includes('depth') ? 'depth_map' : 'annotated_image'
            },
            annotations: response.annotations || (modelId.includes('yolo') ? [
              { id: 1, label: 'Object', confidence: 0.95, x: 100, y: 100, width: 150, height: 120 }
            ] : undefined)
          };
        }
        
        if (response instanceof Blob || response instanceof ArrayBuffer) {
          console.log('Response is blob/arraybuffer, creating object URL');
          const imageUrl = URL.createObjectURL(new Blob([response]));
          return {
            imageUrl,
            processingTime: 2.5,
            confidence: 0.94,
            metadata: {
              modelId: modelId,
              modelVersion: '1.0.0',
              timestamp: new Date().toISOString(),
              inputFormat: 'image',
              outputFormat: modelId.includes('depth') ? 'depth_map' : 'processed_image'
            }
          };
        }
        
        if (response.image && typeof response.image === 'string') {
          console.log('Found base64 image in response');
          const imageUrl = response.image.startsWith('data:') 
            ? response.image 
            : `data:image/png;base64,${response.image}`;
          return {
            imageUrl,
            processingTime: response.processing_time || 2.5,
            confidence: response.confidence || 0.94,
            metadata: {
              modelId: modelId,
              modelVersion: '1.0.0',
              timestamp: new Date().toISOString(),
              inputFormat: 'image',
              outputFormat: modelId.includes('depth') ? 'depth_map' : 'annotated_image'
            }
          };
        }
        
        if (typeof response === 'string' && (response.startsWith('data:') || response.length > 100)) {
          console.log('Response is direct base64 string');
          const imageUrl = response.startsWith('data:') 
            ? response 
            : `data:image/png;base64,${response}`;
          return {
            imageUrl,
            processingTime: 2.5,
            confidence: 0.94,
            metadata: {
              modelId: modelId,
              modelVersion: '1.0.0',
              timestamp: new Date().toISOString(),
              inputFormat: 'image',
              outputFormat: modelId.includes('depth') ? 'depth_map' : 'processed_image'
            }
          };
        }
      }
      
      console.warn('Unexpected backend response format:', response);
      console.warn('Response keys:', Object.keys(response || {}));
      throw new Error(`Unexpected response format from backend model. Response: ${JSON.stringify(response)}`);
      
    } catch (error) {
      console.error('Error calling real backend model:', error);
      
      if (error instanceof Error && (error.message.includes('503') || error.message.includes('not running'))) {
        throw new Error('Model is not running. Please start the model first and try again.');
      }
      
      if (error instanceof Error) {
        throw new Error(`Backend API error: ${error.message}`);
      }
      
      throw error;
    }
  }

  async getModelTestHistory(modelId: string): Promise<any[]> {
    await this.delay(600);
    
    const model = await this.getModelById(modelId);
    if (!model) return [];
    
    return [
      {
        id: '1',
        timestamp: '2023-12-15T14:30:00Z',
        accuracy: model.accuracy / 100,
        inputSummary: 'Image uploaded (512x384px)',
        outputSummary: modelId.includes('depth') ? 'Depth map generated' : 'Object detection completed'
      }
    ];
  }

  async getModelStatus(modelId: string): Promise<ModelStatusResponse> {
    const backendModels = ['depth-anything-v2', 'depth-anything-v2-grpc', 'yolo-v11'];
    
    if (!backendModels.includes(modelId)) {
      throw new Error(`Model ${modelId} not found or not available`);
    }
    
    try {
      const response = await this.httpClient.get<ModelStatusResponse>(`/models/${modelId}/status`);
      if (typeof response === 'object' && 'status' in response) {
        return {
          status: response.status,
          instanceName: response.instanceName,
          lastInvocation: response.lastInvocation,
          created: response.created
        };
      }
      return { status: response as any };
    } catch (error) {
      console.error('Error getting model status:', error);
      return { status: 'NOT_FOUND' };
    }
  }

  async startModel(modelId: string): Promise<void> {
    const backendModels = ['depth-anything-v2', 'depth-anything-v2-grpc', 'yolo-v11'];
    
    if (!backendModels.includes(modelId)) {
      throw new Error(`Model ${modelId} not found or not available`);
    }
    
    await this.httpClient.post<void>(`/models/${modelId}/start`);
  }

  async stopModel(modelId: string): Promise<void> {
    const backendModels = ['depth-anything-v2', 'depth-anything-v2-grpc', 'yolo-v11'];
    
    if (!backendModels.includes(modelId)) {
      throw new Error(`Model ${modelId} not found or not available`);
    }
    
    await this.httpClient.post<void>(`/models/${modelId}/stop`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const dataUrl = event.target.result as string;
          // Extract only the base64 part, removing the "data:image/jpeg;base64," prefix
          const base64 = dataUrl.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to read file as data URL'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      reader.readAsDataURL(file);
    });
  }
} 