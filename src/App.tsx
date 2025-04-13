import { Provider as InversifyProvider } from 'inversify-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { container } from './app/config/inversify.config';
import GlobalErrorBoundary from './errorBoundaries/GlobalErrorBoundary';
import Navigation from './shared/components/Navigation';
import './App.css';

// This will be created later
// import { store } from './store/store.config';

// For now, we'll just use a temporary store to avoid errors
const tempStore = {
  dispatch: () => { },
  getState: () => ({}),
  subscribe: () => () => { },
};

const App = () => {
  return (
    <GlobalErrorBoundary>
      <InversifyProvider container={container}>
        <ReduxProvider store={tempStore as any}>
          <Router>
            <div className="app-wrapper">
              <Navigation />
              <main className="app-container" role="main">
                <AppRoutes />
              </main>
            </div>
          </Router>
        </ReduxProvider>
      </InversifyProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
