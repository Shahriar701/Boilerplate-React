export interface ProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category: string;
    inStock: boolean;
}

export interface ProductListResponse {
    items: ProductDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ProductFilterRequest {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    query?: string;
    page?: number;
    pageSize?: number;
    sortBy?: 'price' | 'name' | 'newest';
    sortOrder?: 'asc' | 'desc';
}

export interface SelectedProductsState {
    ids: string[];
} 