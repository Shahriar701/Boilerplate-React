import React, { useEffect, useState } from 'react';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { IGetModelsUseCase } from '../useCases/interfaces/get-models.usecase.interface';
import { ModelDto, ModelFilterRequest } from '../models/model.dto';
import { InputType, OutputType } from '../../../types/model.types';

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
    const value = e.target.value as InputType | undefined;
    setFilter(prev => ({ ...prev, inputType: value === 'all' ? undefined : value as InputType }));
  };

  const handleOutputTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as OutputType | undefined;
    setFilter(prev => ({ ...prev, outputType: value === 'all' ? undefined : value as OutputType }));
  };

  // Render loading state
  if (loading && models.length === 0) {
    return (
      <div className="models-page">
        <h1>ML Models</h1>
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
        <h1>ML Models</h1>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => setFilter(prev => ({ ...prev }))}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="models-page">
      <h1>ML Models</h1>
      
      {/* Filter Section */}
      <div className="filters-container">
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
            <label htmlFor="inputType">Input Type:</label>
            <select
              id="inputType"
              value={filter.inputType || 'all'}
              onChange={handleInputTypeChange}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="outputType">Output Type:</label>
            <select
              id="outputType"
              value={filter.outputType || 'all'}
              onChange={handleOutputTypeChange}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="json">JSON</option>
            </select>
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
          {models.map((model) => (
            <div key={model.id} className="model-card">
              <div className="model-image">
                <img src={model.imageUrl} alt={model.name} />
              </div>
              <div className="model-content">
                <h3>{model.name}</h3>
                <p className="model-description">{model.description}</p>
                <div className="model-meta">
                  <span className="model-accuracy">Accuracy: {model.accuracy}%</span>
                  <span className="model-type">Type: {model.inputType} → {model.outputType}</span>
                </div>
                <div className="model-actions">
                  <a href={`/models/${model.id}`} className="view-button">View Details</a>
                  <a href={`/models/${model.id}/test`} className="test-button">Test Model</a>
                </div>
              </div>
            </div>
          ))}
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
  );
};

export default ModelsPage; 