import React, { useState, useEffect } from 'react';
import IngredientCard from '@/components/sections/IngredientCard';
import type { Ingredient } from '@cs394-vite-nx-template/shared';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartItem, Cart } from '@cs394-vite-nx-template/shared'; // Adjust the import path as necessary
import { app } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

export default function Ingredients() {
  const [search, setSearch] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  // NEW: track which category is selected (or null for "all")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // define what terms each category should match
  const categoryFilters: Record<string, string[]> = {
    Flour: ['flour'],
    Cheese: ['cheese', 'mozzarella', 'parmesan'],
    Sauce: ['sauce'],
    Tomatoes: ['tomato'],
    Yeast: ['yeast'],
    Meats: ['sausage', 'meat'],
    Other: ['other'],
    Equipment: ['equipment'],
  };

  const categories = Object.keys(categoryFilters);

  useEffect(() => {
    async function fetchIngredients() {
      const snap = await getDocs(collection(db, 'ingredients'));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name ?? 'Unknown Ingredient',
        type: doc.data().type ?? { description: 'No description available' },
        price: doc.data().price ?? null,
        brand: doc.data().brand ?? 'Brand not specified',
        packageSize: doc.data().packageSize,
        productImage: doc.data().productImage ?? null,
      })) as Ingredient[];

      const catValues: Record<string, number> = {
        Flour: 5,
        Cheese: 5,
        Sauce: 4,
        Tomatoes: 3,
        Yeast: 3,
        Meats: 3,
        Other: 1,
        Equipment: 2,
      };

      setIngredients(
        list
          .filter((e) => e.price !== 'N/A')
          .sort((a, b) => {
            const aCat = a.type?.category;
            const bCat = b.type?.category;

            if (aCat && bCat) {
              return (
                catValues[bCat] +
                (Math.random() - 0.5) * 3 -
                (catValues[aCat] + (Math.random() - 0.5) * 3)
              );
            }

            return 0;
          })
      );
    }
    fetchIngredients();
    setUser(getAuth(app).currentUser); // Set the user state to the current authenticated user
  }, []);

  console.log(selectedCategory, 'selectedCategory');

  // first filter by search text...
  // then, if a category is selected, further filter by that category's terms
  const filtered = ingredients
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => {
      const cond1 = ((i) => {
        if (i.type?.category) return i.type?.category === selectedCategory;
        return true;
      })(i);
      // const cond2 = ((i) => {
      //   if (!selectedCategory) return true;
      //   const terms = categoryFilters[selectedCategory];
      //   const lower = i.name.toLowerCase();
      //   return terms.some((t) => lower.includes(t));
      // })(i);
      return cond1 || !selectedCategory; // cond2;
    });

  async function fetchCart() {
    try {
      const userId = user?.uid; // Assuming `user` is the authenticated Firebase user
      if (!user) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch(
        'https://us-central1-pizza-app-394.cloudfunctions.net/getCart',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching cart: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched cart data:', data);

      // Merge fetched items with current cartItems
      setCartItems((prevCartItems) => {
        const fetchedItems = data.cart.items || [];
        const mergedItems = [...prevCartItems];

        fetchedItems.forEach((fetchedItem: any) => {
          const existingItemIndex = mergedItems.findIndex(
            (item) => item.itemId === fetchedItem.itemId
          );
          if (existingItemIndex === -1) {
            mergedItems.push(fetchedItem); // Add new items from the backend
          } else {
            mergedItems[existingItemIndex] = fetchedItem; // Update existing items
          }
        });

        return mergedItems;
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  useEffect(() => {
    const auth = getAuth(app); // Ensure Firebase Auth is initialized

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('User is authenticated:', currentUser);
        setUser(currentUser); // Update the user state
      } else {
        console.warn('No user is currently authenticated.');
        setUser(null); // Clear the user state if no user is authenticated
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('Fetching cart for authenticated user:', user);
      fetchCart();
    }
  }, [user]); // Run this effect whenever `user` changes

  async function handleUpdateCart(
    updatedCartItems: CartItem[],
    isRemoving: boolean
  ) {
    try {
      const auth = getAuth(app); // Ensure Firebase Auth is initialized
      const user = auth.currentUser; // Get the currently signed-in user

      if (!user) {
        throw new Error('User is not authenticated');
      }

      const userId = user.uid;

      // Post the updated cart to Firebase
      const response = await fetch(
        'https://us-central1-pizza-app-394.cloudfunctions.net/updateCart',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            items: updatedCartItems, // Send the updated cartItems array
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating cart: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Cart updated successfully:', data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  return (
    <div className="min-h-screen">
      <div className=" mx-auto px-4 py-8">
        <h1 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold text-accent">
          Materials
        </h1>
        <p className="text-lg text-center pb-4">Get everything you need to make great pizza!</p>


        {/* Search + Categories */}
        <div className="w-full max-w-3xl mx-auto mb-10">
          <Input
            type="text"
            placeholder="Search for materials"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-8 py-4 text-2xl border rounded-lg mb-4"
          />
          <div className="flex flex-nowrap gap-4 justify-center">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <Button
                  key={category}
                  variant={isActive ? 'default' : 'outline'}
                  className={`flex-grow py-4 whitespace-nowrap text-xl rounded-lg ${
                    isActive ? 'bg-accent text-white' : ''
                  }`}
                  onClick={() =>
                    setSelectedCategory((prev) =>
                      prev === category ? null : category
                    )
                  }
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Grid of Cards */}
        {user ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((ing) => (
              <IngredientCard
                key={ing.id}
                name={ing.name}
                description={ing.type.description}
                price={ing.price ?? 'Price not available'}
                brand={ing.brand}
                productImage={ing.productImage}
                packageSize={ing.packageSize}
                isInCart={cartItems.some((item) => item.itemId === ing.id)}
                onAddToCart={() =>
                  setCartItems((prevCartItems) => {
                    let isRemoving = false;

                    // Check if the item is already in the cart
                    const existingItemIndex = prevCartItems.findIndex(
                      (item) => item.itemId === ing.id
                    );

                    let updatedCartItems;

                    if (existingItemIndex !== -1) {
                      // If the item exists, remove it
                      isRemoving = true;
                      updatedCartItems = prevCartItems.filter(
                        (item) => item.itemId !== ing.id
                      );
                    } else {
                      // If the item doesn't exist, add it
                      const newItem = {
                        itemId: ing.id,
                        ingredientOrEquipmentId: true, // Assuming all items are ingredients
                        name: ing.name,
                        quantity: 1, // Default quantity
                        price: ing.price || '$0.00', // Default price
                        imageUrl: ing.link || '', // Assuming imageUrl is available
                      };
                      updatedCartItems = [...prevCartItems, newItem];
                    }

                    // Call handleUpdateCart with the updated cart and whether it's a removal
                    handleUpdateCart(updatedCartItems, isRemoving);

                    return updatedCartItems; // Update the cartItems state
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p>Please log in to view and manage your cart.</p>
          </div>
        )}
      </div>
    </div>
  );
}
