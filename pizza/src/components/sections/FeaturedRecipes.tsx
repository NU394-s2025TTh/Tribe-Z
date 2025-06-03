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
import {
  collection,
  getDocs,
  query,
  limit,
  QueryConstraint,
} from 'firebase/firestore';

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
      <Card
        key={recipe.id}
        className="hover:bg-accent hover:text-accent-foreground hover:scale-101"
      >
        <CardContent>
          <img
            src={recipe.headerImage}
            alt="Pizza"
            className="w-full h-48 object-cover rounded-md"
          />
        </CardContent>
        <CardFooter className="flex md:justify-between text-left flex-wrap align-middle justify-center">
          <CardTitle className="truncate max-w-[50%] text-inherit">
            {recipe.name}
          </CardTitle>
          <CardDescription className="hidden md:block text-inherit">
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
    const q = query(recipesRef);

    const querySnapshot = await getDocs(q);

    let recipes: Recipe[] = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Recipe[];

    recipes = recipes
      .filter(
        (recipe) =>
          recipe.headerImage && !recipe.headerImage.includes('placeholder')
      )
      .slice(0, 7);

    setRecipes(recipes);
  }, []);

  useEffect(() => {
    getRecipes();
  }, [getRecipes]);

  const cards = recipes.map((recipe, index) => (
    <FeaturedCard key={index} recipe={recipe} index={index} />
  ));

  return (
    <div className="w-full text-center md:text-left">
      {/* Marketing Header */}
      <div className="bg-accent text-accent-foreground py-8 px-4 rounded-md shadow-md">
        <h2 role="heading" className="text-2xl sm:text-3xl md:text-4xl font-bold">
          DoughJo: Your One-Stop Shop for Crafting World-Class Pizza at Home
        </h2>
        <p className="text-lg mt-4">
          Giving home pizza makers everything they need to effortlessly create
          delicious pizza right from their own kitchen. Fresh ingredients,
          high-quality equipment, and a helpful chatbot are just a click away!
        </p>
        {/* Call-to-Action Buttons */}
        <div className="mt-6 flex flex-col gap-4">
          <a
            href="/materials"
            className="inline-block bg-accent-foreground text-accent py-3 px-6 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Buy Fresh Ingredients
          </a>
          <a
            href="/materials"
            className="inline-block bg-accent-foreground text-accent py-3 px-6 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Shop Pizza Tools
          </a>
          <a
            href="/chatbot"
            className="inline-block bg-accent-foreground text-accent py-3 px-6 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Ask Our Chatbot
          </a>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="py-8">
        <h1 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold text-accent">
          Featured Recipes 🍕
        </h1>
        <p className="text-lg text-center">See what recipes are trending!</p>
      </div>
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
        {[<span className="col-span-2">{cards[0]} </span>, cards.slice(1, 5)]}
      </div>
    </div>
  );
}