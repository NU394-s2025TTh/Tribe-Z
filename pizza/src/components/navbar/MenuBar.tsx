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
import { deleteItem, fetchCart, updateCart } from '@/lib/function/cartFunctions'; // Adjust the import path as necessary
import { savePurchase } from '@/lib/function/purchaseFunctions';

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
    title: 'Materials',
    href: '/materials',
    description: 'Get everything you need to make great pizza',
  },
];

const l3: NavMenuLinks[] = [
  {
    title: 'Ask a Question',
    href: '/chatbot',
    description: 'Ask Sensei Luigi any pizza question',
  },
];

const l4: NavMenuLinks[] = [
  {
    title: 'Team',
    href: '/team',
    description: 'Meet the team',
  },
];

const navMenu: NavMenu[] = [
  { title: 'Recipes', links: l1 },
  { title: 'Ingredients', links: l2 },
  { title: 'Chatbot', links: l3 },
  { title: 'Team', links: l4 },
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

  async function loadCart() {
    try {
      if (!user) {
        console.error('Cannot load cart: user not authenticated');
        return;
      }
      const data = await fetchCart(user);
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

      // Update the local state by filtering out the removed item
      setCartItems((prevCartItems) => prevCartItems.filter((item) => item.itemId !== itemId));

      return await deleteItem(itemId, cartItems, user);

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

  async function handlePurchaseComplete() {
    try {
      if (!user || cartItems.length === 0) {
        console.log('Cannot complete purchase: no user or empty cart');
        return;
      }

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseFloat((item.price || '$0').replace('$', ''));
        return sum + (price * item.quantity);
      }, 0);

      // Save purchase to Firebase using existing cart items
      await savePurchase(user, cartItems, totalAmount);

      // Clear the cart in Firebase and local state
      await updateCart(user, []);
      setCartItems([]);

      // Close dialog
      setDialogOpen(false);

      console.log('Purchase completed successfully!');
    } catch (error) {
      console.error('Error completing purchase:', error);
    }
  }

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
              if (isOpen) loadCart();
            }}
          >
            <SheetTrigger asChild>
              <img
                src="/cart/cart.svg"
                alt="Shopping Cart"
                className="w-8 h-8 cursor-pointer transition duration-150 ease-in-out hover:rotate-10"
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
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                    <span>{item.name}</span>
                    <div className="text-center font-bold">{item.quantity}</div>
                    <div className="text-center">{item.price}</div>
                    <Button
                      className="text-red-600 text-xl bg-transparent rounded-full w-10 h-10 flex items-center justify-center hover:text-3xl active:text-3xl hover:bg-transparent"
                      onClick={() => removeItemFromCart(item.itemId)}
                    >
                      <span role="img" aria-label="Delete item">🗑️</span>
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
                <Button
                  type="submit"
                  className="bg-accent hover:bg-destructive cursor-pointer"
                  onClick={handlePurchaseComplete}
                >
                  Buy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
