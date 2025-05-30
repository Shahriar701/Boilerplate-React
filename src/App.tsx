import { Provider as InversifyProvider } from 'inversify-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { container } from './app/config/inversify.config';
import GlobalErrorBoundary from './errorBoundaries/GlobalErrorBoundary';
import './styles/theme.css';
import './App.css';
import './styles/auth.css';
import './styles/models.css';
import './styles/model-detail.css';
import './styles/inputs.css';
import './styles/outputs.css';
import { useMemo } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages - Using proper clean architecture containers
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ModelsPage from './features/models/containers/ModelsPage';
import ModelDetailPage from './features/models/containers/ModelDetailPage';
import HomePage from './pages/HomePage';

const App = () => {
  const appContainer = useMemo(() => container, []);
  
  return (
    <GlobalErrorBoundary>
      <InversifyProvider container={appContainer}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/models" element={<ModelsPage />} />
              <Route path="/models/:id" element={<ModelDetailPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/models" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </InversifyProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
