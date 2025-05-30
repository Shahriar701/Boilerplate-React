import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// User data structure
export interface UserDto {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDto | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  getToken: () => string | null;
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
  },
  {
    id: 'testuser123',
    name: 'Test User 123',
    email: 'test@test.com',
    password: 'test',
    roles: ['user']
  }
];

// Use the same prefix as the storage service
const TOKEN_KEY = 'app_token';
const USER_KEY = 'app_user';

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
    try {
      // Find user with matching credentials
      const foundUser = DUMMY_USERS.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        const userDto: UserDto = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          roles: foundUser.roles,
          isActive: true,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Generate a token in the format the backend expects
        // Format: dummy-jwt-{userId}-{timestamp}-{random}
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const token = `dummy-jwt-${foundUser.id}-${timestamp}-${random}`;

        // Store user and token with app_ prefix (same as storage service)
        localStorage.setItem(USER_KEY, JSON.stringify(userDto));
        localStorage.setItem(TOKEN_KEY, token);

        setUser(userDto);
        
        console.log(`🔐 User logged in: ${userDto.name} (${userDto.id})`);
        console.log(`🎫 Generated token: ${token}`);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
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
      roles: ['user'],
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Generate a fake token with user ID embedded
    const token = `dummy-jwt-${newUser.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Store with app_ prefix (same as storage service)
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    
    // Update state
    setUser(newUser);
    return true;
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  };

  const authContextValue = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    login,
    register,
    logout,
    isLoading,
    getToken
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={authContextValue}>
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
