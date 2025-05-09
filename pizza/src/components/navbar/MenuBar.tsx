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

interface NavMenuLinks {
  title: string;
  href: string;
  description: string;
}

interface NavMenu {
  title: string;
  links: NavMenuLinks[][];
}

const l1: NavMenuLinks[] = [
  {
    title: 'Team members',
    href: '/',
    description: 'See the team members',
  },
];

const l2: NavMenuLinks[] = [
  {
    title: 'Pizza Ingredients',
    href: '/pizza',
    description: 'Learn about pizza',
  },
];

const l3: NavMenuLinks[] = [
  {
    title: 'Recipies',
    href: '/recipes',
    description: 'See recipies',
  },
];

const navMenu: NavMenu = {
  title: 'Pizza',
  links: [l1, l2, l3],
};

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
  return (
    <div className="container mx-auto px-4 flex flex-row justify-between align-middle items-center">
      <div className="flex-1">
        <Logo className="" />
      </div>
      <div className="rounded-md border bg-background/80 px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList>
            {navMenu.links.map((linkGroup, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger>{navMenu.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      'grid gap-3 p-4',
                      linkGroup.length >= 2
                        ? 'md:grid-cols-2'
                        : 'md:grid-cols-1',
                      linkGroup.length >= 2
                        ? 'w-[400px] md:w-[500px] lg:w-[600px]'
                        : 'w-[200px] md:w-[300px] lg:w-[400px]'
                    )}
                  >
                    {linkGroup.map((link) => (
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

      <div className="flex-1 text-right">
        <Button
          className="rounded-md px-4 py-4 justify-self-end"
          variant="outline"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
