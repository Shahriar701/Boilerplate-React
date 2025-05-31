import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock import.meta.env
jest.mock('./vite-env.d.ts', () => ({
  importMeta: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000/api',
      DEV: true,
      MODE: 'test',
      PROD: false
    }
  }
}));

// Mock the container to avoid dependency injection issues
jest.mock('./app/config/inversify.config', () => ({
  container: {
    get: () => ({
      isAuthenticated: () => false,
      login: () => Promise.resolve(null),
      logout: () => Promise.resolve(),
      register: () => Promise.resolve(null),
      getCurrentUser: () => null
    })
  }
}));

// Mock AppRoutes to avoid testing routing logic here
jest.mock('./routes/AppRoutes', () => () => <div data-testid="app-routes">Routes Component</div>);

describe('App', () => {
  it('renders the application with providers', () => {
    render(<App />);
    
    // Verify AppRoutes is rendered
    const routesComponent = screen.getByTestId('app-routes');
    expect(routesComponent).toBeInTheDocument();
    expect(routesComponent).toHaveTextContent('Routes Component');
  });

  it('renders within error boundary', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });
}); 