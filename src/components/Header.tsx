import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/header.css';

interface HeaderProps {
  title?: string;
  showTitle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'ML Model Platform',
  showTitle = true
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Render the appropriate header title based on the current page
  const renderHeaderContent = () => {
    // For the models list page (no title)
    if (!showTitle) {
      return (
        <h1 className="models-hero-title">
          <span className="primary-text">AI Models</span>
          <span className="secondary-text">Testing Platform</span>
        </h1>
      );
    }
    
    // For detail pages (with title)
    if (title.startsWith('Test:')) {
      const modelName = title.replace('Test:', '').trim();
      return (
        <h1>
          <span className="header-highlight">AI Model Explorer:</span> {modelName}
        </h1>
      );
    }
    
    // For other pages
    return <h1>{title}</h1>;
  };
  
  return (
    <header className="header">
      <Link to="/" className="logo">
        {renderHeaderContent()}
      </Link>
      
      <div className="header-actions">
        {isAuthenticated ? (
          <div className="auth-controls">
            <span className="user-greeting">{user?.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-link">Sign In</Link>
            <Link to="/register" className="register-button">Create Account</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 