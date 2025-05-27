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

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

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
    title: 'Featured Recipes',
    href: '/',
    description: 'See our current most popular recipes',
  },
  {
    title: 'Ingredients',
    href: '/ingredients',
    description: 'Search for ingredients to use', 
  },
];

const l2: NavMenuLinks[] = [
  {
    title: 'Team',
    href: '/team',
    description: 'Meet the team',
  },
];

const l3: NavMenuLinks[] = [
  {
    title: 'Ask a Question',
    href: '/chatbot',
    description: 'Ask Sensei Luigi any pizza question',
  },
];

const navMenu: NavMenu[] = [
  { title: 'Home', links: l1 },
  { title: 'Team', links: l2 },
  { title: 'Chatbot', links: l3 },
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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in:', user);
      setUser(user);
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
            {navMenu.map((navMenu, index) => (
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
            ))}
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
                <DropdownMenuLabel><b>My Account</b></DropdownMenuLabel>
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
          <Sheet>
            <SheetTrigger asChild>
              <img src="/cart/cart.svg" alt="Shopping Cart" className='w-8 h-8 cursor-pointer transition duration-150 ease-in-out hover:rotate-10' />
            </SheetTrigger>

            <SheetContent>
          <SheetHeader>
            <SheetTitle>See your shopping cart</SheetTitle>
            <SheetDescription>
              Checkout some items you have been looking at, literally and figuratively.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 p-4">

            <div className="grid grid-cols-3 items-center gap-4">
              <img src="/flour/flour.png" alt="Flour" /> 
              <span> flour for your tummy </span>
              <div className='text-center font-bold'> 1 </div>
            </div>
             <Separator />

          </div>
          <SheetFooter>
            <SheetClose asChild>
             
              <Button type="submit" className='bg-accent hover:bg-destructive cursor-pointer' onClick={() => setDialogOpen(true)}>Checkout</Button>

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
              <Input id="name" placeholder='Jane Doe' className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              Mailing Address
              <Input id="name" placeholder='123 Main St, Alabama, USA' className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              Credit card number
              <Input id="name" placeholder='1234 5678 ...' className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
            <Button type="submit" className='bg-accent hover:bg-destructive cursor-pointer'>Buy</Button>
            </DialogClose>

          </DialogFooter>
        </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}
