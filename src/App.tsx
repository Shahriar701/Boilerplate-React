import { Provider as InversifyProvider } from 'inversify-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { container } from './app/config/inversify.config';
import GlobalErrorBoundary from './errorBoundaries/GlobalErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './styles/theme.css';
import './App.css';
import './styles/auth.css';
import './styles/models.css';
import './styles/model-detail.css';
import './styles/inputs.css';
import './styles/outputs.css';
import { useMemo } from 'react';

const App = () => {
  const appContainer = useMemo(() => container, []);
  
  return (
    <GlobalErrorBoundary>
      <InversifyProvider container={appContainer}>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </InversifyProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
