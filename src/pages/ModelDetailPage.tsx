import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ModelInput from '../components/inputs/ModelInput';
import ModelOutput from '../components/outputs/ModelOutput';
import LoginPromptModal from '../components/LoginPromptModal';
import { useAuth } from '../contexts/AuthContext';
import { 
  ModelInputData, 
  ModelOutputData,
  InputType,
  OutputType
} from '../types/model.types';
import '../styles/model-detail.css';

// Interface for model data
interface Model {
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

// Dummy data - in a real application, this would come from an API
const dummyModels: Record<string, Model> = {
  '1': {
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
  '2': {
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
  '3': {
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
  '4': {
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
  '5': {
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
  '6': {
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
  },
};

// Mock function to simulate model processing with improved type safety
const processModelRequest = (modelId: string, data: ModelInputData): Promise<ModelOutputData> => {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 2000 + 1000; // Random delay between 1-3 seconds
    
    setTimeout(() => {
      try {
        // Verify model exists
        const model = dummyModels[modelId];
        if (!model) {
          throw new Error('Model not found');
        }
        
        // Type guards to ensure we're processing the right type of data
        switch (model.outputType) {
          case 'image':
            if ('imageUrl' in data) {
              resolve({
                imageUrl: data.imageUrl,
                annotations: [
                  { id: 1, label: 'Person', confidence: 0.97, x: 120, y: 80, width: 200, height: 180 },
                  { id: 2, label: 'Car', confidence: 0.88, x: 340, y: 200, width: 100, height: 150 },
                  { id: 3, label: 'Tree', confidence: 0.76, x: 20, y: 20, width: 100, height: 150 }
                ]
              });
            } else {
              throw new Error('Invalid input data for image model');
            }
            break;
          
          case 'text':
            if ('text' in data) {
              resolve({
                text: `Sentiment Analysis Results for: "${data.text}"\n\nSentiment: POSITIVE\nConfidence: 89%\n\nHighlighted positive phrases:\n- "really enjoyed"\n- "great experience"\n- "highly recommend"\n\nSuggested actions:\n- Share positive feedback with product team\n- Consider using testimonial in marketing`
              });
            } else {
              throw new Error('Invalid input data for text model');
            }
            break;
          
          case 'audio':
            resolve({
              audioUrl: 'mock-audio-url',
              transcript: "Transcript of the audio:\n\nWelcome to the demonstration of our speech recognition model. This technology can accurately convert spoken language to text in real-time, supporting multiple languages and dialects. The system has been trained on thousands of hours of diverse audio data to ensure high accuracy across different speakers and acoustic environments."
            });
            break;
            
          case 'json':
            resolve({
              analysis: {
                sentiment: 'positive',
                confidence: 0.87,
                entities: ['product', 'service', 'customer']
              }
            });
            break;
            
          default:
            resolve({ text: "Model processed the request successfully." });
        }
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown error processing model request'));
      }
    }, delay);
  });
};

const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const runButtonRef = useRef<HTMLButtonElement>(null);
  
  // State with proper typing
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputData, setInputData] = useState<ModelInputData | null>(null);
  const [outputData, setOutputData] = useState<ModelOutputData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch model data with error handling
  useEffect(() => {
    const fetchModel = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call to fetch specific model
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!id) {
          throw new Error('Model ID is required');
        }
        
        const modelData = dummyModels[id];
        if (!modelData) {
          throw new Error('Model not found');
        }
        
        setModel(modelData);
      } catch (err) {
        console.error('Error fetching model:', err);
        setError(err instanceof Error ? err.message : 'Failed to load model');
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id]);

  // Navigate back to models list
  const handleBack = useCallback(() => {
    navigate('/models');
  }, [navigate]);

  // Handle input data changes with proper typing
  const handleInputChange = useCallback((data: ModelInputData) => {
    setInputData(data);
    // Clear previous output when input changes
    setOutputData(null);
    setError(null);
  }, []);
  
  // Run model test with improved error handling
  const runTest = useCallback(async () => {
    // Verify model ID
    if (!id) {
      setError('Model ID is missing');
      return;
    }
    
    // Check authentication first
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    // Validate input data
    if (!inputData) {
      setError('Please provide input for the model');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await processModelRequest(id, inputData);
      setOutputData(result);
    } catch (err) {
      console.error('Error processing model request:', err);
      setError(err instanceof Error ? err.message : 'Error processing model request');
    } finally {
      setIsProcessing(false);
    }
  }, [id, isAuthenticated, inputData]);

  // Close login prompt
  const handleCloseLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false);
  }, []);

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="model-detail-page">
        <Header title="Test Model" />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading model data...</p>
        </div>
      </div>
    );
  }

  // If error loading model, show error state
  if (error && !model) {
    return (
      <div className="model-detail-page">
        <Header title="Model Error" />
        <div className="model-detail-container">
          <div className="model-not-found">
            <h1>Error Loading Model</h1>
            <p>{error}</p>
            <button onClick={handleBack} className="back-button">
              Back to Models
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If model not found, show not found state
  if (!model) {
    return (
      <div className="model-detail-page">
        <Header title="Model Not Found" />
        <div className="model-detail-container">
          <div className="model-not-found">
            <h1>Model Not Found</h1>
            <p>The model you are looking for does not exist or has been removed.</p>
            <button onClick={handleBack} className="back-button">
              Back to Models
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="model-detail-page">
      <Header title={`Test: ${model.name}`} />
      
      <div className="model-detail-container">
        <button onClick={handleBack} className="back-button">
          ← Back to Models
        </button>
        
        <div className="model-detail-content">
          <div className="model-detail-header">
            <div className="model-detail-image">
              <img src={model.imageUrl} alt={model.name} />
            </div>
            
            <div className="model-detail-info">
              <p className="model-detail-description">{model.description}</p>
              
              <div className="model-stats-detail">
                <div className="stat-detail">
                  <span className="stat-label">Accuracy</span>
                  <span className="stat-value">{model.accuracy}%</span>
                </div>
                
                <div className="stat-detail">
                  <span className="stat-label">Last Tested</span>
                  <span className="stat-value">{model.lastTested}</span>
                </div>
                
                <div className="stat-detail">
                  <span className="stat-label">Input Type</span>
                  <span className="stat-value input-type-badge">{model.inputType}</span>
                </div>
                
                <div className="stat-detail">
                  <span className="stat-label">Output Type</span>
                  <span className="stat-value output-type-badge">{model.outputType}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="model-specs">
            <h2>Model Specifications</h2>
            <div className="specs-grid">
              {model.details && Object.entries(model.details).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="model-testing">
            <div className="model-testing-header">
              <h2>Test the Model</h2>
              <button 
                ref={runButtonRef}
                onClick={runTest} 
                className="run-test-button"
                disabled={isProcessing || !inputData}
                aria-label={`Run ${model.name} test`}
              >
                {isProcessing ? 'Processing...' : 'Run Test'}
              </button>
            </div>
            
            <div className="test-interface">
              <div className="test-panels">
                <div className="test-input">
                  <h3>Input</h3>
                  <ModelInput 
                    inputType={model.inputType}
                    onChange={(data: any) => handleInputChange(data as ModelInputData)}
                  />
                </div>
                
                <div className="test-output">
                  <h3>Output</h3>
                  <ModelOutput
                    outputType={model.outputType as OutputType}
                    data={outputData}
                    isLoading={isProcessing}
                    error={error}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Extracted login prompt into a separate component */}
      <LoginPromptModal 
        isOpen={showLoginPrompt && !isAuthenticated}
        onClose={handleCloseLoginPrompt}
        returnFocusRef={runButtonRef as React.RefObject<HTMLElement>}
      />
    </div>
  );
};

export default ModelDetailPage; 