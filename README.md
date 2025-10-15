## Table of Contents

1. [Overview](#overview)
2. [Architecture Foundations](#architecture-foundations)
3. [Project Structure](#project-structure)
4. [Core Architectural Components](#core-architectural-components)
   - [App and Main Files](#app-and-main-files)
   - [Domain Layer](#domain-layer)
   - [Features Organization](#features-organization)
   - [Infrastructure Layer](#infrastructure-layer)
   - [Shared Components](#shared-components)
   - [Store (State Management)](#store-state-management)
   - [Routes and Navigation](#routes-and-navigation)
   - [Adapters Pattern](#adapters-pattern)
5. [Clean Architecture Principles](#clean-architecture-principles)
6. [Getting Started](#getting-started)
7. [Adding New Features](#adding-new-features)

## Overview

This boilerplate implements industry best practices for frontend development:

- **TypeScript** with strict type checking
- **SOLID Principles** for maintainable code architecture
- **Clean Architecture** for separation of concerns
- **Dependency Injection** using InversifyJS
- **Use Case Pattern** for business logic orchestration
- **Repository Pattern** for data access abstraction
- **Service Layer** for business logic encapsulation
- **Feature-Based Organization** with vertical slicing
- **Adapter Pattern** for external services
- **React Router** for navigation
- **React Redux** for state management

## Architecture Foundations

### SOLID Principles

- **Single Responsibility**: Each class has one responsibility
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes can be substituted for their base types
- **Interface Segregation**: Specific interfaces instead of general ones
- **Dependency Inversion**: Depend on abstractions, not implementations

### Clean Architecture

The application follows clean architecture principles with:
- Domain as the center with no dependencies
- Use cases that depend only on domain
- Adapters that implement interfaces defined by use cases
- UI that depends on use cases

### Domain-Driven Design (DDD)

DDD is a software development approach that connects complex software implementation to an evolving model of the core business domain. Key elements include:

- **Ubiquitous Language**: A common language between developers and domain experts
- **Bounded Contexts**: Clear boundaries between different parts of the domain
- **Entities**: Objects with identities that can change over time
- **Value Objects**: Immutable objects without identity
- **Aggregates**: Clusters of entities and value objects treated as a unit
- **Domain Events**: Events that domain experts care about

## Project Structure

```
src/
├── app/                      # App initialization
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # Entry point
│   └── config/               # App configuration
│       ├── inversify.config.ts # DI container
│       └── types.ts          # DI types/symbols
├── domain/                   # Core business domain
│   ├── entities/             # Business objects
│   ├── valueObjects/         # Immutable value objects
│   └── events/               # Domain events
├── features/                 # Feature modules
│   ├── auth/                 # Authentication feature
│   │   ├── components/       # Presentation components
│   │   ├── containers/       # Container components
│   │   ├── useCases/         # Business logic orchestration
│   │   ├── services/         # Specific services
│   │   ├── repositories/     # Data access
│   │   ├── models/           # DTOs and types
│   │   ├── hooks/            # Custom hooks
│   │   └── store/            # Feature state
│   ├── products/             # Product management
│   │   └── ...
│   └── users/                # User management
│       └── ...
├── shared/                   # Shared modules
│   ├── components/           # Common UI components
│   ├── hooks/                # Common hooks
│   ├── utils/                # Utility functions
│   ├── constants/            # Constants and enums
│   └── styles/               # Common styles
├── infrastructure/           # External interfaces
│   ├── http/                 # HTTP client setup
│   ├── storage/              # Storage implementations
│   ├── logging/              # Logging service
│   └── analytics/            # Analytics implementation
├── adapters/                 # Adapters for external services
│   ├── api/                  # API adapters
│   ├── storage/              # Storage adapters
│   └── analytics/            # Analytics adapters
├── routes/                   # Routing configuration
├── store/                    # Global state management
├── errorBoundaries/          # Error handling
└── types/                    # Global TypeScript types
```

## Core Architectural Components

### App and Main Files

These files serve as the entry point and root component of your application.

#### main.tsx

The true entry point that bootstraps the React application:

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as InversifyProvider } from 'inversify-react';
import { container } from './app/config/inversify.config';
import { store } from './store';
import App from './app/App';
import './index.css';

// Create React root
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Configure DI container */}
    <InversifyProvider container={container}>
      {/* Configure global state */}
      <ReduxProvider store={store}>
        {/* Configure routing */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReduxProvider>
    </InversifyProvider>
  </React.StrictMode>
);
```

#### App.tsx

The root component defining the application's layout and structure:

```tsx
// src/app/App.tsx
import { Navigation } from '../shared/components/Navigation/Navigation';
import AppRoutes from '../routes/AppRoutes';
import { GlobalErrorBoundary } from '../errorBoundaries/GlobalErrorBoundary';

const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <div className="app-container">
        <header>
          <Navigation />
        </header>
        
        <main className="content-container">
          <AppRoutes />
        </main>
        
        <footer className="app-footer">
          <p>© 2023 Clean Architecture React App</p>
        </footer>
      </div>
    </GlobalErrorBoundary>
  );
};

export default App;
```

### Domain Layer

The domain layer represents the core business logic and entities.

#### Use Case Interface Example

```typescript
// src/features/products/useCases/UseCase.interface.ts
export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export interface IUseCaseNoInput<TOutput> {
  execute(): Promise<TOutput>;
}
```

### Features Organization

Features are the core organizational unit, structured around business capabilities rather than technical layers.

#### Feature Structure

```
features/products/
├── components/        # UI components (presentation)
├── containers/        # Container components (connect to services)
├── services/          # Business logic orchestration
│   ├── implementations/
│   └── product.service.interface.ts
├── repositories/      # Data access
│   ├── implementations/
│   └── product.repository.interface.ts
├── useCases/          # Business operations
│   └── implementations/
├── models/            # DTOs and types
└── store/             # Feature-specific state (optional)
```

#### Service Interface Example

```typescript
// src/features/auth/services/auth.service.interface.ts
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../models/auth.dto";

export interface IAuthService {
  login(request: LoginRequest): Promise<LoginResponse>;
  register(request: RegisterRequest): Promise<RegisterResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserDto | null>;
  isAuthenticated(): boolean;
}
```

#### Repository Interface Example

```typescript
// src/features/products/repositories/product.repository.interface.ts
import { Product, ProductCreationDto, ProductUpdateDto } from "../models/product.model";

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(product: ProductCreationDto): Promise<Product>;
  update(product: ProductUpdateDto): Promise<Product>;
  delete(id: string): Promise<void>;
}
```

#### Container Component Example

```tsx
// src/features/products/containers/ProductsPage.tsx
import { useEffect, useState } from 'react';
import { useInjection } from 'inversify-react';
import { IProductService } from '../services/product.service.interface';
import { ProductList } from '../components/ProductList';
import { TYPES } from '../../../app/config/types';
import { ProductDto } from '../models/product.dto';

export const ProductsPage: React.FC = () => {
  const productService = useInjection<IProductService>(TYPES.IProductService);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await productService.getProducts();
        setProducts(result);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [productService]);
  
  return (
    <div className="products-page">
      <h1>Products</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
};
```

### Infrastructure Layer

The infrastructure layer provides implementations of technical capabilities.

#### Logger Service Example

```typescript
// src/infrastructure/logging/logger.service.interface.ts
export interface ILoggerService {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

// src/infrastructure/logging/console-logger.service.ts
import { injectable } from 'inversify';
import { ILoggerService } from './logger.service.interface';

@injectable()
export class ConsoleLoggerService implements ILoggerService {
  debug(message: string, ...args: any[]): void {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
  
  info(message: string, ...args: any[]): void {
    console.info(`[INFO] ${message}`, ...args);
  }
  
  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }
  
  error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }
}
```

### Shared Components

The shared folder houses components, utilities, and resources used across multiple features.

```
shared/
├── components/        # Reusable UI components
├── hooks/             # Custom hooks
├── utils/             # Utility functions
├── constants/         # Constants and enums
└── styles/            # Common styles
```

#### Shared Component Example

```tsx
// src/shared/components/Navigation/Navigation.tsx
import { Link } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { IAuthService } from '../../../features/auth/services/auth.service.interface';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const authService = useInjection<IAuthService>(TYPES.IAuthService);
  const isAuthenticated = authService.isAuthenticated();
  
  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };
  
  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">Clean Architecture App</Link>
      </div>
      
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};
```

### Store (State Management)

The store folder manages global application state using Redux.

#### Store Configuration

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './products/productsSlice';
import authReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Feature Slice Example

```typescript
// src/store/products/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDto } from '../../features/products/models/product.dto';

interface ProductsState {
  products: ProductDto[];
  selectedProductId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedProductId: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductDto[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    selectProduct: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setProducts, selectProduct, setLoading, setError } = productsSlice.actions;
export default productsSlice.reducer;
```

#### Custom Hooks for Store

```typescript
// src/store/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Routes and Navigation

The routing system manages navigation and access control.

```typescript
// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../features/home/containers/HomePage';
import { LoginPage } from '../features/auth/containers/LoginPage';
import { RegisterPage } from '../features/auth/containers/RegisterPage';
import { ProductsPage } from '../features/products/containers/ProductsPage';
import { ProfilePage } from '../features/users/containers/ProfilePage';
import { ProtectedRoute } from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
```

#### Protected Route Implementation

```typescript
// src/routes/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../app/config/types';
import { IAuthService } from '../features/auth/services/auth.service.interface';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const authService = useInjection<IAuthService>(TYPES.IAuthService);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, [authService]);
  
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
```

### Adapters Pattern

Adapters translate between your application and external systems.

```typescript
// src/adapters/api/http-client.interface.ts
export interface IHttpClient {
  get<T>(url: string, params?: Record<string, any>): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

// src/adapters/api/axios-http-client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { injectable } from 'inversify';
import { IHttpClient } from './http-client.interface';

@injectable()
export class AxiosHttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance;
  
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const config: AxiosRequestConfig = { params };
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }
  
  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data);
    return response.data;
  }
  
  async put<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data);
    return response.data;
  }
  
  async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url);
    return response.data;
  }
}
```

## Clean Architecture Principles

### Dependency Inversion 

Dependencies flow inward, with outer layers depending on abstractions:

```typescript
// src/app/config/types.ts
export const TYPES = {
  // Services
  IAuthService: Symbol.for('IAuthService'),
  IProductService: Symbol.for('IProductService'),
  IUserService: Symbol.for('IUserService'),
  
  // Repositories
  IAuthRepository: Symbol.for('IAuthRepository'),
  IProductRepository: Symbol.for('IProductRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  
  // Infrastructure
  IHttpClient: Symbol.for('IHttpClient'),
  IStorageService: Symbol.for('IStorageService'),
  ILoggerService: Symbol.for('ILoggerService'),
  
  // Use Cases
  GetProductsUseCase: Symbol.for('GetProductsUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  // Other use cases...
};
```

### Dependency Registration

```typescript
// src/app/config/inversify.config.ts
import { Container } from 'inversify';
import { TYPES } from './types';

// Services
import { IAuthService } from '../../features/auth/services/auth.service.interface';
import { AuthService } from '../../features/auth/services/implementations/auth.service';
import { IProductService } from '../../features/products/services/product.service.interface';
import { ProductService } from '../../features/products/services/implementations/product.service';

// Repositories
import { IAuthRepository } from '../../features/auth/repositories/auth.repository.interface';
import { AuthApiRepository } from '../../features/auth/repositories/implementations/auth-api.repository';
import { IProductRepository } from '../../features/products/repositories/product.repository.interface';
import { ProductApiRepository } from '../../features/products/repositories/implementations/product-api.repository';

// Infrastructure
import { IHttpClient } from '../../adapters/api/http-client.interface';
import { AxiosHttpClient } from '../../adapters/api/axios-http-client';
import { ILoggerService } from '../../infrastructure/logging/logger.service.interface';
import { ConsoleLoggerService } from '../../infrastructure/logging/console-logger.service';

const container = new Container();

// Register services
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<IProductService>(TYPES.IProductService).to(ProductService).inSingletonScope();

// Register repositories
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthApiRepository).inSingletonScope();
container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductApiRepository).inSingletonScope();

// Register infrastructure
container.bind<IHttpClient>(TYPES.IHttpClient).to(AxiosHttpClient).inSingletonScope();
container.bind<ILoggerService>(TYPES.ILoggerService).to(ConsoleLoggerService).inSingletonScope();

export { container };
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd react-frontend-boilerplate
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start development server
   ```
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code using Prettier

## Adding New Features

Follow these steps to add a new feature to the application:

1. **Define Domain Entities**: Create any new domain entities in `src/domain/entities`

2. **Create Feature Folder**: Create a new folder in `src/features/<feature-name>` with the required structure:
   ```
   features/new-feature/
   ├── components/
   ├── containers/
   ├── services/
   ├── repositories/
   ├── useCases/
   └── models/
   ```

3. **Define DTOs and Models**: Create data transfer objects in `models/` folder

4. **Create Repository Interface**: Define how data will be accessed
   ```typescript
   // src/features/new-feature/repositories/new-feature.repository.interface.ts
   export interface INewFeatureRepository {
     // Define methods
   }
   ```

5. **Implement Repository**: Create a concrete implementation
   ```typescript
   // src/features/new-feature/repositories/implementations/new-feature-api.repository.ts
   @injectable()
   export class NewFeatureApiRepository implements INewFeatureRepository {
     // Implement methods
   }
   ```

6. **Create Service Interface**: Define business operations
   ```typescript
   // src/features/new-feature/services/new-feature.service.interface.ts
   export interface INewFeatureService {
     // Define methods
   }
   ```

7. **Implement Service**: Create a concrete implementation
   ```typescript
   // src/features/new-feature/services/implementations/new-feature.service.ts
   @injectable()
   export class NewFeatureService implements INewFeatureService {
     // Implement methods
   }
   ```

8. **Create Use Cases**: For complex operations
   ```typescript
   // src/features/new-feature/useCases/GetNewFeatureUseCase.ts
   @injectable()
   export class GetNewFeatureUseCase implements IUseCase<InputType, OutputType> {
     // Implement use case
   }
   ```

9. **Register Dependencies**: Update the DI container in `src/app/config`
   ```typescript
   // Update types.ts
   export const TYPES = {
     // Existing types...
     INewFeatureService: Symbol.for('INewFeatureService'),
     INewFeatureRepository: Symbol.for('INewFeatureRepository'),
   };

   // Update inversify.config.ts
   container.bind<INewFeatureService>(TYPES.INewFeatureService)
     .to(NewFeatureService).inSingletonScope();
   container.bind<INewFeatureRepository>(TYPES.INewFeatureRepository)
     .to(NewFeatureApiRepository).inSingletonScope();
   ```

10. **Create UI Components**: Implement presentation components

11. **Create Container Components**: Connect to services and state
    ```tsx
    // src/features/new-feature/containers/NewFeaturePage.tsx
    export const NewFeaturePage: React.FC = () => {
      const newFeatureService = useInjection<INewFeatureService>(TYPES.INewFeatureService);
      // Component implementation
    };
    ```

12. **Add Routes**: Update `AppRoutes.tsx` with new routes
    ```tsx
    // Add to AppRoutes.tsx
    <Route path="/new-feature" element={<NewFeaturePage />} />
    ```

13. **Update Navigation**: Add links to the new feature

By following these steps, you maintain the clean architecture and separation of concerns while extending the application with new features.

## License

This project is licensed under the MIT License.

# ML Model Testing Platform Frontend

A React application for testing and evaluating machine learning models.

## Authentication System

This project includes a complete authentication system with the following features:

- User login and registration
- Protected routes that require authentication
- User profile information in the header
- Persistent authentication via localStorage

### Demo Credentials

The application comes with two pre-configured user accounts for testing:

1. **Regular User**
   - Email: `user@example.com`
   - Password: `password123`

2. **Admin User**
   - Email: `admin@example.com`
   - Password: `admin123`

### Authentication Flow

1. Unauthenticated users are redirected to the login page
2. After successful authentication, users are redirected to the Models page
3. The header displays the logged-in user's name and provides a dropdown menu for logout
4. Authentication state persists across page refreshes

### Implementation Details

The authentication system is built using the following components:

- **AuthContext**: Provides authentication state and methods throughout the application
- **ProtectedRoute**: Wraps components that require authentication and redirects unauthenticated users
- **LoginPage / RegisterPage**: User-friendly forms for authentication
- **Header**: Displays authentication status and user information

## ML Models

The application showcases machine learning models with the following features:

- List view of available models with details (accuracy, last tested date)
- Detailed model view with specifications
- Interactive model testing interface

## Development

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Build

To build the application for production:

```
npm run build
```

## Implementation Notes

- The authentication system uses localStorage for persistence
- All API calls are simulated with timeouts to mimic real-world behavior
- The application uses dummy data for demonstration purposes

## Future Enhancements

- Connect to a real backend API
- Add user profile management
- Implement model result history
- Add real-time notifications for test results

## API Endpoints

The following endpoints are required by the frontend application:

### Authentication Endpoints

#### 1. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Payload**:
```typescript
{
  name: string;
  email: string;
  password: string;
}
```
- **Response**:
```typescript
{
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  token?: string;
  message?: string;
}
```

#### 2. User Login
- **Endpoint**: `POST /api/auth/login`
- **Payload**:
```typescript
{
  email: string;
  password: string;
}
```
- **Response**:
```typescript
{
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  token?: string;
  message?: string;
}
```

#### 3. User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```typescript
{
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
```

### Models Endpoints

#### 4. Get All Models
- **Endpoint**: `GET /api/models`
- **Query Parameters**: 
  - `page?: number`
  - `limit?: number`
  - `search?: string` 
  - `sortBy?: string`
  - `sortDirection?: 'asc' | 'desc'`
- **Response**:
```typescript
{
  models: [
    {
      id: string;
      name: string;
      description: string;
      accuracy: number;
      lastTested: string;
      imageUrl: string;
      inputType: 'text' | 'image' | 'audio' | 'json';
      outputType: 'text' | 'image' | 'audio' | 'json';
    }
  ];
  totalCount: number;
  page: number;
  totalPages: number;
}
```

#### 5. Get Model by ID
- **Endpoint**: `GET /api/models/{id}`
- **Response**:
```typescript
{
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTested: string;
  imageUrl: string;
  inputType: 'text' | 'image' | 'audio' | 'json';
  outputType: 'text' | 'image' | 'audio' | 'json';
  details: {
    framework: string;
    version: string;
    size: string;
    type: string;
    created: string;
    author: string;
  }
}
```

#### 6. Test Model
- **Endpoint**: `POST /api/models/{id}/test`
- **Headers**: `Authorization: Bearer {token}`
- **Payload** (varies based on inputType):
  
  For text input:
  ```typescript
  {
    text: string;
  }
  ```
  
  For image input:
  ```typescript
  {
    imageUrl: string; // Base64 or URL
  }
  ```
  
  For audio input:
  ```typescript
  {
    audioUrl: string; // Base64 or URL
  }
  ```
  
  For JSON input:
  ```typescript
  {
    data: any; // JSON object
  }
  ```

- **Response** (varies based on outputType):
  
  For text output:
  ```typescript
  {
    text: string;
  }
  ```
  
  For image output:
  ```typescript
  {
    imageUrl: string;
    annotations?: Array<{
      id: number;
      label: string;
      confidence: number;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    }>
  }
  ```
  
  For audio output:
  ```typescript
  {
    audioUrl: string;
    transcript?: string;
  }
  ```
  
  For JSON output:
  ```typescript
  {
    analysis: any; // JSON object with results
  }
  ```

#### 7. Get Model Test History
- **Endpoint**: `GET /api/models/{id}/tests`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `page?: number`
  - `limit?: number`
- **Response**:
```typescript
{
  tests: [
    {
      id: string;
      modelId: string;
      timestamp: string;
      input: {
        type: 'text' | 'image' | 'audio' | 'json';
        data: any; // Depends on input type
      };
      output: {
        type: 'text' | 'image' | 'audio' | 'json';
        data: any; // Depends on output type
      };
      executionTimeMs: number;
    }
  ];
  totalCount: number;
  page: number;
  totalPages: number;
}
```

### Additional Endpoints

#### 8. User's Model Test History (across all models)
- **Endpoint**: `GET /api/user/tests`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `page?: number`
  - `limit?: number`
  - `modelId?: string` (optional filter by model)
- **Response**: Same as the model test history response

#### 9. Update User Profile
- **Endpoint**: `PUT /api/auth/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Payload**:
```typescript
{
  name?: string;
  email?: string;
  password?: string; // If changing password
  currentPassword?: string; // Required for password change
}
```
- **Response**:
```typescript
{
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  message?: string;
}
```

#### 10. Refresh Authentication Token
- **Endpoint**: `POST /api/auth/refresh-token`
- **Payload**:
```typescript
{
  refreshToken: string;
}
```
- **Response**:
```typescript
{
  success: boolean;
  token?: string;
  refreshToken?: string;
  message?: string;
}
```

### Standard API Response Structure

For consistency, the backend implements a standard response format:

```typescript
{
  success: boolean;
  data?: any; // The actual response data
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    totalPages?: number;
    totalCount?: number;
  };
}
```
