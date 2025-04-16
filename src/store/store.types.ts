import { ProductDto, ProductFilterRequest } from '../features/products/models/product.dto';

// Define all the state interfaces here
export interface ProductState {
  products: ProductDto[];
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: ProductFilterRequest;
}

// The root state combines all feature states
export interface RootState {
  products: ProductState;
}

// We'll import this in both store.config.ts and product.slice.ts 