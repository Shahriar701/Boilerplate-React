# React Frontend Boilerplate

A modern, robust TypeScript React frontend boilerplate built with SOLID principles, Clean Architecture, Dependency Injection, and a Use Case-driven approach.

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

## Architecture

The architecture follows a clean, layered approach with feature-based organization:

### Core Layers

1. **Domain Layer**: Core business entities and logic
2. **Application Layer**: Use cases that orchestrate business operations
3. **Infrastructure Layer**: Implementation details and external services
4. **Presentation Layer**: UI components and state management

### Key Concepts

- **Feature-Based Structure**: Code is organized by features rather than technical layers
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Use Case Driven Design**: Business operations are modeled as use cases
- **Repository Abstraction**: Data access is abstracted behind repositories
- **Adapter Pattern**: External services are wrapped in adapters

## Project Structure

```
src/
├── app/                      # App initialization
│   ├── App.tsx               # Main App component
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
│   │   ├── routes/           # Feature routes
│   │   └── store/            # Feature state
│   ├── users/                # User management
│   │   └── ...
│   └── products/             # Product management
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
├── store/                    # Global state (if needed)
├── errorBoundaries/          # Error handling
└── types/                    # Global TypeScript types
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

## Design Patterns & Principles

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

### Use Case Pattern

Each business operation is modeled as a use case:
- Use cases implement single responsibility principle
- Use cases orchestrate multiple services
- Use cases represent user intentions

## Adding New Features

1. Create folder structure in `src/features/<feature-name>`
2. Define domain entities in `src/domain/entities`
3. Create DTOs in `src/features/<feature-name>/models`
4. Implement repository interfaces & implementations
5. Implement service interfaces & implementations
6. Create use cases for business operations
7. Register dependencies in `src/app/config`
8. Implement UI components

## License

This project is licensed under the MIT License.
