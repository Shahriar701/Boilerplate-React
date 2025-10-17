import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, setGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page they were trying to access
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/models';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password. Try using user@example.com / password123 or admin@example.com / admin123');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    setGuestMode(true);
    navigate('/models', { replace: true });
  };

  return (
    <div className="auth-page">
      <Header />
      
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Sign In</h1>
          <p className="auth-description">
            Sign in to access ML model testing platform
          </p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="e.g. user@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="e.g. password123"
              />
            </div>
            
            <div className="form-group remember-me">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#reset-password" className="forgot-password">Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className="auth-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Create an account</Link>
            </p>
            <div className="guest-access">
              <hr className="divider" />
              <p className="guest-text">Just want to explore?</p>
              <button onClick={handleGuestAccess} className="guest-button">
                Browse Models as Guest
              </button>
              <p className="guest-note">
                Browse and view models without an account. Sign in to test models with your own data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 