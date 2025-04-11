import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Placeholder for real components
const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Profile = () => <div>Profile Page</div>;
const NotFound = () => <div>404 Not Found</div>;

const AppRoutes: React.FC = () => {
  // This would typically come from auth state
  const isAuthenticated = false;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route 
        path="/profile" 
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} 
      />
      
      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 