import {
    User,
  } from 'firebase/auth';
import { CartItem } from '@cs394-vite-nx-template/shared';

export async function fetchCart(user : User) {
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
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
}

export async function deleteItem(
    itemId : string,
    cartItems : CartItem[],
    user : User
) {
    try {
        
        const userId = user.uid;
    
        // Send the updated cart to the backend
        const response = await fetch(
          "https://us-central1-pizza-app-394.cloudfunctions.net/updateCart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              items: cartItems.filter((item) => item.itemId !== itemId), // Updated cart
            }),
          }
        );
    
        if (!response.ok) {
          throw new Error(`Error updating cart: ${response.statusText}`);
        }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
}

export async function updateCart(
  user : User,
  items : CartItem[]
) {
  try {
    const userId = user?.uid; // Assuming `user` is the authenticated Firebase user
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const response = await fetch(
      'https://us-central1-pizza-app-394.cloudfunctions.net/updateCart',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, items }),
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