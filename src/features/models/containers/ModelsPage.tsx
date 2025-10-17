import React, { useEffect, useState } from 'react';
import { useInjection } from 'inversify-react';
import { Link } from 'react-router-dom';
import { TYPES } from '../../../app/config/types';
import { IGetModelsUseCase } from '../useCases/interfaces/get-models.usecase.interface';
import { ModelDto, ModelFilterRequest } from '../models/model.dto';
import { InputType, OutputType } from '../../../types/model.types';
import Header from '../../../components/Header';
import '../../../styles/models.css';

const ModelsPage: React.FC = () => {
  // State
  const [models, setModels] = useState<ModelDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ModelFilterRequest>({
    page: 1,
    limit: 10
  });

  // Dependency Injection
  const getModelsUseCase = useInjection<IGetModelsUseCase>(TYPES.GetModelsUseCase);

  // Fetch models on component mount and filter changes
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getModelsUseCase.execute(filter);
        setModels(response.models);
      } catch (err) {
        setError('Failed to load models. Please try again later.');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [getModelsUseCase, filter]);

  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleInputTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilter(prev => ({ ...prev, inputType: value === 'all' ? undefined : value as InputType }));
  };

  const handleOutputTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilter(prev => ({ ...prev, outputType: value === 'all' ? undefined : value as OutputType }));
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
  const getModelBadge = (model: ModelDto): { text: string; className: string } => {
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

  // Render loading state
  if (loading && models.length === 0) {
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

  // Render error state
  if (error && models.length === 0) {
    return (
      <div className="models-page">
        <Header showTitle={false} />
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Models</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
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
        
        {/* Filter Section */}
        <div className="filters-container">
          <div className="filters-row">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search models..."
                value={filter.searchTerm || ''}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            
            <div className="filter-selects">
              <div className="filter-group">
                <select
                  id="inputType"
                  value={filter.inputType || 'all'}
                  onChange={handleInputTypeChange}
                  className="filter-select"
                >
                  <option value="all">Input Type</option>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="binary">Binary</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select
                  id="outputType"
                  value={filter.outputType || 'all'}
                  onChange={handleOutputTypeChange}
                  className="filter-select"
                >
                  <option value="all">Output Type</option>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="binary">Binary</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Models Grid */}
        {loading && <div className="loading-indicator">Updating results...</div>}
        
        {models.length === 0 && !loading ? (
          <div className="no-results">
            <p>No models found matching your criteria.</p>
          </div>
        ) : (
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
        )}
        
        {/* Pagination */}
        {models.length > 0 && (
          <div className="pagination">
            <button 
              disabled={filter.page === 1} 
              onClick={() => setFilter(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="page-indicator">Page {filter.page}</span>
            <button 
              onClick={() => setFilter(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
              className="pagination-button"
              disabled={models.length < (filter.limit || 10)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsPage; 