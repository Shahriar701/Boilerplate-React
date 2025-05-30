import { Provider as InversifyProvider } from 'inversify-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { container } from './app/config/inversify.config';
import GlobalErrorBoundary from './errorBoundaries/GlobalErrorBoundary';
import { store } from './store/store.config';
import './styles/theme.css';
import './App.css';
import './styles/auth.css';
import './styles/models.css';
import './styles/model-detail.css';
import './styles/inputs.css';
import './styles/outputs.css';
import { useEffect, useState, useMemo } from 'react';
import { combineReducers } from '@reduxjs/toolkit';
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ModelsPage from './pages/ModelsPage';
import ModelDetailPage from './pages/ModelDetailPage';
import HomePage from './pages/HomePage';

// Load the product reducer and replace the temporary one
const loadProductReducer = async () => {
  try {
    // Dynamic import to avoid circular dependencies
    const { productReducer } = await import('./store/slices/product.slice');
    
    // Replace the dummy reducer with the real one
    const rootReducer = combineReducers({
      products: productReducer
    });
    
    // @ts-ignore - Type checking is difficult with dynamic reducer replacement
    store.replaceReducer(rootReducer);
    
    return true;
  } catch (error) {
    console.error('Error loading product reducer:', error);
    return false;
  }
};

// Component to handle reducer loading
const ReduxInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeStore = async () => {
      try {
        const success = await loadProductReducer();
        setIsLoaded(success);
        if (!success) {
          setError("Failed to load Redux store");
        }
      } catch (err) {
        console.error("Error initializing Redux store:", err);
        setError("Failed to initialize application");
        setIsLoaded(false);
      }
    };
    
    initializeStore();
  }, []);
  
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }
  
  if (!isLoaded) {
    return <div className="loading">Loading application...</div>;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Use memoization to ensure the container reference never changes
  const appContainer = useMemo(() => container, []);
  
  return (
    <GlobalErrorBoundary>
      <InversifyProvider container={appContainer}>
        <ReduxProvider store={store}>
          <ReduxInit>
            <AuthProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Models list is now publicly accessible */}
                  <Route path="/models" element={<ModelsPage />} />
                  
                  {/* Model testing still requires authentication, but the check is now done in the component */}
                  <Route path="/models/:id" element={<ModelDetailPage />} />
                  
                  {/* Home page with redirect logic */}
                  <Route path="/" element={<HomePage />} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<Navigate to="/models" replace />} />
                </Routes>
              </Router>
            </AuthProvider>
          </ReduxInit>
        </ReduxProvider>
      </InversifyProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
