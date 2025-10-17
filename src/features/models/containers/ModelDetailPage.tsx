import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { useAuth } from '../../../contexts/AuthContext';
import ImageInput from '../../../components/inputs/ImageInput';
import ModelOutput from '../../../components/outputs/ModelOutput';
import '../../../styles/model-detail.css';

// Use Cases
import { IGetModelByIdUseCase } from '../useCases/interfaces/get-model-by-id.usecase.interface';
import { IGetModelStatusUseCase, ModelStatusResponse } from '../useCases/interfaces/get-model-status.usecase.interface';
import { IStartModelUseCase } from '../useCases/interfaces/start-model.usecase.interface';
import { IStopModelUseCase } from '../useCases/interfaces/stop-model.usecase.interface';
import { ITestModelUseCase } from '../useCases/interfaces/test-model.usecase.interface';

// DTOs and Types
import { ModelDto } from '../models/model.dto';
import { ModelInputData, ModelOutputData } from '../../../types/model.types';

const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, getToken } = useAuth();
  
  // Dependency Injection
  const getModelByIdUseCase = useInjection<IGetModelByIdUseCase>(TYPES.GetModelByIdUseCase);
  const getModelStatusUseCase = useInjection<IGetModelStatusUseCase>(TYPES.GetModelStatusUseCase);
  const startModelUseCase = useInjection<IStartModelUseCase>(TYPES.StartModelUseCase);
  const stopModelUseCase = useInjection<IStopModelUseCase>(TYPES.StopModelUseCase);
  const testModelUseCase = useInjection<ITestModelUseCase>(TYPES.TestModelUseCase);
  
  // State
  const [model, setModel] = useState<ModelDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse>({ status: 'NOT_FOUND' });
  const [statusLoading, setStatusLoading] = useState(false);
  const [testResult, setTestResult] = useState<ModelOutputData | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lastStatusUpdate, setLastStatusUpdate] = useState<Date>(new Date());
  const [isServiceEstablishing, setIsServiceEstablishing] = useState(false);

  // Refs for preventing duplicate operations
  const isStartingRef = useRef(false);
  const isTestingRef = useRef(false);
  const hasAttemptedAutoStartRef = useRef(false);
  const statusPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<Date>(new Date());
  const userManuallyStopped = useRef(false);

  useEffect(() => {
    if (id) {
      fetchModelData();
      fetchModelStatus();
    }
  }, [id]);

  useEffect(() => {
    const autoStartModel = async () => {
      if ((modelStatus.status === 'STOPPED' || modelStatus.status === 'NOT_FOUND') && !hasAttemptedAutoStartRef.current && !userManuallyStopped.current) {
        console.log('Auto-starting model on page load...');
        hasAttemptedAutoStartRef.current = true;
        await handleStartModel();
      }
    };

    if (modelStatus.status === 'STOPPED' && hasAttemptedAutoStartRef.current && !userManuallyStopped.current) {
      console.log('Model stopped (likely due to inactivity), allowing auto-restart...');
      hasAttemptedAutoStartRef.current = false;
    }

    if (modelStatus.status !== 'RUNNING' && modelStatus.status !== 'STARTING' && modelStatus.status !== 'PENDING' && model && !hasAttemptedAutoStartRef.current && !userManuallyStopped.current) {
      autoStartModel();
    }
  }, [modelStatus, model]);

  useEffect(() => {
    const startStatusPolling = () => {
      if (statusPollingIntervalRef.current) {
        clearInterval(statusPollingIntervalRef.current);
      }

      const getPollingInterval = (status: string): number => {
        switch (status) {
          case 'STARTING':
          case 'STOPPING':
            return 2000; // Poll every 2 seconds during transitions
          case 'RUNNING':
            return 10000; // Poll every 10 seconds when running (to catch idle timeout)
          case 'STOPPED':
          case 'NOT_FOUND':
            return 30000; // Poll every 30 seconds when stopped
          default:
            return 15000; // Default fallback
        }
      };

      const pollStatus = async () => {
        try {
          const status = await getModelStatusUseCase.execute(id!);
          const previousStatus = modelStatus.status;
          
          // Update status if it changed
          if (status.status !== previousStatus) {
            console.log(`Model status changed: ${previousStatus} → ${status.status}`);
            setModelStatus(status);
            setLastStatusUpdate(new Date());
            
            // Handle specific transitions
            if (previousStatus === 'RUNNING' && status.status === 'STOPPED') {
              console.log('Model stopped due to idle timeout or manual action');
              // Reset auto-start flag so user can restart if needed
              hasAttemptedAutoStartRef.current = false;
            }
          }
          
          // Restart polling with appropriate interval
          const interval = getPollingInterval(status.status);
          statusPollingIntervalRef.current = setTimeout(pollStatus, interval);
          
        } catch (error) {
          console.error('Error during status polling:', error);
          // Continue polling even on error, but with longer interval
          statusPollingIntervalRef.current = setTimeout(pollStatus, 15000);
        }
      };

      // Start initial poll
      const initialInterval = getPollingInterval(modelStatus.status);
      statusPollingIntervalRef.current = setTimeout(pollStatus, initialInterval);
    };

    // Only start polling if we have a model ID and aren't currently loading
    if (id && !loading && modelStatus) {
      startStatusPolling();
    }

    // Cleanup function
    return () => {
      if (statusPollingIntervalRef.current) {
        clearInterval(statusPollingIntervalRef.current);
        statusPollingIntervalRef.current = null;
      }
    };
  }, [id, modelStatus.status, loading]); // Restart polling when status changes

  // Update activity timestamp on user interactions
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = new Date();
    };

    // Track user activity to optimize polling
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (statusPollingIntervalRef.current) {
          clearInterval(statusPollingIntervalRef.current);
        }
      } else {
        if (id && !loading) {
          fetchModelStatus();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, loading]);

  const fetchModelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const modelData = await getModelByIdUseCase.execute(id!);
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
      const status = await getModelStatusUseCase.execute(id!);
      console.log('Fetched model status:', status);
      setModelStatus(status);
      setLastStatusUpdate(new Date());
    } catch (err) {
      console.error('Error fetching model status:', err);
      setModelStatus({ status: 'NOT_FOUND' });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleStartModel = async () => {
    if (isStartingRef.current || modelStatus.status === 'RUNNING' || modelStatus.status === 'STARTING') {
      return;
    }

    try {
      console.log('Starting model...');
      isStartingRef.current = true;
      userManuallyStopped.current = false;
      setModelStatus({ status: 'STARTING' });
      await startModelUseCase.execute(id!);
      console.log('Model start request completed');
      
    } catch (err: any) {
      console.error('Error starting model:', err);
      setError(err.message || 'Failed to start model');
      setModelStatus({ status: 'STOPPED' });
      isStartingRef.current = false;
    } finally {
      isStartingRef.current = false;
    }
  };

  const handleStopModel = async () => {
    try {
      console.log('User manually stopping model...');
      userManuallyStopped.current = true; // Mark as manually stopped
      setModelStatus({ status: 'STOPPING' });
      await stopModelUseCase.execute(id!);
      await fetchModelStatus();
    } catch (err: any) {
      console.error('Error stopping model:', err);
      setError(err.message || 'Failed to stop model');
    }
  };

  const handleTest = async () => {
    if (!selectedFile || isTestingRef.current) return;

    try {
      console.log('Starting image test with file:', selectedFile.name);
      isTestingRef.current = true;
      setTestLoading(true);
      setTestError(null);
      setTestResult(null);
      setIsServiceEstablishing(false);

      const inputData: ModelInputData = {
        imageUrl: '',
        file: selectedFile
      };
      
      console.log('Calling testModelUseCase with:', inputData);
      const result = await testModelUseCase.execute({
        modelId: id!,
        inputData
      });
      console.log('Model result received:', result);
      setTestResult(result);
      setIsServiceEstablishing(false);
    } catch (err: any) {
      console.error('Error testing model:', err);
      
      if (err.message?.includes('service is starting up') || 
          err.message?.includes('establishing') ||
          err.message?.includes('GRPC_SERVICE_ESTABLISHING') ||
          err.message?.includes('REST_SERVICE_ESTABLISHING')) {
        
        setIsServiceEstablishing(true);
        setTestError('🔄 The model service is starting up. Please wait - retrying in 10 seconds...');
        
        setTimeout(() => {
          if (!isTestingRef.current) {
            console.log('Auto-retrying after service establishing error...');
            handleTest();
          }
        }, 10000);
        
        return;
      }
      
      setIsServiceEstablishing(false);
      
      if (err.message?.includes('auto-start')) {
        setModelStatus({ status: 'STARTING' });
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
    setIsServiceEstablishing(false);
  };

  const retryTest = () => {
    if (!isTestingRef.current && selectedFile) {
      console.log('Manual retry triggered...');
      handleTest();
    }
  };

  const getStatusDisplay = () => {
    switch (modelStatus.status) {
      case 'RUNNING': 
        return { 
          text: 'Running', 
          color: '#10b981', 
          dot: '🟢',
          description: 'Model is active and ready to process requests'
        };
      case 'STARTING': 
        return { 
          text: 'Starting', 
          color: '#f59e0b', 
          dot: '🟡',
          description: 'Model is starting up, please wait...'
        };
      case 'PENDING': 
        return { 
          text: 'Pending', 
          color: '#f59e0b', 
          dot: '🟡',
          description: 'Model start request is pending'
        };
      case 'STOPPING': 
        return { 
          text: 'Stopping', 
          color: '#f59e0b', 
          dot: '🟡',
          description: 'Model is shutting down...'
        };
      case 'STOPPED': 
        return { 
          text: 'Stopped', 
          color: '#ef4444', 
          dot: '🔴',
          description: 'Model stopped (idle timeout after 5 minutes or manual stop)'
        };
      default: 
        return { 
          text: 'Unknown', 
          color: '#6b7280', 
          dot: '⚫',
          description: 'Model status unknown'
        };
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
            <div className="brand">Model Zoo</div>
          </div>
          <div className="user-info">
            {isAuthenticated ? (
              <div className="auth-status">
                <span className="user-name">{user?.name}</span>
                <Link to="/login" className="auth-link">Logout</Link>
              </div>
            ) : (
              <div className="auth-status">
                <span className="guest-status">Guest User</span>
                <span className="container-type">• Shared Container</span>
                <Link 
                  to="/login" 
                  state={{ from: location }}
                  className="auth-link"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error Display */}
      {(error || testError) && (
        <div className="error-banner">
          <div className="error-content">
            <p>{error || testError}</p>
            <div className="error-actions">
              {isServiceEstablishing && (
                <button onClick={retryTest} className="retry-button">
                  Retry Now
                </button>
              )}
              <button onClick={dismissError} className="dismiss-error-button">
                ✕
              </button>
            </div>
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
                <div className="status-info-container">
                  <span className="status-badge" style={{ color: status.color }}>
                    {status.dot} {status.text}
                  </span>
                </div>
              </div>
              <div className="action-buttons">
                {modelStatus.status === 'RUNNING' ? (
                  <button 
                    className="btn-danger" 
                    onClick={handleStopModel}
                    disabled={false}
                  >
                    Stop Model
                  </button>
                ) : modelStatus.status === 'STOPPED' || modelStatus.status === 'NOT_FOUND' ? (
                  <button 
                    className="btn-primary" 
                    onClick={handleStartModel}
                    disabled={isStartingRef.current}
                  >
                    Start Model
                  </button>
                ) : (
                  /* Show disabled button with status info for transitional states */
                  <button 
                    className="btn-secondary" 
                    disabled={true}
                  >
                    {modelStatus.status === 'STARTING' && 'Starting...'}
                    {modelStatus.status === 'STOPPING' && 'Stopping...'}
                    {modelStatus.status === 'PENDING' && 'Pending...'}
                    {!['STARTING', 'STOPPING', 'PENDING'].includes(modelStatus.status) && 'Processing...'}
                  </button>
                )}
                <button 
                  className="btn-secondary-small" 
                  onClick={fetchModelStatus}
                  disabled={statusLoading}
                  title="Refresh model status"
                >
                  {statusLoading ? '⏳' : '🔄'}
                </button>
              </div>
            </div>
          </div>

          {/* Test Interface */}
          <div className="test-interface">
            <div className="test-header">
              <div>
                <h2 className="test-title">Test Model</h2>
                <p className="test-subtitle">Upload an image to test the model capabilities</p>
              </div>
            </div>

            <div className="upload-section">
              <div className="upload-area">
                <ImageInput
                  onChange={setSelectedFile}
                  disabled={testLoading}
                />
              </div>

              <div className="output-section">
                <ModelOutput
                  outputType={model.outputType}
                  data={testResult}
                  isLoading={testLoading}
                  error={testError}
                />
              </div>
            </div>

            <button 
              className="process-btn" 
              onClick={handleTest}
              disabled={!selectedFile || testLoading}
            >
              {isServiceEstablishing ? '🔄 Establishing Connection...' : 
               testLoading ? 'Processing...' : 
               'Process Image'}
            </button>
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
                <span className="spec-value">{model.details?.framework || 'PyTorch'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Version</span>
                <span className="spec-value">{model.details?.version || (model.id.includes('v2') ? '2.0' : '1.0')}</span>
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