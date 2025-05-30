import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { modelsService } from '../services/ModelsService';
import ImageInput from '../components/inputs/ImageInput';
import '../styles/model-detail.css';
import { Model } from '../types/model.types';

const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<'RUNNING' | 'STOPPED' | 'STARTING' | 'STOPPING' | 'NOT_FOUND'>('NOT_FOUND');
  const [statusLoading, setStatusLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isStartingRef = useRef(false);
  const isTestingRef = useRef(false);

  useEffect(() => {
    if (id) {
      fetchModelData();
      fetchModelStatus();
    }
  }, [id]);

  const fetchModelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const modelData = await modelsService.getModelById(id!);
      setModel(modelData);
    } catch (err: any) {
      console.error('Error fetching model:', err);
      setError(err.message || 'Failed to load model details');
    } finally {
      setLoading(false);
    }
  };

  const fetchModelStatus = async () => {
    try {
      setStatusLoading(true);
      const status = await modelsService.getModelStatus(id!);
      setModelStatus(status);
    } catch (err) {
      console.error('Error fetching model status:', err);
      setModelStatus('NOT_FOUND');
    } finally {
      setStatusLoading(false);
    }
  };

  const startModelSafe = async () => {
    if (isStartingRef.current || modelStatus === 'RUNNING' || modelStatus === 'STARTING') {
      return;
    }

    try {
      isStartingRef.current = true;
      setModelStatus('STARTING');
      await modelsService.startModel(id!);
      
      // Poll for status updates
      const pollInterval = setInterval(async () => {
        try {
          const status = await modelsService.getModelStatus(id!);
          setModelStatus(status);
          
          if (status === 'RUNNING' || status === 'STOPPED') {
            clearInterval(pollInterval);
            isStartingRef.current = false;
          }
        } catch (err) {
          console.error('Error polling status:', err);
          clearInterval(pollInterval);
          isStartingRef.current = false;
        }
      }, 2000);
      
      setTimeout(() => {
        clearInterval(pollInterval);
        isStartingRef.current = false;
      }, 60000);
      
    } catch (err: any) {
      console.error('Error starting model:', err);
      setError(err.message || 'Failed to start model');
      setModelStatus('STOPPED');
      isStartingRef.current = false;
    }
  };

  const stopModel = async () => {
    try {
      setModelStatus('STOPPING');
      await modelsService.stopModel(id!);
      await fetchModelStatus();
    } catch (err: any) {
      console.error('Error stopping model:', err);
      setError(err.message || 'Failed to stop model');
    }
  };

  const handleTest = async () => {
    if (!selectedFile || isTestingRef.current) return;

    try {
      isTestingRef.current = true;
      setTestLoading(true);
      setTestError(null);
      setTestResult(null);

      // Create input data in the correct format
      const inputData = {
        imageUrl: '',
        file: selectedFile
      };
      
      const result = await modelsService.invokeModel(id!, inputData);
      setTestResult(result);
    } catch (err: any) {
      console.error('Error testing model:', err);
      
      if (err.message?.includes('auto-start')) {
        setModelStatus('STARTING');
        setTimeout(() => fetchModelStatus(), 2000);
      }
      
      setTestError(err.message || 'Failed to test model');
    } finally {
      setTestLoading(false);
      isTestingRef.current = false;
    }
  };

  const dismissError = () => {
    setError(null);
    setTestError(null);
  };

  const getStatusDisplay = () => {
    switch (modelStatus) {
      case 'RUNNING': return { text: 'Running', color: '#10b981', dot: '🟢' };
      case 'STARTING': return { text: 'Starting', color: '#f59e0b', dot: '🟡' };
      case 'STOPPING': return { text: 'Stopping', color: '#f59e0b', dot: '🟡' };
      case 'STOPPED': return { text: 'Stopped', color: '#ef4444', dot: '🔴' };
      default: return { text: 'Unknown', color: '#6b7280', dot: '⚫' };
    }
  };

  const getModelBadge = () => {
    if (!model) return { text: 'Unknown', className: 'ml' };
    
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
      <div className="model-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading model details...</p>
        </div>
      </div>
    );
  }

  if (error && !model) {
    return (
      <div className="model-detail-page">
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Model</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="model-detail-page">
        <div className="error-container">
          <div className="error-message">
            <h3>Model Not Found</h3>
            <p>The requested model could not be found.</p>
            <button onClick={() => navigate('/')} className="retry-button">
              Back to Models
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusDisplay();
  const badge = getModelBadge();
  const accuracyDegrees = (model.accuracy / 100) * 360;

  return (
    <div className="model-detail-page">
      {/* Header */}
      <header className="detail-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Back
            </button>
            <div className="brand">AI Models Testing Platform</div>
          </div>
          <div className="user-info">
            {isAuthenticated ? `${user?.name} • Online` : 'Guest User • Online'}
          </div>
        </div>
      </header>

      {/* Error Display */}
      {(error || testError) && (
        <div className="error-banner">
          <div className="error-content">
            <p>{error || testError}</p>
            <button onClick={dismissError} className="dismiss-error-button">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="main-container">
        <div className="content-section">
          {/* Model Header */}
          <div className="model-header">
            <h1 className="model-title">{model.name}</h1>
            <p className="model-subtitle">{model.description}</p>
            <div className="model-header-controls">
              <div className="model-badge-container">
                <span className={`model-badge ${badge.className}`}>{badge.text}</span>
                <span className="status-badge" style={{ color: status.color }}>
                  {status.dot} {status.text}
                </span>
              </div>
              <div className="action-buttons">
                {modelStatus === 'RUNNING' ? (
                  <button className="btn-danger" onClick={stopModel}>
                    Stop Model
                  </button>
                ) : (
                  <button 
                    className="btn-primary" 
                    onClick={startModelSafe}
                    disabled={modelStatus === 'STARTING'}
                  >
                    {modelStatus === 'STARTING' ? 'Starting...' : 'Start Model'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Test Interface */}
          <div className="test-interface">
            <div className="test-header">
              <div>
                <h2 className="test-title">Test Model</h2>
                <p className="test-subtitle">
                  {isAuthenticated 
                    ? 'Upload an image to test the model capabilities'
                    : 'Login required to test the model'
                  }
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <>
                <div className="upload-section">
                  <div className="upload-area">
                    <ImageInput
                      onChange={setSelectedFile}
                      disabled={testLoading}
                    />
                  </div>

                  <div className="output-section">
                    <div className="output-preview">
                      {testLoading ? (
                        <div className="output-loading">
                          <div className="loading-spinner"></div>
                          <p>Processing...</p>
                        </div>
                      ) : testResult ? (
                        <div className="output-result">
                          {model.outputType === 'image' && testResult.output ? (
                            <img 
                              src={`data:image/jpeg;base64,${testResult.output}`} 
                              alt="Model output" 
                              className="output-image"
                            />
                          ) : (
                            <pre className="output-text">
                              {typeof testResult === 'object' 
                                ? JSON.stringify(testResult, null, 2)
                                : testResult
                              }
                            </pre>
                          )}
                        </div>
                      ) : (
                        <div className="output-placeholder">
                          {model.outputType === 'image' 
                            ? 'Depth map will appear here after processing'
                            : 'Model output will appear here after processing'
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  className="process-btn" 
                  onClick={handleTest}
                  disabled={!selectedFile || testLoading}
                >
                  {testLoading ? 'Processing...' : 'Process Image'}
                </button>
              </>
            ) : (
              <div className="auth-required">
                <div className="auth-required-content">
                  <p>Please log in to test the model capabilities</p>
                  <button 
                    className="login-btn"
                    onClick={() => navigate('/login')}
                  >
                    Login to Test
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Performance Stats */}
          <div className="stats-card">
            <h3 className="stats-title">Performance</h3>
            <div className="accuracy-display">
              <div className="accuracy-circle">
                <div 
                  className="circle-bg" 
                  style={{ 
                    background: `conic-gradient(from 0deg, #10b981 0deg, #10b981 ${accuracyDegrees}deg, #374151 ${accuracyDegrees}deg, #374151 360deg)` 
                  }}
                >
                  <span className="accuracy-value">{model.accuracy}%</span>
                </div>
              </div>
              <div className="accuracy-label">Model Accuracy</div>
            </div>
          </div>

          {/* Model Specifications */}
          <div className="stats-card">
            <h3 className="stats-title">Model Details</h3>
            <div className="specs-list">
              <div className="spec-item">
                <span className="spec-label">Framework</span>
                <span className="spec-value">PyTorch</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Version</span>
                <span className="spec-value">{model.id.includes('v2') ? '2.0' : '1.0'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Input Type</span>
                <span className="spec-value">{model.inputType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Output Type</span>
                <span className="spec-value">{model.outputType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Status</span>
                <span className="status-badge-detail" style={{ color: status.color }}>
                  {status.text}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Last Tested</span>
                <span className="spec-value">{model.lastTested}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetailPage; 