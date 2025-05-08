import { injectable } from 'inversify';
import { IModelRepository } from '../model.repository.interface';
import { ModelDto, ModelFilterRequest, ModelListResponse } from '../../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../../types/model.types';

@injectable()
export class ModelMockRepository implements IModelRepository {
  // Dummy data for development
  private dummyModels: ModelDto[] = [
    {
      id: '1',
      name: 'Object Recognition v1',
      description: 'Detects and identifies common objects in images with high accuracy.',
      accuracy: 92.5,
      lastTested: '2023-06-15',
      imageUrl: 'https://via.placeholder.com/300x200?text=Object+Recognition',
      inputType: 'image',
      outputType: 'image',
      details: {
        framework: 'TensorFlow',
        version: '2.0.1',
        size: '125MB',
        type: 'Convolutional Neural Network',
        created: '2023-01-20',
        author: 'AI Research Team'
      }
    },
    {
      id: '2',
      name: 'Sentiment Analysis',
      description: 'Analyzes text to determine sentiment (positive, negative, neutral).',
      accuracy: 88.7,
      lastTested: '2023-07-22',
      imageUrl: 'https://via.placeholder.com/300x200?text=Sentiment+Analysis',
      inputType: 'text',
      outputType: 'text',
      details: {
        framework: 'PyTorch',
        version: '1.8.0',
        size: '86MB',
        type: 'BERT-based Transformer',
        created: '2023-03-15',
        author: 'NLP Division'
      }
    },
    {
      id: '3',
      name: 'Face Detection',
      description: 'Identifies faces in images and videos with bounding boxes.',
      accuracy: 95.3,
      lastTested: '2023-05-30',
      imageUrl: 'https://via.placeholder.com/300x200?text=Face+Detection',
      inputType: 'image',
      outputType: 'image',
      details: {
        framework: 'OpenCV & TensorFlow',
        version: '1.2.0',
        size: '98MB',
        type: 'Cascade Classifier with CNN',
        created: '2023-02-10',
        author: 'Computer Vision Team'
      }
    },
    {
      id: '4',
      name: 'Speech Recognition',
      description: 'Converts spoken language into text with support for multiple languages.',
      accuracy: 90.1,
      lastTested: '2023-08-05',
      imageUrl: 'https://via.placeholder.com/300x200?text=Speech+Recognition',
      inputType: 'audio',
      outputType: 'text',
      details: {
        framework: 'Keras & TensorFlow',
        version: '3.1.2',
        size: '215MB',
        type: 'Recurrent Neural Network',
        created: '2023-05-03',
        author: 'Audio Processing Division'
      }
    },
    {
      id: '5',
      name: 'Image Segmentation',
      description: 'Segments images into multiple parts to understand the content on a pixel level.',
      accuracy: 89.4,
      lastTested: '2023-07-19',
      imageUrl: 'https://via.placeholder.com/300x200?text=Image+Segmentation',
      inputType: 'image',
      outputType: 'image',
      details: {
        framework: 'PyTorch',
        version: '2.1.0',
        size: '167MB',
        type: 'U-Net Architecture',
        created: '2023-04-28',
        author: 'Computer Vision Team'
      }
    },
    {
      id: '6',
      name: 'Pose Estimation',
      description: 'Detects human figures in images and estimates their pose.',
      accuracy: 87.8,
      lastTested: '2023-08-12',
      imageUrl: 'https://via.placeholder.com/300x200?text=Pose+Estimation',
      inputType: 'image',
      outputType: 'image',
      details: {
        framework: 'TensorFlow & MediaPipe',
        version: '1.0.5',
        size: '145MB',
        type: 'BlazePose CNN',
        created: '2023-06-22',
        author: 'Human Dynamics Group'
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
    
    // Generate appropriate mock response based on model output type
    switch (model.outputType) {
      case 'image':
        if ('imageUrl' in inputData) {
          return {
            imageUrl: inputData.imageUrl,
            annotations: [
              { id: 1, label: 'Person', confidence: 0.97, x: 120, y: 80, width: 200, height: 180 },
              { id: 2, label: 'Car', confidence: 0.88, x: 340, y: 200, width: 100, height: 150 },
              { id: 3, label: 'Tree', confidence: 0.76, x: 20, y: 20, width: 100, height: 150 }
            ]
          };
        } else {
          throw new Error('Invalid input data for image model');
        }
      
      case 'text':
        if ('text' in inputData) {
          return {
            text: `Sentiment Analysis Results for: "${inputData.text}"\n\nSentiment: POSITIVE\nConfidence: 89%\n\nHighlighted positive phrases:\n- "really enjoyed"\n- "great experience"\n- "highly recommend"\n\nSuggested actions:\n- Share positive feedback with product team\n- Consider using testimonial in marketing`
          };
        } else {
          throw new Error('Invalid input data for text model');
        }
      
      case 'audio':
        return {
          audioUrl: 'mock-audio-url',
          transcript: "Transcript of the audio:\n\nWelcome to the demonstration of our speech recognition model. This technology can accurately convert spoken language to text in real-time, supporting multiple languages and dialects. The system has been trained on thousands of hours of diverse audio data to ensure high accuracy across different speakers and acoustic environments."
        };
        
      case 'json':
        return {
          analysis: {
            sentiment: 'positive',
            confidence: 0.87,
            entities: ['product', 'service', 'customer']
          }
        };
        
      default:
        return { text: "Model processed the request successfully." };
    }
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
} 