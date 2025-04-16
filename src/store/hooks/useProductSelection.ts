import { useEffect } from 'react';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../app/config/types';
import { IProductService } from '../../features/products/services/product.service.interface';
import { useAppDispatch, useAppSelector } from '../store.config';
import {
  loadSelectedIds,
  selectProduct,
  unselectProduct,
  clearSelectedProducts,
  selectProductsSelectedIds
} from '../slices/product.slice';

/**
 * Custom hook to handle product selection, syncing between Redux and the service layer
 */
export const useProductSelection = () => {
  const dispatch = useAppDispatch();
  const productService = useInjection<IProductService>(TYPES.ProductService);
  const selectedIds = useAppSelector(selectProductsSelectedIds) || [];

  // On initial load, get the selected product IDs from the service
  useEffect(() => {
    const loadInitialSelection = async () => {
      try {
        const ids = await productService.getSelectedProductIds();
        if (ids && ids.length > 0) {
          dispatch(loadSelectedIds(ids));
        }
      } catch (error) {
        console.error('Error loading selected products:', error);
      }
    };

    loadInitialSelection();
  }, [dispatch, productService]);

  // Selection operations
  const handleSelectProduct = (id: string) => {
    if (id) {
      dispatch(selectProduct(id));
    }
  };

  const handleUnselectProduct = (id: string) => {
    if (id) {
      dispatch(unselectProduct(id));
    }
  };

  const handleClearSelectedProducts = () => {
    dispatch(clearSelectedProducts());
  };

  return {
    selectedIds,
    selectProduct: handleSelectProduct,
    unselectProduct: handleUnselectProduct,
    clearSelectedProducts: handleClearSelectedProducts
  };
}; 