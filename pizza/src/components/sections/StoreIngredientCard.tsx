import type { Ingredient } from '@cs394-vite-nx-template/shared';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { app } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import type { CartItem } from '@cs394-vite-nx-template/shared';
import { useEffect, useState } from 'react';
import { updateCart } from '@/lib/function/cartFunctions';

interface StoreIngredientCardProps {
  ingredients: Ingredient[];
  storeName: string;
}

export function StoreIngredientCard({
  ingredients,
  storeName,
}: StoreIngredientCardProps) {
  const [cleanCartItems, setCleanCartItems] = useState<CartItem[]>([]);

  const verifyCartItems = () => {
    let arr : CartItem[] = [];
    console.log('Verifying cart items');
    for (const item of ingredients) {
      if (item.id !== undefined) {
        arr.push(
          {
            itemId: item.id, // Generate a unique ID for each cart item
            ingredientOrEquipmentId: true, // Assuming all items are ingredients
            name: item.name,
            quantity: 1, // Default quantity is 1, can be adjusted later
            price: item.price?.toString() || '$0.00', // Convert price to string or default to '0'
          } as CartItem
        )
      }
    }
    setCleanCartItems(arr);
  };

  useEffect(() => {
    if (cleanCartItems.length === 0) return; // Avoid updating if cart is empty
    handleUpdateCart(cleanCartItems);
  }, [cleanCartItems]); // Update cart whenever cartItems change

  async function handleUpdateCart(
    updatedCartItems: CartItem[],
  ) {
    try {
      const auth = getAuth(app); // Ensure Firebase Auth is initialized
      const user = auth.currentUser; // Get the currently signed-in user

      if (!user) {
        throw new Error('User is not authenticated');
      }

      const data = await updateCart(user, updatedCartItems);
      console.log('Cart updated successfully:', data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  console.log('StoreIngredientCard ingredients:', ingredients);
  return (
    <div>
      <Card className="w-[100%]">
      <CardHeader className="border-b-1">
        <CardTitle className="text-lg font-semibold leading">
          Consists of:
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex justify-between items-center text-sm py-1"
          >
            {(ingredient as Ingredient & { additionalInfo: string })
              .additionalInfo ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        to={ingredient.link as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate flex-1 mr-8 text-blue-600 hover:underline"
                      >
                        {ingredient.name}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="">
                      {`Closest match for our recommended ingredient, ${
                        (ingredient as Ingredient & { additionalInfo: string })
                          .additionalInfo
                      }`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="font-medium ml-8">{ingredient.price}</span>
              </>
            ) : (
              <div
                className="flex justify-between items-center w-full text-left hover:bg-accent hover:text-white rounded-md p-2"
              >
                {ingredient.name}
                <span className="font-medium ml-8">{ingredient.price}</span>
              </div>
            )}
          </div>
          ))}
        </CardContent>
      </Card>
      <Button
        className="mt-4 w-full text-white hover:bg-accent active:bg-accent"
        onClick={() => verifyCartItems()}
      >
        Add package to cart!
      </Button>
    </div>
    
  );
}
