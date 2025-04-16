import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductDto, ProductFilterRequest, ProductListResponse } from '../../features/products/models/product.dto';
import { container } from '../../app/config/inversify.config';
import { TYPES } from '../../app/config/types';
import { IProductService } from '../../features/products/services/product.service.interface';
import { ProductState } from '../store.types';
import type { RootState } from '../store.config';

// Get the product service from the container
const productService = container.get<IProductService>(TYPES.ProductService);

// Initial state
const initialState: ProductState = {
  products: [],
  selectedIds: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  },
  filters: {
    page: 1,
    pageSize: 10
  }
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilterRequest, { rejectWithValue }) => {
    try {
      return await productService.getProducts(filters);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const product = await productService.getProductById(id);
      if (!product) {
        return rejectWithValue('Product not found');
      }
      return product;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product: Omit<ProductDto, 'id'>, { rejectWithValue, dispatch }) => {
    try {
      const newProduct = await productService.createProduct(product);
      // Refresh product list after creation
      dispatch(fetchProducts(initialState.filters));
      return newProduct;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Partial<ProductDto> }, { rejectWithValue }) => {
    try {
      return await productService.updateProduct(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await productService.deleteProduct(id);
      if (!success) {
        return rejectWithValue('Failed to delete product');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete product');
    }
  }
);

// Create the slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Local selection management actions
    selectProduct: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.selectedIds.includes(id)) {
        state.selectedIds.push(id);
        // Also update the service's selected items
        void productService.selectProduct(id);
      }
    },
    unselectProduct: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.selectedIds = state.selectedIds.filter(selectedId => selectedId !== id);
      // Also update the service's selected items
      void productService.unselectProduct(id);
    },
    clearSelectedProducts: (state) => {
      state.selectedIds = [];
      // Also update the service's selected items
      void productService.clearSelectedProducts();
    },
    loadSelectedIds: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    setFilters: (state, action: PayloadAction<ProductFilterRequest>) => {
      state.filters = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductListResponse>) => {
        state.isLoading = false;
        state.products = action.payload.items || [];
        state.pagination = {
          total: action.payload.total || 0,
          page: action.payload.page || 1,
          pageSize: action.payload.pageSize || 10,
          totalPages: action.payload.totalPages || 1
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch products';
        state.products = [];
      })
      
      // Update product
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<ProductDto>) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter(p => p.id !== action.payload);
        state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
      });
  }
});

// Export actions
export const { 
  selectProduct, 
  unselectProduct, 
  clearSelectedProducts, 
  loadSelectedIds,
  setFilters
} = productSlice.actions;

// Export reducer
export const productReducer = productSlice.reducer;

// Selectors with type assertions to help TypeScript understand the state structure
export const selectProductsList = (state: RootState) => {
  const products = (state as any).products?.products;
  return products || [];
};

export const selectProductsLoading = (state: RootState) => {
  const isLoading = (state as any).products?.isLoading;
  return isLoading === undefined ? false : isLoading;
};

export const selectProductsError = (state: RootState) => {
  const error = (state as any).products?.error;
  return error || null;
};

export const selectProductsPagination = (state: RootState) => {
  const pagination = (state as any).products?.pagination;
  return pagination || {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  };
};

export const selectProductsFilters = (state: RootState) => {
  const filters = (state as any).products?.filters;
  return filters || {
    page: 1,
    pageSize: 10
  };
};

export const selectProductsSelectedIds = (state: RootState) => {
  const selectedIds = (state as any).products?.selectedIds;
  return selectedIds || [];
}; 