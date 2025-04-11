import { Provider as InversifyProvider } from 'inversify-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { container } from './app/config/inversify.config';
import GlobalErrorBoundary from './errorBoundaries/GlobalErrorBoundary';
import './App.css';

// This will be created later
// import { store } from './store/store.config';

// For now, we'll just use a temporary store to avoid errors
const tempStore = {
  dispatch: () => {},
  getState: () => ({}),
  subscribe: () => () => {},
};

const App = () => {
  return (
    <GlobalErrorBoundary>
      <InversifyProvider container={container}>
        <ReduxProvider store={tempStore as any}>
          <Router>
            <div className="app-container">
              <AppRoutes />
            </div>
          </Router>
        </ReduxProvider>
      </InversifyProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
