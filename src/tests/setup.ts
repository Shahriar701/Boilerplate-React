import 'reflect-metadata';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.VITE_API_URL = 'http://localhost:3000/api';
process.env.VITE_API_BASE_URL = 'http://localhost:3000/api';
process.env.VITE_DEV = 'true';
process.env.VITE_MODE = 'test';
process.env.VITE_PROD = 'false';

// Set longer timeout for tests
jest.setTimeout(10000); 