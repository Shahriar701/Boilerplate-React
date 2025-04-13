import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductDto } from '../models/product.dto';
import './ProductList.css';

interface ProductListProps {
    products: ProductDto[];
    isLoading?: boolean;
    selectedIds: string[];
    isAdmin?: boolean;
    onSelectProduct: (id: string) => void;
    onUnselectProduct: (id: string) => void;
    onUpdateProduct?: (id: string, product: Partial<ProductDto>) => void;
    onDeleteProduct?: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    isLoading = false,
    selectedIds = [],
    isAdmin = false,
    onSelectProduct,
    onUnselectProduct,
    onUpdateProduct,
    onDeleteProduct,
}) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);

    const handleProductClick = (product: ProductDto) => {
        setSelectedProduct(product === selectedProduct ? null : product);
    };

    const handleUpdateProduct = (id: string, product: Partial<ProductDto>) => {
        if (onUpdateProduct) {
            onUpdateProduct(id, product);
        }
    };

    const handleDeleteProduct = (productId: string) => {
        if (onDeleteProduct) {
            onDeleteProduct(productId);
        }
    };

    if (isLoading) {
        return (
            <div className="product-list-container">
                <div className="loading">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <div className="product-list">
                {products.length === 0 ? (
                    <div className="no-products">No products available</div>
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isSelected={selectedIds.includes(product.id)}
                            isAdmin={isAdmin}
                            onSelect={onSelectProduct}
                            onUnselect={onUnselectProduct}
                            onUpdate={handleUpdateProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))
                )}
            </div>

            {selectedProduct && (
                <div className="product-details">
                    <h2>{selectedProduct.name}</h2>
                    <div className="product-detail-image">
                        <img src={selectedProduct.imageUrl || 'https://via.placeholder.com/150'} alt={selectedProduct.name} />
                    </div>
                    <p className="product-price">${selectedProduct.price.toFixed(2)}</p>
                    <p className="product-description">{selectedProduct.description}</p>
                    <div className="product-attributes">
                        <p>Category: {selectedProduct.category}</p>
                        {selectedProduct.inStock ? (
                            <p className="in-stock">In Stock</p>
                        ) : (
                            <p className="out-of-stock">Out of Stock</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList; 