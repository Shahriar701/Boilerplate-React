import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/models.css';
import { useAuth } from '../contexts/AuthContext';
import { modelsService } from '../services/ModelsService';
import { Model } from '../types/model.types';

const ModelsPage: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch models from the backend
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedModels = await modelsService.getModels();
      setModels(fetchedModels);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError('Failed to load models. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get performance label based on accuracy
  const getPerformanceLabel = (accuracy: number): string => {
    if (accuracy >= 95) return 'Excellent';
    if (accuracy >= 90) return 'Very Good';
    if (accuracy >= 85) return 'Good';
    if (accuracy >= 80) return 'Fair';
    return 'Needs Improvement';
  };

  // Function to get active dots based on accuracy
  const getActiveDots = (accuracy: number): number => {
    if (accuracy >= 95) return 5;
    if (accuracy >= 90) return 4;
    if (accuracy >= 85) return 3;
    if (accuracy >= 80) return 2;
    return 1;
  };

  // Function to get model badge text and class
  const getModelBadge = (model: Model): { text: string; className: string } => {
    if (model.name.toLowerCase().includes('grpc')) {
      return { text: 'gRPC Service', className: 'grpc' };
    }
    if (model.name.toLowerCase().includes('yolo') || model.name.toLowerCase().includes('object')) {
      return { text: 'Object Detection', className: 'detection' };
    }
    if (model.name.toLowerCase().includes('depth')) {
      return { text: 'Computer Vision', className: 'vision' };
    }
    return { text: 'Machine Learning', className: 'ml' };
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

  if (error) {
    return (
      <div className="models-page">
        <Header showTitle={false} />
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Models</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Retry
            </button>
          </div>
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
          {models.map(model => {
            const badge = getModelBadge(model);
            const activeDots = getActiveDots(model.accuracy);
            const performanceLabel = getPerformanceLabel(model.accuracy);
            const accuracyDegrees = (model.accuracy / 100) * 360;

            return (
              <div key={model.id} className="model-card">
                <div className="card-header">
                  <h2 className="model-name">{model.name}</h2>
                  <p className="model-description">{model.description}</p>
                  <span className={`model-badge ${badge.className}`}>{badge.text}</span>
                </div>

                <div className="accuracy-section">
                  <div className="accuracy-label">Model Accuracy</div>
                  <div className="accuracy-circle">
                    <div 
                      className="accuracy-ring" 
                      style={{ '--percentage': `${accuracyDegrees}deg` } as React.CSSProperties}
                    >
                      <span className="accuracy-value">{model.accuracy}%</span>
                    </div>
                  </div>
                  <div className="performance-indicator">
                    <div className="performance-dots">
                      {[1, 2, 3, 4, 5].map(dot => (
                        <div 
                          key={dot} 
                          className={`dot ${dot <= activeDots ? 'active' : ''}`}
                        ></div>
                      ))}
                    </div>
                    <span className="performance-label">{performanceLabel}</span>
                  </div>
                </div>

                <div className="last-tested">
                  <div className="last-tested-label">Last Tested</div>
                  <div className="last-tested-date">{model.lastTested}</div>
                </div>

                <Link to={`/models/${model.id}`} className="action-button">
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModelsPage; 