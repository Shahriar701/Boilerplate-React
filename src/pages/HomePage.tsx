import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/models');
  }, [navigate]);

  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>Redirecting...</p>
    </div>
  );
};

export default HomePage; 