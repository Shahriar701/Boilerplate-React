import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// User data structure
export interface UserDto {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDto | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Dummy users for testing
const DUMMY_USERS = [
  {
    id: 'user-1',
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    roles: ['user']
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    roles: ['admin', 'user']
  }
];

const TOKEN_KEY = 'ml_platform_token';
const USER_KEY = 'ml_platform_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const userJson = localStorage.getItem(USER_KEY);
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching credentials
    const foundUser = DUMMY_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      // Create a user object without the password
      const userData: UserDto = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        roles: foundUser.roles
      };
      
      // Generate a fake token with user ID embedded
      const token = `dummy-jwt-${userData.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Store in localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    if (DUMMY_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    
    // Create new user
    const newUser: UserDto = {
      id: `user-${Date.now()}`,
      name,
      email,
      roles: ['user']
    };
    
    // Generate a fake token with user ID embedded
    const token = `dummy-jwt-${newUser.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    
    // Update state
    setUser(newUser);
    return true;
  };

  const logout = async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Update state
    setUser(null);
  };

  const data = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    login,
    register,
    logout,
    isLoading
  }), [user, isLoading]);
  return (
    <AuthContext.Provider
      value={
        data
      }
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 