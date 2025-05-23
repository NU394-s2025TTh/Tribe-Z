import React, { useState, useEffect } from "react";
import IngredientCard from "@/components/sections/IngredientCard";
import type { Ingredient } from '@cs394-vite-nx-template/shared';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Ingredients() {
  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const categories = ["Flour", "Cheese", "Sauce", "Tomatoes", "Yeast", "Meats"];

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const ingredientsCollection = collection(db, "ingredients");
        const ingredientsSnapshot = await getDocs(ingredientsCollection);
        const ingredientsList = ingredientsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name ?? "Unknown Ingredient",
            type: data.type ?? { description: "No description available" },
            price: data.price ?? null,
            brand: data.brand ?? "Brand not specified",
            //add aniy other required Ingredient properties here with  fallbacks
          } as Ingredient;
        });
        setIngredients(ingredientsList);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);
    const filtered = ingredients.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* single “container” to center & cap width */}
      <div className="container mx-auto px-4 py-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-accent mb-8">
          Ingredients
        </h1>

        {/* SEARCH + CATEGORIES wrapper */}
        <div className="w-full max-w-3xl mx-auto mb-10">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search for ingredients"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-6 py-3 text-xl border rounded-md mb-6"
          />

          {/* Categories */}
          <div className="flex justify-between flex-nowrap gap-4">
            {categories.map(cat => (
              <Button
                key={cat}
                variant="outline"
                className="px-6 py-3 rounded-md text-lg whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(ing => (
            <div key={ing.id} className="h-full flex flex-col justify-between">
              <IngredientCard
                name={ing.name}
                description={ing.type.description}
                price={ing.price ?? "Price not available"}
                brand={ing.brand}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}