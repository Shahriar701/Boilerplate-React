import React from 'react';
import { ProductDto } from '../models/product.dto';
import './ProductCard.css';

interface ProductCardProps {
  product: ProductDto;
  isSelected: boolean;
  isAdmin?: boolean;
  onSelect: (id: string) => void;
  onUnselect: (id: string) => void;
  onUpdate?: (id: string, product: Partial<ProductDto>) => void;
  onDelete?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  isAdmin = false,
  onSelect,
  onUnselect,
  onUpdate,
  onDelete
}) => {
  const toggleSelection = () => {
    if (isSelected) {
      onUnselect(product.id);
    } else {
      onSelect(product.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      // In a real app, you might open a modal or form here
      const updatedName = prompt('Enter new product name:', product.name);
      if (updatedName) {
        onUpdate(product.id, { ...product, name: updatedName });
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
    }
  };

  return (
    <div
      className={`product-card ${isSelected ? 'selected' : ''}`}
      onClick={toggleSelection}
    >
      <div className="product-image">
        <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">{product.description}</p>
      </div>
      {isAdmin && (
        <div className="admin-actions">
          <button
            className="edit-btn"
            onClick={handleEditClick}
            title="Edit product"
          >
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={handleDeleteClick}
            title="Delete product"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 