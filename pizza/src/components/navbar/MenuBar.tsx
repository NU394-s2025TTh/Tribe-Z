'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import Logo from '../logos/Logo';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CartItem } from '@cs394-vite-nx-template/shared'; // Adjust the import path as necessary
import { onAuthStateChanged } from 'firebase/auth';

// Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface NavMenuLinks {
  title: string;
  href: string;
  description: string;
}

interface NavMenu {
  title: string;
  links: NavMenuLinks[];
}

const l1: NavMenuLinks[] = [
  {
    title: 'Recipes',
    href: '/',
    description: 'See our current most popular recipes',
  },
];

const l2: NavMenuLinks[] = [
  {
    title: 'Ingredients',
    href: '/ingredients',
    description: 'Search for ingredients to use',
  },
];

const l3: NavMenuLinks[] = [
  {
    title: 'Team',
    href: '/team',
    description: 'Meet the team',
  },
];

// const l3: NavMenuLinks[] = [
//   {
//     title: 'Recipies',
//     href: '/recipes',
//     description: 'See recipies',
//   },
// ];

const navMenu: NavMenu[] = [
  { title: 'Recipes', links: l1 },
  { title: 'Ingredients', links: l2 },
  { title: 'Team', links: l3 },
];

// Simple ListItem component without forwardRef
function ListItem({
  className,
  title,
  href,
  children,
}: {
  className?: string;
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          href={href}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

export function FloatingNav() {
  const [user, setUser] = React.useState<User | null>(null); // State to hold user information
  const [showProfileMenu, setShowProfileMenu] = React.useState(false); // State to control profile menu visibility
  const [dialogOpen, setDialogOpen] = useState(false);

  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

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
      // setCartItems((prevCartItems) => {
      //   const fetchedItems = data.cart.items || [];
      //   const mergedItems = [...prevCartItems];

      //   fetchedItems.forEach((fetchedItem: any) => {
      //     const existingItemIndex = mergedItems.findIndex(
      //       (item) => item.itemId === fetchedItem.itemId
      //     );
      //     if (existingItemIndex === -1) {
      //       mergedItems.push(fetchedItem); // Add new items from the backend
      //     }
      //     else {
      //       mergedItems[existingItemIndex] = fetchedItem; // Update existing items
      //     }
      //   });

      //   return mergedItems;
      // });
      setCartItems(data.cart.items || []); // Set cart items from fetched data
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  async function removeItemFromCart(itemId: string) {
    try {
      const auth = getAuth(app); // Ensure Firebase Auth is initialized
      const user = auth.currentUser; // Get the currently signed-in user
  
      if (!user) {
        throw new Error("User is not authenticated");
      }
  
      const userId = user.uid;
  
      // Update the local state by filtering out the removed item
      setCartItems((prevCartItems) => prevCartItems.filter((item) => item.itemId !== itemId));
  
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
      console.log("Cart updated successfully:", data);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  }
  
  React.useEffect(() => {
    // Check if the user is already authenticated when the component mounts
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('User is already authenticated:', currentUser);
        setUser(currentUser); // Set the user state if already authenticated
      } else {
        console.log('No user is currently authenticated.');
        setUser(null); // Clear the user state if no user is authenticated
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      if (user) {
        console.log('User is already signed in:', user);
        return; // If the user is already signed in, do nothing
      }

      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      console.log('User signed in:', signedInUser);
      setUser(signedInUser); // Update the user state
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      setUser(null); // Clear the user from state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div
      className="container mx-auto px-4 flex flex-row justify-between align-middle items-center
    before:content-[''] before:absolute before:inset-0 before:-z-10 before:h-[200%]
    before:bg-linear-to-b before:from-background/100 before:to-background/0 before:rounded-md before:-top-4"
    >
      <div className="flex-1">
        <Logo className="w-[80px]" />
      </div>
      <div className="rounded-md border bg-background/80 px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList>
            {navMenu.map((navMenu, index) =>
              // if it os only one item, use NavigationMenuLink instead of NavigationMenuItem
              navMenu.links.length === 1 ? (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={navMenu.links[0].href}
                    className="text-sm font-medium px-4"
                  >
                    {navMenu.links[0].title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                // if it is more than one item, use NavigationMenuItem with trigger and content
                <NavigationMenuItem key={index}>
                  <NavigationMenuTrigger>{navMenu.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul
                      className={cn(
                        'grid gap-3 p-4',
                        navMenu.links.length >= 2
                          ? 'md:grid-cols-2'
                          : 'md:grid-cols-1',
                        navMenu.links.length >= 2
                          ? 'w-[400px] md:w-[500px] lg:w-[600px]'
                          : 'w-[200px] md:w-[300px] lg:w-[400px]'
                      )}
                    >
                      {navMenu.links.map((link) => (
                        <ListItem
                          key={link.title}
                          title={link.title}
                          href={link.href}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex-1 flex justify-end align-middle gap-4">
        <div className="relative inline-block">
          {!user && (
            <Button
              onClick={handleGoogleSignIn}
              className="rounded-md px-4 py-4 justify-self-end button-pointer"
              variant="outline"
            >
              Sign In
            </Button>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src={user.photoURL || ''}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  referrerPolicy="no-referrer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuLabel>
                  <b>My Account</b>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Button
                    onClick={handleSignOut}
                    variant="secondary"
                    className=" text-gray-700 bg-cream hover:bg-red-700 hover:border-gray-200 hover:text-white"
                  >
                    Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div>
          <Sheet
            onOpenChange={(isOpen) => {
              if (isOpen) fetchCart();
            }}
          >
            <SheetTrigger asChild>
              <img
                src="/cart/cart.svg"
                className="w-8 h-8 cursor-pointer transition duration-150 ease-in-out hover:rotate-10"
                onClick={() => {}}
              />
            </SheetTrigger>

            <SheetContent className="overflow-y-auto max-h-[100vh]">
              <SheetHeader>
                <SheetTitle>See your shopping cart</SheetTitle>
                <SheetDescription>
                  Checkout some items you have been looking at, literally and figuratively.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 p-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      <></>
                    )}
                    <span>{item.name}</span>
                    <div className="text-center font-bold">{item.quantity}</div>
                    <div className="text-center">{item.price}</div>
                    <Button
                      className="text-red-600 text-xl bg-transparent rounded-full w-10 h-10 flex items-center justify-center hover:text-3xl active:text-3xl hover:bg-transparent"
                      onClick={() => removeItemFromCart(item.itemId)}
                    >
                      🗑️
                    </Button>
                  </div>
                ))}

                <Separator />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    type="submit"
                    className="bg-accent hover:bg-destructive cursor-pointer"
                    onClick={() => setDialogOpen(true)}
                  >
                    Checkout
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>Checkout</DialogTitle>
                <DialogDescription>
                  Proceed with purchasing items you found interesting!
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  Name
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  Mailing Adress
                  <Input
                    id="name"
                    placeholder="123 Main St, Alabama, USA"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  Credit card number
                  <Input
                    id="name"
                    placeholder="1234 5678 ..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button
                    type="submit"
                    className="bg-accent hover:bg-destructive cursor-pointer"
                  >
                    Buy
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
