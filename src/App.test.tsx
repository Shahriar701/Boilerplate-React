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
  container: {}
}));

// Mock the router to avoid navigation issues
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: () => <div data-testid="mock-routes" />,
  Route: () => null,
  Navigate: () => null
}));

// Mock the AppRoutes component
jest.mock('./routes/AppRoutes', () => () => <div data-testid="mock-routes">Routes Mock</div>);

describe('App', () => {
  it('renders the app container', () => {
    render(<App />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('app-container');
  });

  it('renders the routes', () => {
    render(<App />);
    const routesElement = screen.getByTestId('mock-routes');
    expect(routesElement).toBeInTheDocument();
  });
}); 