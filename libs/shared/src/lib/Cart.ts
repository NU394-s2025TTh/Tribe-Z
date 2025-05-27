import { Timestamp } from 'firebase/firestore';

export interface CartItem {
    itemId: string;
    ingredientOrEquipmentId: boolean; // true for ingredient, false for equipment
    name: string;
    quantity: number;
    price?: string;
    imageUrl?: string;
}

export interface Cart {
    items: CartItem[];
    lastModified: Timestamp;
    userId: string;
}