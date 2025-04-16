import React, { useEffect, useState } from 'react';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { IProductService } from '../services/product.service.interface';
import { IAuthService } from '../../../features/auth/services/auth.service.interface';
import { ProductDto, ProductFilterRequest } from '../models/product.dto';
import ProductList from '../components/ProductList';
import { useAppDispatch, useAppSelector } from '../../../store/store.config';
import { 
    fetchProducts, 
    setFilters, 
    updateProduct, 
    deleteProduct, 
    createProduct as createProductAction,
    selectProductsList,
    selectProductsLoading,
    selectProductsError,
    selectProductsPagination,
    selectProductsFilters
} from '../../../store/slices/product.slice';
import { useProductSelection } from '../../../store/hooks/useProductSelection';

const ProductsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const productService = useInjection<IProductService>(TYPES.ProductService);
    const authService = useInjection<IAuthService>(TYPES.AuthService);
    
    // Get product state from Redux using selectors with default values to prevent undefined errors
    const products = useAppSelector(selectProductsList) || [];
    const isLoading = useAppSelector(selectProductsLoading) || false;
    const error = useAppSelector(selectProductsError) || null;
    const pagination = useAppSelector(selectProductsPagination) || {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1
    };
    const filters = useAppSelector(selectProductsFilters) || {
        page: 1,
        pageSize: 10
    };
    
    // Get product selection functionality from custom hook
    const { selectedIds, selectProduct, unselectProduct, clearSelectedProducts } = useProductSelection();
    
    const [isAdmin, setIsAdmin] = useState(false);

    // Debug info for products
    useEffect(() => {
        console.log('Products length:', products?.length || 0);
        console.log('Products data:', products);
        console.log('Loading state:', isLoading);
        console.log('Error state:', error);
        console.log('Pagination:', pagination);
    }, [products, isLoading, error, pagination]);

    useEffect(() => {
        // Check if user has admin role
        const currentUser = authService.getCurrentUser();
        setIsAdmin(currentUser && currentUser.roles ? currentUser.roles.includes('admin') : false);

        // Fetch products on component mount and when filters change
        if (filters) {
            console.log('Fetching products with filters:', filters);
            dispatch(fetchProducts(filters));
        }
    }, [dispatch, authService, filters]);

    const handleSelectProduct = (id: string) => {
        selectProduct(id);
    };

    const handleUnselectProduct = (id: string) => {
        unselectProduct(id);
    };

    const handleClearSelected = () => {
        clearSelectedProducts();
    };

    const handleViewSelected = async () => {
        if (!selectedIds || selectedIds.length === 0) {
            return;
        }

        try {
            const selectedProducts = await productService.getSelectedProducts(selectedIds);
            console.log('Selected products:', selectedProducts);
            // We could dispatch a custom action here to set the filtered products
            // For now, we'll just use the existing state management
        } catch (err) {
            console.error('Error loading selected products:', err);
        }
    };

    const handleViewAll = () => {
        dispatch(setFilters({
            page: 1,
            pageSize: 10
        }));
    };

    // Admin functionality
    const handleCreateProduct = async (product: Omit<ProductDto, 'id'>) => {
        if (!isAdmin) {
            console.error('Only admins can create products');
            return;
        }

        dispatch(createProductAction(product));
    };

    const handleUpdateProduct = (id: string, product: Partial<ProductDto>) => {
        if (!isAdmin) {
            console.error('Only admins can update products');
            return;
        }

        dispatch(updateProduct({ id, data: product }));
    };

    const handleDeleteProduct = (id: string) => {
        if (!isAdmin) {
            console.error('Only admins can delete products');
            return;
        }

        dispatch(deleteProduct(id));
    };

    // Safely calculate the number of selected items
    const selectedCount = selectedIds ? selectedIds.length : 0;

    return (
        <div className="page-container">
            <div className="products-page">
                <div className="page-header">
                    <h1>Products</h1>
                    <div className="view-actions">
                        <button
                            className="btn-secondary"
                            disabled={selectedCount === 0}
                            onClick={handleViewSelected}
                        >
                            View Selected ({selectedCount})
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={handleViewAll}
                        >
                            View All
                        </button>
                        <button
                            className="btn-outline"
                            disabled={selectedCount === 0}
                            onClick={handleClearSelected}
                        >
                            Clear Selected
                        </button>

                        {isAdmin && (
                            <button
                                className="btn-primary"
                                onClick={() => {/* Open create product modal */ }}
                            >
                                Create Product
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <ProductList
                    products={products}
                    isLoading={isLoading}
                    selectedIds={selectedIds || []}
                    onSelectProduct={handleSelectProduct}
                    onUnselectProduct={handleUnselectProduct}
                    onUpdateProduct={isAdmin ? handleUpdateProduct : undefined}
                    onDeleteProduct={isAdmin ? handleDeleteProduct : undefined}
                />

                {/* Pagination controls - only show if pagination exists and has more than 1 page */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => dispatch(setFilters({ ...filters, page: pagination.page - 1 }))}
                            className="btn-outline"
                        >
                            Previous
                        </button>
                        <span className="pagination-info">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => dispatch(setFilters({ ...filters, page: pagination.page + 1 }))}
                            className="btn-outline"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage; 