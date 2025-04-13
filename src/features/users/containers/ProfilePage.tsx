import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { IAuthService } from '../../auth/services/auth.service.interface';
import { UserDto } from '../../auth/models/auth.dto';
import UserProfile from '../components/UserProfile';

const ProfilePage: React.FC = () => {
  const authService = useInjection<IAuthService>(TYPES.AuthService);

  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for freshLogin flag and clear it
    const freshLogin = sessionStorage.getItem('freshLogin');
    if (freshLogin === 'true') {
      console.log('Detected fresh login, clearing flag');
      sessionStorage.removeItem('freshLogin');
    }

    const fetchUserProfile = async () => {
      // Check authentication status
      const isAuthenticated = authService.isAuthenticated();
      console.log('Authentication status:', isAuthenticated);

      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        // Get user data from auth service
        const userData = authService.getCurrentUser();
        console.log('Current user data:', userData);

        if (!userData) {
          console.error('User data is null despite being authenticated');
          throw new Error('User data not found');
        }

        setUser(userData);
      } catch (err) {
        console.error('Error details:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load user profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [authService, navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();

      // Use window.location to ensure a full page reload after logout
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="page-container">
      <div className="profile-page">
        {error && <div className="error-message">{error}</div>}

        <UserProfile user={user} isLoading={isLoading} />

        {!isLoading && user && (
          <div className="profile-actions">
            <button
              className="btn-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 