import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from '../models/auth.dto';

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  error = null 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await onSubmit({ email, password });
    } catch (err) {
      console.error('Login form submission error:', err);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={validationErrors.email ? 'input-error' : ''}
          />
          {validationErrors.email && (
            <div className="error-text">{validationErrors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={validationErrors.password ? 'input-error' : ''}
          />
          {validationErrors.password && (
            <div className="error-text">{validationErrors.password}</div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      
      <div className="auth-links">
        <p>
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="link-button"
            disabled={isLoading}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 