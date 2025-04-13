import React from 'react';
import { UserDto } from '../../auth/models/auth.dto';

interface UserProfileProps {
  user: UserDto | null;
  isLoading: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="error-message">User information not available</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>
      
      <div className="profile-content">
        <div className="profile-field">
          <label>Name:</label>
          <span>{user.name}</span>
        </div>
        
        <div className="profile-field">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        
        <div className="profile-field">
          <label>User ID:</label>
          <span>{user.id}</span>
        </div>
        
        <div className="profile-field">
          <label>Roles:</label>
          <span>
            {user.roles.length > 0 
              ? user.roles.join(', ') 
              : 'No roles assigned'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 