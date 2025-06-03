// Purchase history functions for Firebase operations
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import {
  Purchase,
  PurchaseItem,
} from '@cs394-vite-nx-template/shared';
import { CartItem } from '@cs394-vite-nx-template/shared';

const PURCHASES_COLLECTION = 'purchases';

/**
 * Save a completed order as a purchase in the purchase history
 */
export async function savePurchase(
  user: User,
  cartItems: CartItem[],
  totalAmount: number,
  orderNumber?: string
): Promise<string> {
  try {
    if (!user || !cartItems.length) {
      throw new Error('Invalid user or empty cart');
    }

    // Convert cart items to purchase items
    const purchaseItems: PurchaseItem[] = cartItems.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      price: item.price || '$0.00',
      quantity: item.quantity,
      category: 'ingredient', // Default category
      imageUrl: item.imageUrl || '',
    }));

    const purchaseData = {
      userId: user.uid,
      items: purchaseItems,
      purchaseDate: serverTimestamp(),
      totalAmount,
      ...(orderNumber && { orderNumber }),
    };

    const docRef = await addDoc(
      collection(db, PURCHASES_COLLECTION),
      purchaseData
    );
    console.log('Purchase saved successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving purchase:', error);
    throw error;
  }
}

/**
 * Fetch recent purchases for a user (last 20 items)
 */
export async function fetchRecentPurchases(
  user: User,
  limitCount = 20
): Promise<Purchase[]> {
  try {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, PURCHASES_COLLECTION),
      where('userId', '==', user.uid),
      orderBy('purchaseDate', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);

    const purchases: Purchase[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Purchase[];

    return purchases;
  } catch (error) {
    console.error('Error fetching recent purchases:', error);
    throw error;
  }
}

/**
 * Get all unique items from recent purchases (for quick re-ordering)
 */
export async function fetchRecentPurchaseItems(
  user: User,
  limitCount = 50
): Promise<PurchaseItem[]> {
  try {
    const purchases = await fetchRecentPurchases(user, 10); // Get last 10 purchases

    // Flatten all items from all purchases
    const allItems = purchases.flatMap((purchase) => purchase.items);

    // Remove duplicates based on itemId, keeping the most recent
    const uniqueItems = new Map<string, PurchaseItem>();

    for (const item of allItems) {
      if (!uniqueItems.has(item.itemId)) {
        uniqueItems.set(item.itemId, item);
      }
    }

    // Convert back to array and limit results
    return Array.from(uniqueItems.values()).slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching recent purchase items:', error);
    throw error;
  }
}
