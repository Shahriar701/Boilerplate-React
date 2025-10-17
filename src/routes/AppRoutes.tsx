import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../app/config/types';
import { IAuthService } from '../features/auth/services/auth.service.interface';
import { useAuth } from '../contexts/AuthContext';

// Lazy load components for better performance
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ModelsPage = lazy(() => import('../features/models/containers/ModelsPage'));
const ModelDetailPage = lazy(() => import('../features/models/containers/ModelDetailPage'));
const HomePage = lazy(() => import('../pages/HomePage'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Route configuration type
interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  guestAllowed?: boolean;
}

// Protected Route Component with guest access support
const ProtectedRoute: React.FC<{ children: React.ReactNode; guestAllowed?: boolean }> = ({ 
  children, 
  guestAllowed = false 
}) => {
  const authService = useInjection<IAuthService>(TYPES.AuthService);
  const { isGuest } = useAuth();
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  // Allow access if authenticated or if guest access is allowed and in guest mode
  if (isAuthenticated || (guestAllowed && isGuest)) {
    return <>{children}</>;
  }

  // Redirect to login with the current location
  return <Navigate to="/login" state={{ from: location }} replace />;
};

// Define routes configuration
const routes: RouteConfig[] = [
  {
    path: '/models',
    element: <ModelsPage />,
    guestAllowed: true,
  },
  {
    path: '/models/:id',
    element: <ModelDetailPage />,
    protected: true,
    guestAllowed: true, // Allow guests to view model details
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <HomePage />,
    guestAllowed: true,
  },
];

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Map through route configurations */}
        {routes.map(({ path, element, protected: isProtected, guestAllowed }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute guestAllowed={guestAllowed}>{element}</ProtectedRoute>
              ) : (
                element
              )
            }
          />
        ))}

        {/* Catch All - Redirect to Models */}
        <Route path="*" element={<Navigate to="/models" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 