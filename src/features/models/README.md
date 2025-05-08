# Models Feature

This feature implements the ML Model Testing Platform functionality following Clean Architecture principles and using Inversify for dependency injection.

## Structure

The feature is organized according to Clean Architecture layers:

### Domain Layer
- **Entities & DTOs**: `/models/model.dto.ts` - Contains data transfer objects like `ModelDto`, `ModelFilterRequest`, `ModelListResponse`, etc.

### Repository Layer (Data Access)
- **Interfaces**: `/repositories/model.repository.interface.ts` - Defines the contract for data access
- **Implementations**: 
  - `/repositories/implementations/model-api.repository.ts` - API implementation
  - `/repositories/implementations/model-mock.repository.ts` - Mock implementation for testing

### Service Layer (Business Logic)
- **Interfaces**: `/services/model.service.interface.ts` - Defines service operations
- **Implementations**: `/services/implementations/model.service.ts` - Implements business logic

### Use Cases (Application Logic)
- **Interfaces**: 
  - `/useCases/interfaces/get-models.usecase.interface.ts`
  - `/useCases/interfaces/get-model-by-id.usecase.interface.ts` 
  - `/useCases/interfaces/test-model.usecase.interface.ts`
  - `/useCases/interfaces/get-model-test-history.usecase.interface.ts`
- **Implementations**:
  - `/useCases/implementations/get-models.usecase.ts`
  - `/useCases/implementations/get-model-by-id.usecase.ts`
  - `/useCases/implementations/test-model.usecase.ts`
  - `/useCases/implementations/get-model-test-history.usecase.ts`

## Dependency Injection

All components are registered in the Inversify container (`src/app/config/inversify.config.ts`) with appropriate symbols defined in `src/app/config/types.ts`.

## Usage

To use this feature in components:

```typescript
// In a React component
import { useEffect, useState } from 'react';
import { container } from '../../app/config/inversify.config';
import { TYPES } from '../../app/config/types';
import { IGetModelsUseCase } from '../models/useCases';
import { ModelDto } from '../models/models/model.dto';

const ModelsPage = () => {
  const [models, setModels] = useState<ModelDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getModelsUseCase = container.get<IGetModelsUseCase>(TYPES.GetModelsUseCase);
    
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await getModelsUseCase.execute();
        setModels(response.models);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, []);
  
  // Rest of component...
};
```

## API Implementation

The API repository implementation uses the application's HTTP client adapter to communicate with the backend API. The endpoints follow the structure defined in the API documentation.

## Error Handling

Each use case and service method includes error handling and logging to ensure robustness. 