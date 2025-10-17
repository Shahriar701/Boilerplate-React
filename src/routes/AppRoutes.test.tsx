import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { IAuthService } from '../features/auth/services/auth.service.interface';
import { container } from '../app/config/inversify.config';

// Mock lazy-loaded components
jest.mock('../pages/LoginPage', () => () => <div>Login Page</div>);
jest.mock('../pages/RegisterPage', () => () => <div>Register Page</div>);
jest.mock('../features/models/containers/ModelsPage', () => () => <div>Models Page</div>);
jest.mock('../features/models/containers/ModelDetailPage', () => () => <div>Model Detail Page</div>);
jest.mock('../pages/HomePage', () => () => <div>Home Page</div>);

// Mock AuthService
const mockAuthService: jest.Mocked<IAuthService> = {
  isAuthenticated: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  getCurrentUser: jest.fn(),
};

// Mock container
jest.mock('../app/config/inversify.config', () => ({
  container: {
    get: () => mockAuthService
  }
}));

const renderWithRouter = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>
  );
};

describe('AppRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders home page for guests', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    renderWithRouter('/');
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders login page', () => {
    renderWithRouter('/login');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders register page', () => {
    renderWithRouter('/register');
    expect(screen.getByText('Register Page')).toBeInTheDocument();
  });

  it('renders models page for guests', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    renderWithRouter('/models');
    expect(screen.getByText('Models Page')).toBeInTheDocument();
  });

  describe('protected routes', () => {
    describe('when authenticated', () => {
      beforeEach(() => {
        mockAuthService.isAuthenticated.mockReturnValue(true);
      });

      it('renders model detail page', () => {
        renderWithRouter('/models/123');
        expect(screen.getByText('Model Detail Page')).toBeInTheDocument();
      });
    });

    describe('when guest', () => {
      beforeEach(() => {
        mockAuthService.isAuthenticated.mockReturnValue(false);
      });

      it('allows access to model detail page', () => {
        renderWithRouter('/models/123');
        expect(screen.getByText('Model Detail Page')).toBeInTheDocument();
      });

      it('allows access to models page', () => {
        renderWithRouter('/models');
        expect(screen.getByText('Models Page')).toBeInTheDocument();
      });
    });
  });

  it('redirects to models page for unknown routes', () => {
    renderWithRouter('/unknown');
    expect(screen.getByText('Models Page')).toBeInTheDocument();
  });
}); 