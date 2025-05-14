import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '../ui/card';

import { type Recipe } from '@cs394-vite-nx-template/shared';

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export function FeaturedCard({
  recipe,
  index,
}: {
  recipe: Recipe;
  index: number;
}) {
  console.log(recipe);
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
          <CardTitle className="truncate max-w-[50%]">{recipe.name}</CardTitle>
          <CardDescription className="hidden md:block">
            {(1000 * (7 - index) - index * 100).toLocaleString()} Cooked!
          </CardDescription>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const getRecipes = useCallback(async (): Promise<void> => {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, limit(7));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs[0].data());
    setRecipes(querySnapshot.docs.map((e, index) => ({...e.data(), id: e.id})) as Recipe[]);
  }, []);

  useEffect(() => {
    getRecipes();
  }, [getRecipes]);

  const cards = recipes.map((recipe, index) => (
    <FeaturedCard key={index} recipe={recipe} index={index} />
  ));

  return (
    <div className="w-full text-center md:text-left">
      <h1 className="text-2xl center sm:text-3xl md:text-4xl font-bold">
        Featured Recipes
      </h1>
      <p className="text-lg">See what recipes are trending!</p>
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
