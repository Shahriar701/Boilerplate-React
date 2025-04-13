import React, { useEffect, useState } from 'react';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { IProductService } from '../services/product.service.interface';
import { IAuthService } from '../../../features/auth/services/auth.service.interface';
import { ProductDto, ProductFilterRequest, ProductListResponse } from '../models/product.dto';
import ProductList from '../components/ProductList';

const ProductsPage: React.FC = () => {
    const productService = useInjection<IProductService>(TYPES.ProductService);
    const authService = useInjection<IAuthService>(TYPES.AuthService);

    const [products, setProducts] = useState<ProductDto[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [filters, setFilters] = useState<ProductFilterRequest>({
        page: 1,
        pageSize: 10
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1
    });

    useEffect(() => {
        // Check if user has admin role
        const currentUser = authService.getCurrentUser();
        setIsAdmin(currentUser && currentUser.roles ? currentUser.roles.includes('admin') : false);

        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await productService.getProducts(filters);
                setProducts(response?.items || []);
                setPagination({
                    total: response?.total || 0,
                    page: response?.page || 1,
                    pageSize: response?.pageSize || 10,
                    totalPages: response?.totalPages || 1
                });

                // Load selected products from service
                const ids = productService.getSelectedProductIds() || [];
                setSelectedIds(ids);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Failed to load products');
                }
                console.error('Error loading products:', err);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [productService, authService, filters]);

    const handleSelectProduct = (id: string) => {
        productService.selectProduct(id);
        const ids = productService.getSelectedProductIds() || [];
        setSelectedIds(ids);
    };

    const handleUnselectProduct = (id: string) => {
        productService.unselectProduct(id);
        const ids = productService.getSelectedProductIds() || [];
        setSelectedIds(ids);
    };

    const handleClearSelected = () => {
        productService.clearSelectedProducts();
        setSelectedIds([]);
    };

    const handleViewSelected = async () => {
        if (!selectedIds || selectedIds.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            const selectedProducts = await productService.getSelectedProducts(selectedIds);
            setProducts(selectedProducts || []);
            setPagination({
                total: selectedProducts?.length || 0,
                page: 1,
                pageSize: selectedProducts?.length || 0,
                totalPages: 1
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to load selected products');
            }
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewAll = async () => {
        setFilters({
            page: 1,
            pageSize: 10
        });
    };

    // Admin functionality
    const handleCreateProduct = async (product: Omit<ProductDto, 'id'>) => {
        if (!isAdmin) {
            setError('Only admins can create products');
            return;
        }

        setIsLoading(true);
        try {
            await productService.createProduct(product);
            // Refresh product list
            const response = await productService.getProducts(filters);
            setProducts(response?.items || []);
            setPagination({
                total: response?.total || 0,
                page: response?.page || 1,
                pageSize: response?.pageSize || 10,
                totalPages: response?.totalPages || 1
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to create product');
            }
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProduct = async (id: string, product: Partial<ProductDto>) => {
        if (!isAdmin) {
            setError('Only admins can update products');
            return;
        }

        setIsLoading(true);
        try {
            await productService.updateProduct(id, product);
            // Update the product in the current list
            setProducts(prevProducts =>
                prevProducts ? prevProducts.map(p => p.id === id ? { ...p, ...product } : p) : []
            );
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(`Failed to update product ${id}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!isAdmin) {
            setError('Only admins can delete products');
            return;
        }

        setIsLoading(true);
        try {
            const success = await productService.deleteProduct(id);
            if (success) {
                // Remove the product from the current list
                setProducts(prevProducts =>
                    prevProducts ? prevProducts.filter(p => p.id !== id) : []
                );
                // Also remove from selected IDs if it was selected
                if (selectedIds && selectedIds.includes(id)) {
                    productService.unselectProduct(id);
                    setSelectedIds(prevIds =>
                        prevIds ? prevIds.filter(selectedId => selectedId !== id) : []
                    );
                }
            } else {
                setError(`Failed to delete product ${id}`);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(`Failed to delete product ${id}`);
            }
        } finally {
            setIsLoading(false);
        }
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
                    products={products || []}
                    isLoading={isLoading}
                    selectedIds={selectedIds || []}
                    isAdmin={isAdmin}
                    onSelectProduct={handleSelectProduct}
                    onUnselectProduct={handleUnselectProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onUpdateProduct={handleUpdateProduct}
                />

                {!isLoading && products && products.length > 0 && (
                    <div className="pagination">
                        <div className="pagination-info">
                            Showing {products.length} of {pagination.total} products
                        </div>
                        {/* Add pagination controls here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage; 