import { injectable } from 'inversify';
import { IModelRepository } from '../model.repository.interface';
import { ModelDto, ModelFilterRequest, ModelListResponse } from '../../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../../types/model.types';
import { ModelStatusResponse } from '../../useCases/interfaces/get-model-status.usecase.interface';

@injectable()
export class ModelMockRepository implements IModelRepository {
  // Mock data matching the actual backend models
  private dummyModels: ModelDto[] = [
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
      description: 'A object detection model based on 2D images.',
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

  async getModels(filter?: ModelFilterRequest): Promise<ModelListResponse> {
    // Simulate network delay
    await this.delay(800);
    
    let filteredModels = [...this.dummyModels];
    
    // Apply filters if provided
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
    
    // Calculate pagination
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
    // Simulate network delay
    await this.delay(800);
    
    const model = this.dummyModels.find(model => model.id === id);
    return model || null;
  }

  async testModel(modelId: string, inputData: ModelInputData): Promise<ModelOutputData> {
    // Simulate network delay with random processing time
    const delay = Math.random() * 2000 + 1000; // Random delay between 1-3 seconds
    await this.delay(delay);
    
    // Get the model to check its output type
    const model = await this.getModelById(modelId);
    if (!model) {
      throw new Error('Model not found');
    }
    
    // All our models are image-to-image models (depth estimation or object detection)
    if (model.outputType === 'image' && 'file' in inputData && inputData.file) {
      // For depth estimation models, return a simulated depth map
      if (model.id.includes('depth')) {
        return {
          imageUrl: 'https://via.placeholder.com/512x384/000080/FFFFFF?text=Depth+Map+Output',
          processingTime: delay / 1000,
          metadata: {
            modelId: model.id,
            inputFormat: 'image',
            outputFormat: 'depth_map',
            resolution: '512x384'
          }
        };
      }
      
      // For object detection models, return annotated image
      if (model.id.includes('yolo')) {
        return {
          imageUrl: 'https://via.placeholder.com/512x384/008000/FFFFFF?text=Objects+Detected',
          annotations: [
            { id: 1, label: 'Person', confidence: 0.97, x: 120, y: 80, width: 200, height: 180 },
            { id: 2, label: 'Car', confidence: 0.88, x: 340, y: 200, width: 100, height: 150 }
          ],
          processingTime: delay / 1000,
          metadata: {
            modelId: model.id,
            inputFormat: 'image',
            outputFormat: 'annotated_image',
            objectsDetected: 2
          }
        };
      }
      
      // Fallback for other image models
      return {
        imageUrl: 'https://via.placeholder.com/512x384/800080/FFFFFF?text=Processed+Image',
        processingTime: delay / 1000,
        metadata: {
          modelId: model.id,
          inputFormat: 'image',
          outputFormat: 'processed_image'
        }
      };
    }
    
    throw new Error('Invalid input data for this model');
  }

  async getModelTestHistory(modelId: string): Promise<any[]> {
    // Simulate network delay
    await this.delay(800);
    
    // Return mock history data
    return [
      {
        id: '1',
        timestamp: '2023-08-15T14:30:00Z',
        inputSummary: 'Image of city street',
        outputSummary: '5 objects detected',
        accuracy: 94.2
      },
      {
        id: '2',
        timestamp: '2023-08-10T09:15:00Z',
        inputSummary: 'Image of forest landscape',
        outputSummary: '8 objects detected',
        accuracy: 91.7
      },
      {
        id: '3',
        timestamp: '2023-08-05T16:45:00Z',
        inputSummary: 'Image of indoor office',
        outputSummary: '12 objects detected',
        accuracy: 93.5
      }
    ];
  }

  // Helper method to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getModelStatus(modelId: string): Promise<ModelStatusResponse> {
    // Simulate network delay
    await this.delay(500);
    
    // Return a mock status - always running for simplicity
    return {
      status: 'RUNNING',
      instanceName: `instance-${modelId}`,
      lastInvocation: new Date(),
      created: new Date()
    };
  }

  async startModel(modelId: string): Promise<void> {
    // Simulate network delay
    await this.delay(1000);
    
    // Mock implementation - just log
    console.log(`Mock: Starting model ${modelId}`);
  }

  async stopModel(modelId: string): Promise<void> {
    // Simulate network delay
    await this.delay(800);
    
    // Mock implementation - just log
    console.log(`Mock: Stopping model ${modelId}`);
  }
} 