import { Model, ModelInputData, ModelOutputData } from '../types/model.types';

// Model data based on your backend MODEL_DATABASE
const AVAILABLE_MODELS: Model[] = [
  {
    id: 'depth-anything-v2',
    name: 'Depth Anything V2',
    description: 'A depth estimation model based on 2D images.',
    accuracy: 94.2,
    lastTested: new Date().toISOString().split('T')[0],
    imageUrl: 'https://via.placeholder.com/300x200?text=Depth+Estimation',
    inputType: 'image',
    outputType: 'image',
    details: {
      framework: 'PyTorch',
      version: '1.0.0',
      size: '2GB',
      type: 'Depth Estimation CNN',
      created: '2024-01-15',
      author: 'Neuraverse AI Team'
    }
  },
  {
    id: 'yolo-v11',
    name: 'YOLO Object Detection V11',
    description: 'A object detection model based on 2D images.',
    accuracy: 91.8,
    lastTested: new Date().toISOString().split('T')[0],
    imageUrl: 'https://via.placeholder.com/300x200?text=Object+Detection',
    inputType: 'image',
    outputType: 'image',
    details: {
      framework: 'Ultralytics',
      version: '1.0.0',
      size: '1.5GB',
      type: 'YOLO CNN',
      created: '2024-01-20',
      author: 'Neuraverse AI Team'
    }
  },
  {
    id: 'depth-anything-v2-grpc',
    name: 'Depth Anything V2 (gRPC)',
    description: 'A depth estimation model based on 2D images with gRPC interface.',
    accuracy: 94.2,
    lastTested: new Date().toISOString().split('T')[0],
    imageUrl: 'https://via.placeholder.com/300x200?text=Depth+Estimation+gRPC',
    inputType: 'image',
    outputType: 'image',
    details: {
      framework: 'PyTorch + gRPC',
      version: '1.0.0',
      size: '2GB',
      type: 'Depth Estimation CNN (gRPC)',
      created: '2024-01-25',
      author: 'Neuraverse AI Team'
    }
  }
];

export class ModelsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  // Helper method to get authentication headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Get token from localStorage (where AuthContext stores it)
    const token = localStorage.getItem('ml_platform_token');
    const user = localStorage.getItem('ml_platform_user');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Including bearer token in API request');
      
      if (user) {
        try {
          const userData = JSON.parse(user);
          console.log(`👤 User: ${userData.name} (${userData.id})`);
          console.log(`🏷️  Expected instance suffix: ${userData.id}`);
        } catch (e) {
          console.warn('Could not parse user data:', e);
        }
      }
    } else {
      console.log('🔓 No auth token found, using anonymous mode');
    }

    return headers;
  }

  async getModels(): Promise<Model[]> {
    try {
      // returning the static model data for now
      return AVAILABLE_MODELS;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw new Error('Failed to fetch models');
    }
  }

  async getModelById(id: string): Promise<Model | null> {
    try {
      const model = AVAILABLE_MODELS.find(m => m.id === id);
      return model || null;
    } catch (error) {
      console.error(`Error fetching model ${id}:`, error);
      throw new Error(`Failed to fetch model ${id}`);
    }
  }

  async registerModel(modelId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to register model: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error registering model ${modelId}:`, error);
      throw error;
    }
  }

  async startModel(modelId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}/start`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to start model: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error starting model ${modelId}:`, error);
      throw error;
    }
  }

  async stopModel(modelId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}/stop`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to stop model: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error stopping model ${modelId}:`, error);
      throw error;
    }
  }

  async getModelStatus(modelId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}/status`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get model status: ${response.statusText}`);
      }

      const statusResponse = await response.json();
      console.log('Full status response:', statusResponse); // Debug log
      
      // Extract the status field from the ModelStatus object
      return statusResponse.status || 'NOT_FOUND';
    } catch (error) {
      console.error(`Error getting model status ${modelId}:`, error);
      throw error;
    }
  }

  async invokeModel(modelId: string, inputData: ModelInputData): Promise<ModelOutputData> {
    try {
      // Convert input data to the format expected by your backend
      let requestBody: any = {};

      if ('imageUrl' in inputData) {
        let imageData: string;
        
        // Check if we have a meaningful imageUrl or if we should use the file
        if (inputData.imageUrl && inputData.imageUrl.trim() !== '') {
          if (inputData.imageUrl.startsWith('data:')) {
            // Extract base64 part from data URL (remove "data:image/...;base64," prefix)
            imageData = inputData.imageUrl.split(',')[1];
          } else if (inputData.imageUrl.startsWith('blob:')) {
            // Handle blob URLs by converting to base64
            if (inputData.file) {
              // If we have the original file, convert it to base64
              imageData = await this.fileToBase64(inputData.file);
            } else {
              // If we only have the blob URL, fetch and convert it
              const response = await fetch(inputData.imageUrl);
              const blob = await response.blob();
              imageData = await this.blobToBase64(blob);
            }
          } else {
            // If it's already just base64, use as is
            imageData = inputData.imageUrl;
          }
        } else if (inputData.file) {
          // No meaningful imageUrl, but we have a file - convert file to base64
          imageData = await this.fileToBase64(inputData.file);
        } else {
          throw new Error('No image data provided - need either imageUrl or file');
        }
        
        requestBody = { image: imageData };
      } else if ('text' in inputData) {
        requestBody = { text: inputData.text };
      } else if ('audioUrl' in inputData) {
        requestBody = { audio: inputData.audioUrl };
      } else if ('data' in inputData) {
        requestBody = inputData.data;
      }

      console.log('Sending request body:', { ...requestBody, image: requestBody.image ? `[base64 data ${requestBody.image.length} chars]` : undefined });

      const response = await fetch(`${this.baseUrl}/models/${modelId}/invoke`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to invoke model: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Convert backend response to frontend format
      return this.convertBackendResponse(modelId, result);
    } catch (error) {
      console.error(`Error invoking model ${modelId}:`, error);
      throw error;
    }
  }

  // Helper method to convert File to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extract base64 part (remove data URL prefix)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Helper method to convert Blob to base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extract base64 part (remove data URL prefix)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Convert backend response to frontend ModelOutputData format
  private convertBackendResponse(modelId: string, backendResponse: any): ModelOutputData {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    
    if (!model) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    switch (model.outputType) {
      case 'image':
        if (modelId === 'yolo-v11') {
          const annotations = backendResponse.boxes?.map((box: any, index: number) => ({
            id: index + 1,
            label: box.class,
            confidence: box.confidence,
            x: box.x - box.width / 2, // Convert center to top-left
            y: box.y - box.height / 2,
            width: box.width,
            height: box.height,
          })) || [];

          return {
            imageUrl: `data:image/jpeg;base64,${backendResponse.image}`,
            annotations,
          };
        } else {
          return {
            imageUrl: `data:image/png;base64,${backendResponse.image}`,
          };
        }
      
      case 'text':
        return {
          text: backendResponse.text || JSON.stringify(backendResponse, null, 2),
        };
      
      default:
        return backendResponse;
    }
  }

  async deregisterModel(modelId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}/deregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to deregister model: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deregistering model ${modelId}:`, error);
      throw error;
    }
  }
}

export const modelsService = new ModelsService(); 