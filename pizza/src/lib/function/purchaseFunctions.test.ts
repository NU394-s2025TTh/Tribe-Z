// Tests for purchase functions
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { User } from 'firebase/auth';
import { CartItem, PurchaseItem } from '@cs394-vite-nx-template/shared';
import {
  savePurchase,
  fetchRecentPurchases,
  fetchRecentPurchaseItems
} from './purchaseFunctions';

// Mock Firebase modules
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ toDate: () => new Date() })),
}));

vi.mock('@/lib/firebase', () => ({
  db: {},
}));

const mockUser: User = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
} as User;

const mockCartItems: CartItem[] = [
  {
    itemId: '1',
    name: 'Mozzarella Cheese',
    price: '$5.99',
    quantity: 2,
    ingredientOrEquipmentId: true,
    imageUrl: 'https://example.com/cheese.jpg',
  },
  {
    itemId: '2',
    name: 'Tomato Sauce',
    price: '$3.49',
    quantity: 1,
    ingredientOrEquipmentId: true,
    imageUrl: 'https://example.com/sauce.jpg',
  },
];

describe('purchaseFunctions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('savePurchase', () => {
    test('saves purchase successfully with valid data', async () => {
      const { addDoc } = await import('firebase/firestore');
      vi.mocked(addDoc).mockResolvedValue({ id: 'purchase-123' } as any);

      const result = await savePurchase(mockUser, mockCartItems, 15.47);

      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(), // collection reference
        expect.objectContaining({
          userId: 'test-user-123',
          items: expect.arrayContaining([
            expect.objectContaining({
              itemId: '1',
              name: 'Mozzarella Cheese',
              price: '$5.99',
              quantity: 2,
              category: 'ingredient',
            }),
          ]),
          totalAmount: 15.47,
          purchaseDate: expect.anything(),
        })
      );

      expect(result).toBe('purchase-123');
    });

    test('throws error when user is null', async () => {
      await expect(savePurchase(null as any, mockCartItems, 15.47))
        .rejects
        .toThrow('Invalid user or empty cart');
    });

    test('throws error when cart is empty', async () => {
      await expect(savePurchase(mockUser, [], 15.47))
        .rejects
        .toThrow('Invalid user or empty cart');
    });

    test('includes order number when provided', async () => {
      const { addDoc } = await import('firebase/firestore');
      vi.mocked(addDoc).mockResolvedValue({ id: 'purchase-123' } as any);

      await savePurchase(mockUser, mockCartItems, 15.47, 'ORDER-456');

      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          orderNumber: 'ORDER-456',
        })
      );
    });

    test('handles Firebase errors gracefully', async () => {
      const { addDoc } = await import('firebase/firestore');
      vi.mocked(addDoc).mockRejectedValue(new Error('Firebase error'));

      await expect(savePurchase(mockUser, mockCartItems, 15.47))
        .rejects
        .toThrow('Firebase error');
    });
  });

  describe('fetchRecentPurchases', () => {
    test('fetches purchases successfully', async () => {
      const mockPurchases = [
        {
          id: 'purchase-1',
          userId: 'test-user-123',
          items: [
            {
              itemId: '1',
              name: 'Mozzarella Cheese',
              price: '$5.99',
              quantity: 2,
              category: 'ingredient',
            },
          ],
          totalAmount: 11.98,
          purchaseDate: { toDate: () => new Date('2024-01-01') },
        },
        {
          id: 'purchase-2',
          userId: 'test-user-123',
          items: [
            {
              itemId: '2',
              name: 'Tomato Sauce',
              price: '$3.49',
              quantity: 1,
              category: 'ingredient',
            },
          ],
          totalAmount: 3.49,
          purchaseDate: { toDate: () => new Date('2024-01-02') },
        },
      ];

      const { getDocs, query, collection, where, orderBy, limit } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({
        docs: mockPurchases.map(purchase => ({
          id: purchase.id,
          data: () => purchase,
        })),
      } as any);

      const result = await fetchRecentPurchases(mockUser, 20);

      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', 'test-user-123');
      expect(orderBy).toHaveBeenCalledWith('purchaseDate', 'desc');
      expect(limit).toHaveBeenCalledWith(20);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 'purchase-1',
        userId: 'test-user-123',
      }));
    });

    test('throws error when user is null', async () => {
      await expect(fetchRecentPurchases(null as any))
        .rejects
        .toThrow('User not authenticated');
    });

    test('handles Firebase errors gracefully', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockRejectedValue(new Error('Firebase error'));

      await expect(fetchRecentPurchases(mockUser))
        .rejects
        .toThrow('Firebase error');
    });

    test('uses default limit when not specified', async () => {
      const { getDocs, limit } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({ docs: [] } as any);

      await fetchRecentPurchases(mockUser);

      expect(limit).toHaveBeenCalledWith(20);
    });
  });

  describe('fetchRecentPurchaseItems', () => {
    test('fetches and deduplicates purchase items', async () => {
      const mockPurchases = [
        {
          id: 'purchase-1',
          items: [
            {
              itemId: '1',
              name: 'Mozzarella Cheese',
              price: '$5.99',
              quantity: 2,
              category: 'ingredient',
            },
            {
              itemId: '2',
              name: 'Tomato Sauce',
              price: '$3.49',
              quantity: 1,
              category: 'ingredient',
            },
          ],
        },
        {
          id: 'purchase-2',
          items: [
            {
              itemId: '1', // Duplicate item
              name: 'Mozzarella Cheese',
              price: '$5.99',
              quantity: 1,
              category: 'ingredient',
            },
            {
              itemId: '3',
              name: 'Pepperoni',
              price: '$7.99',
              quantity: 1,
              category: 'ingredient',
            },
          ],
        },
      ];

      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({
        docs: mockPurchases.map(purchase => ({
          id: purchase.id,
          data: () => purchase,
        })),
      } as any);

      const result = await fetchRecentPurchaseItems(mockUser, 50);

      expect(result).toHaveLength(3); // Should have 3 unique items
      expect(result.map(item => item.itemId)).toEqual(['1', '2', '3']);
      expect(result[0]).toEqual(expect.objectContaining({
        itemId: '1',
        name: 'Mozzarella Cheese',
      }));
    });

    test('respects the limit parameter', async () => {
      const mockPurchases = [
        {
          id: 'purchase-1',
          items: Array.from({ length: 10 }, (_, i) => ({
            itemId: `item-${i}`,
            name: `Item ${i}`,
            price: '$1.00',
            quantity: 1,
            category: 'ingredient',
          })),
        },
      ];

      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({
        docs: mockPurchases.map(purchase => ({
          id: purchase.id,
          data: () => purchase,
        })),
      } as any);

      const result = await fetchRecentPurchaseItems(mockUser, 5);

      expect(result).toHaveLength(5);
    });

    test('handles empty purchase history', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({ docs: [] } as any);

      const result = await fetchRecentPurchaseItems(mockUser);

      expect(result).toEqual([]);
    });
  });
});
