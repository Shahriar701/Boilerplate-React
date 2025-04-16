import { Provider as InversifyProvider } from 'inversify-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { container } from './app/config/inversify.config';
import GlobalErrorBoundary from './errorBoundaries/GlobalErrorBoundary';
import Navigation from './shared/components/Navigation';
import { store } from './store/store.config';
import './App.css';
import { useEffect, useState, useMemo } from 'react';
import { combineReducers } from '@reduxjs/toolkit';

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
            <Router>
              <div className="app-wrapper">
                <Navigation />
                <main className="app-container" role="main">
                  <AppRoutes />
                </main>
              </div>
            </Router>
          </ReduxInit>
        </ReduxProvider>
      </InversifyProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
