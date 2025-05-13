import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

import { MeasurementUnits, type Recipe } from '@cs394-vite-nx-template/shared';

import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Cheese Pizza',
    description:
      'A classic cheese pizza with tomato sauce and mozzarella cheese.',
    headerImage: 'https://placehold.co/600x400',
    cookTime: 30,
    ingredients: [
      {
        ingredient: {
          name: 'Dough',
          description: 'Pizza dough',
        },
        recommendation: '1 pizza dough',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Tomato Sauce',
          description: 'Pizza sauce',
        },
        recommendation: '1/2 cup pizza sauce',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Mozzarella Cheese',
          description: 'Shredded mozzarella cheese',
        },
        recommendation: '1 cup shredded mozzarella cheese',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
    ],
    instructions: ['preheat oven', 'add toppings', 'bake'],
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description:
      'A classic pepperoni pizza with tomato sauce and mozzarella cheese.',
    headerImage: 'https://placehold.co/600x400',
    cookTime: 30,
    ingredients: [
      {
        ingredient: {
          name: 'Dough',
          description: 'Pizza dough',
        },
        recommendation: '1 pizza dough',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Tomato Sauce',
          description: 'Pizza sauce',
        },
        recommendation: '1/2 cup pizza sauce',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Mozzarella Cheese',
          description: 'Shredded mozzarella cheese',
        },
        recommendation: '1 cup shredded mozzarella cheese',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
    ],
    instructions: ['preheat oven', 'add toppings', 'bake'],
  },
  {
    id: '3',
    name: 'Veggie Pizza',
    description:
      'A classic veggie pizza with tomato sauce and mozzarella cheese.',
    headerImage: 'https://placehold.co/600x400',
    cookTime: 30,
    ingredients: [
      {
        ingredient: {
          name: 'Dough',
          description: 'Pizza dough',
        },
        recommendation: '1 pizza dough',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Tomato Sauce',
          description: 'Pizza sauce',
        },
        recommendation: '1/2 cup pizza sauce',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Mozzarella Cheese',
          description: 'Shredded mozzarella cheese',
        },
        recommendation: '1 cup shredded mozzarella cheese',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
    ],
    instructions: ['preheat oven', 'add toppings', 'bake'],
  },
  {
    id: '4',
    name: 'BBQ Chicken Pizza',
    description:
      'A classic BBQ chicken pizza with tomato sauce and mozzarella cheese.',
    headerImage: 'https://placehold.co/600x400',
    cookTime: 30,
    ingredients: [
      {
        ingredient: {
          name: 'Dough',
          description: 'Pizza dough',
        },
        recommendation: '1 pizza dough',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Tomato Sauce',
          description: 'Pizza sauce',
        },
        recommendation: '1/2 cup pizza sauce',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Mozzarella Cheese',
          description: 'Shredded mozzarella cheese',
        },
        recommendation: '1 cup shredded mozzarella cheese',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
    ],
    instructions: ['preheat oven', 'add toppings', 'bake'],
  },
  {
    id: '5',
    name: 'Buffalo Chicken Pizza',
    description:
      'A classic buffalo chicken pizza with tomato sauce and mozzarella cheese.',
    headerImage: 'https://placehold.co/600x400',
    cookTime: 30,
    ingredients: [
      {
        ingredient: {
          name: 'Dough',
          description: 'Pizza dough',
        },
        recommendation: '1 pizza dough',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Tomato Sauce',
          description: 'Pizza sauce',
        },
        recommendation: '1/2 cup pizza sauce',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Mozzarella Cheese',
          description: 'Shredded mozzarella cheese',
        },
        recommendation: '1 cup shredded mozzarella cheese',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
    ],
    instructions: ['preheat oven', 'add toppings', 'bake'],
  },
  {
    id: '6',
    name: 'Hawaiian Pizza',
    description:
      'A classic Hawaiian pizza with tomato sauce and mozzarella cheese.',
    headerImage: 'https://placehold.co/600x400',
    cookTime: 30,
    ingredients: [
      {
        ingredient: {
          name: 'Dough',
          description: 'Pizza dough',
        },
        recommendation: '1 pizza dough',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Tomato Sauce',
          description: 'Pizza sauce',
        },
        recommendation: '1/2 cup pizza sauce',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Mozzarella Cheese',
          description: 'Shredded mozzarella cheese',
        },
        recommendation: '1 cup shredded mozzarella cheese',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
    ],
    instructions: ['preheat oven', 'add toppings', 'bake'],
  },
  {
    id: '7',
    name: 'Meat Lovers Pizza',
    description:
      'A classic meat lovers pizza with tomato sauce and mozzarella cheese.',
    headerImage: 'https://placehold.co/600x400',
    cookTime: 30,
    ingredients: [
      {
        ingredient: {
          name: 'Dough',
          description: 'Pizza dough',
        },
        recommendation: '1 pizza dough',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Tomato Sauce',
          description: 'Pizza sauce',
        },
        recommendation: '1/2 cup pizza sauce',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Mozzarella Cheese',
          description: 'Shredded mozzarella cheese',
        },
        recommendation: '1 cup shredded mozzarella cheese',
        amount: 1,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Pepperoni',
          description: 'Sliced pepperoni',
        },
        recommendation: '1/2 cup sliced pepperoni',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Sausage',
          description: 'Italian sausage',
        },
        recommendation: '1/2 cup cooked Italian sausage',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
      {
        ingredient: {
          name: 'Bacon',
          description: 'Cooked bacon',
        },
        recommendation: '1/2 cup cooked bacon',
        amount: 0.5,
        unit: MeasurementUnits.CUP,
      },
    ],
    instructions: ['preheat oven', 'add toppings', 'bake', 'slice and serve'],
  },
];

export function FeaturedCard({
  recipe,
  index,
}: {
  recipe: Recipe;
  index: number;
}) {
  return (
    <Link to={`/recipes/${recipe.id}`}>
      <Card key={recipe.id}>
        <CardContent>
          <img
            src="https://placehold.co/600x400"
            alt="Pizza"
            className="w-full h-48 object-cover rounded-md"
          />
        </CardContent>
        <CardFooter className="flex md:justify-between text-left flex-wrap align-middle justify-center">
          <CardTitle>{recipe.name}</CardTitle>
          <CardDescription className="hidden md:block">
            {(1000 * (7 - index) - index * 100).toLocaleString()} Cooked!
          </CardDescription>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default function FeaturedRecipes() {
  const getRecipes = useCallback(() => {
    return recipes;
  }, []);

  const cards = getRecipes().map((recipe, index) => (
    <FeaturedCard key={index} recipe={recipe} index={index} />
  ));

  return (
    <div className="w-full text-center md:text-left">
      <h1 className="text-2xl center sm:text-3xl md:text-4xl font-bold">
        Featured Recipes
      </h1>
      <p className="text-lg">Check out our latest recipes!</p>
      <div className="hidden grid-cols-3 gap-4 mt-4 lg:grid grid-flow-row ">
        {[
          <span className="col-span-2">{cards[0]}</span>,
          cards[2],
          <span className="col-span-2">{cards[1]}</span>,
          cards[3],
          cards.slice(4, cards.length),
        ]}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 lg:hidden grid-flow-row ">
        {[<span className="col-span-2">{cards[0]}</span>, cards.slice(1, 5)]}
      </div>
    </div>
  );
}
