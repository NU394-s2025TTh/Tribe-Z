import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { PurchaseItem } from '@cs394-vite-nx-template/shared';
import { fetchRecentPurchaseItems } from '@/lib/function/purchaseFunctions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface RecentPurchasesProps {
  user: User;
  onAddToCart: (items: PurchaseItem[]) => void;
  className?: string;
}

export default function RecentPurchases({ user, onAddToCart, className = '' }: RecentPurchasesProps) {
  const [recentItems, setRecentItems] = useState<PurchaseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecentPurchases() {
      try {
        setLoading(true);
        setError(null);
        const items = await fetchRecentPurchaseItems(user, 15);
        setRecentItems(items);
      } catch (err) {
        console.error('Error loading recent purchases:', err);
        setError('Failed to load recent purchases');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadRecentPurchases();
    }
  }, [user]);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === recentItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(recentItems.map(item => item.itemId)));
    }
  };

  const handleAddSelectedToCart = () => {
    const itemsToAdd = recentItems.filter(item => selectedItems.has(item.itemId));
    onAddToCart(itemsToAdd);
    setSelectedItems(new Set()); // Clear selections after adding
  };

  const handleAddSingleItem = (item: PurchaseItem) => {
    onAddToCart([item]);
  };

  if (!recentItems.length && !loading) {
    return null; // Don't show anything if user has no purchase history
  }

  return (
    <Card className={`w-full max-w-6xl mx-auto mb-8 ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-accent flex items-center gap-2">
          <span>Recent Purchases</span>
          <Badge variant="secondary" className="text-sm">
            Quick Re-order
          </Badge>
        </CardTitle>
        <p className="text-gray-600">
          Quickly re-order your favorite ingredients from previous purchases
        </p>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <span className="ml-2 text-gray-600">Loading recent purchases...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={selectedItems.size === recentItems.length && recentItems.length > 0}
                    onChange={handleSelectAll}
                  />
                  {selectedItems.size === recentItems.length ? 'Deselect All' : 'Select All'}
                </Button>

                {selectedItems.size > 0 && (
                  <Button
                    onClick={handleAddSelectedToCart}
                    className="bg-accent hover:bg-accent/90 text-white"
                  >
                    Add Selected to Cart ({selectedItems.size})
                  </Button>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {recentItems.length} recent items
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recentItems.map((item) => (
                <div
                  key={item.itemId}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Checkbox and Image */}
                  <div className="flex items-start gap-2 mb-3">
                    <Checkbox
                      checked={selectedItems.has(item.itemId)}
                      onCheckedChange={() => handleItemToggle(item.itemId)}
                      className="mt-1"
                    />
                    <img
                      src={item.imageUrl || '/logo/doughjo_main.png'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = '/logo/doughjo_main.png';
                      }}
                    />
                  </div>

                  {/* Item Info */}
                  <div className="space-y-1 mb-3">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="text-accent font-semibold text-sm">
                      {item.price}
                    </p>
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>

                  {/* Add Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddSingleItem(item)}
                    className="w-full text-xs hover:bg-accent hover:text-white"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
