import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../app/config/types';
import { IAuthService } from '../features/auth/services/auth.service.interface';

// Import real components
import LoginPage from '../features/auth/containers/LoginPage';
import RegisterPage from '../features/auth/containers/RegisterPage';
import ProfilePage from '../features/users/containers/ProfilePage';
import ProductsPage from '../features/products/containers/ProductsPage';
import HomePage from '../features/home/components/HomePage';

// Placeholder for pages not yet implemented
const NotFound = () => <div>404 Not Found</div>;

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authService = useInjection<IAuthService>(TYPES.AuthService);
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure auth state is loaded properly
    setIsReady(true);
  }, []);
  
  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
      />
      <Route
        path="/products"
        element={<ProtectedRoute><ProductsPage /></ProtectedRoute>}
      />

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 