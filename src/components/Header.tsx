import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/header.css';

interface HeaderProps {
  title?: string;
  showTitle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Model Zoo',
  showTitle = true
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    await logout();
    navigate('/models');
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
          <span className="primary-text">Model Zoo</span>
        </h1>
      );
    }
    
    // For detail pages (with title)
    if (title.startsWith('Test:')) {
      const modelName = title.replace('Test:', '').trim();
      return (
        <h1>
          <span className="header-highlight">Model Zoo:</span> {modelName}
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
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-controls">
            <div className="user-info">
              <span className="guest-status">Guest User</span>
            </div>
            <div className="auth-buttons">
              <Link 
                to="/login" 
                state={{ from: location }}
                className="login-link"
              >
                Sign In
              </Link>
              <Link to="/register" className="register-button">Create Account</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 