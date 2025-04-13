export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    inStock: boolean;
    quantity?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductCreationDto {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    inStock: boolean;
    quantity?: number;
}

export interface ProductUpdateDto {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    inStock?: boolean;
    quantity?: number;
} 