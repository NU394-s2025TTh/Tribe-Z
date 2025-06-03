// Purchase history types and interfaces
import { Timestamp } from 'firebase/firestore';

export interface PurchaseItem {
  itemId: string;
  name: string;
  price: string;
  quantity: number;
  category?: string;
  imageUrl?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  items: PurchaseItem[];
  purchaseDate: Timestamp;
  totalAmount: number;
  orderNumber?: string;
}

// For creating new purchases (without the id field)
export type CreatePurchase = Omit<Purchase, 'id'>;
