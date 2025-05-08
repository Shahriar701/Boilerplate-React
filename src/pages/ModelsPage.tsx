import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/models.css';
import { useAuth } from '../contexts/AuthContext';

// Interface for model data
interface Model {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTested: string;
  imageUrl: string;
  inputType: 'text' | 'image' | 'audio' | 'json';  // Added input type
  outputType: 'text' | 'image' | 'audio' | 'json'; // Added output type
}

const ModelsPage: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Dummy data - in a real application, this would come from an API
  const dummyModels: Model[] = [
    {
      id: '1',
      name: 'Object Recognition v1',
      description: 'Detects and identifies common objects in images with high accuracy.',
      accuracy: 92.5,
      lastTested: '2023-06-15',
      imageUrl: 'https://via.placeholder.com/300x200?text=Object+Recognition',
      inputType: 'image',
      outputType: 'image'
    },
    {
      id: '2',
      name: 'Sentiment Analysis',
      description: 'Analyzes text to determine sentiment (positive, negative, neutral).',
      accuracy: 88.7,
      lastTested: '2023-07-22',
      imageUrl: 'https://via.placeholder.com/300x200?text=Sentiment+Analysis',
      inputType: 'text',
      outputType: 'text'
    },
    {
      id: '3',
      name: 'Face Detection',
      description: 'Identifies faces in images and videos with bounding boxes.',
      accuracy: 95.3,
      lastTested: '2023-05-30',
      imageUrl: 'https://via.placeholder.com/300x200?text=Face+Detection',
      inputType: 'image',
      outputType: 'image'
    },
    {
      id: '4',
      name: 'Speech Recognition',
      description: 'Converts spoken language into text with support for multiple languages.',
      accuracy: 90.1,
      lastTested: '2023-08-05',
      imageUrl: 'https://via.placeholder.com/300x200?text=Speech+Recognition',
      inputType: 'audio',
      outputType: 'text'
    },
    {
      id: '5',
      name: 'Image Segmentation',
      description: 'Segments images into multiple parts to understand the content on a pixel level.',
      accuracy: 89.4,
      lastTested: '2023-07-19',
      imageUrl: 'https://via.placeholder.com/300x200?text=Image+Segmentation',
      inputType: 'image',
      outputType: 'image'
    },
    {
      id: '6',
      name: 'Pose Estimation',
      description: 'Detects human figures in images and estimates their pose.',
      accuracy: 87.8,
      lastTested: '2023-08-12',
      imageUrl: 'https://via.placeholder.com/300x200?text=Pose+Estimation',
      inputType: 'image',
      outputType: 'image'
    }
  ];

  // Simulate API call to fetch models
  useEffect(() => {
    const fetchModels = async () => {
      // Simulate network delay
      setTimeout(() => {
        setModels(dummyModels);
        setLoading(false);
      }, 800);
    };

    fetchModels();
  }, []);

  // A function to generate a color based on the accuracy value
  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 95) return '#4ade80'; // green for high accuracy
    if (accuracy >= 90) return '#22c55e'; // light green
    if (accuracy >= 85) return '#f59e0b'; // amber
    if (accuracy >= 80) return '#f97316'; // orange
    return '#ef4444'; // red for low accuracy
  };

  // Function to get icon for input type
  const getInputTypeIcon = (type: string): string => {
    switch (type) {
      case 'text':
        return '📝';
      case 'image':
        return '🖼️';
      case 'audio':
        return '🎤';
      case 'json':
        return '📊';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div className="models-page">
        <Header showTitle={false} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="models-page">
      <Header showTitle={false} />

      <div className="models-container">
        <div className="models-hero">
          <p className="models-hero-description">
            Explore our collection of high-performance machine learning models and test their capabilities in real-time.
          </p>
        </div>
        
        <div className="models-grid">
          {models.map(model => (
            <div key={model.id} className="model-card">              
              <div className="model-content">
                <h2>{model.name}</h2>
                <p className="model-description">{model.description}</p>
                
                <div className="model-stats">
                  <div className="stat">
                    <span className="stat-label">Accuracy</span>
                    <div className="accuracy-bar-container">
                      <div 
                        className="accuracy-bar" 
                        style={{ 
                          width: `${model.accuracy}%`,
                          backgroundColor: getAccuracyColor(model.accuracy)
                        }}
                      ></div>
                    </div>
                    <span className="accuracy-value">{model.accuracy}%</span>
                  </div>
                  
                  <div className="stat">
                    <span className="stat-label">Last Tested</span>
                    <span className="stat-value">{model.lastTested}</span>
                  </div>
                  
                  {/* <div className="model-io-types">
                    <span className="io-badge">
                      Input: {getInputTypeIcon(model.inputType)} {model.inputType}
                    </span>
                    <span className="io-badge">
                      Output: {getInputTypeIcon(model.outputType)} {model.outputType}
                    </span>
                  </div> */}
                </div>
                
                <Link to={`/models/${model.id}`} className="test-model-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsPage; 