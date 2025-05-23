import React, { useState, useEffect } from "react";
import IngredientCard from "@/components/sections/IngredientCard";
import type { Ingredient } from "@cs394-vite-nx-template/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Ingredients() {
  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  // track IDs in cart
  const [cart, setCart] = useState<Set<string>>(new Set());
  const categories = ["Flour", "Cheese", "Sauce", "Tomatoes", "Yeast", "Meats"];

  useEffect(() => {
    async function fetchIngredients() {
      const snap = await getDocs(collection(db, "ingredients"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name ?? "Unknown Ingredient",
        type: doc.data().type ?? { description: "No description available" },
        price: doc.data().price ?? null,
        brand: doc.data().brand ?? "Brand not specified",
        packageSize: doc.data().packageSize,
      })) as Ingredient[];
      setIngredients(list);
    }
    fetchIngredients();
  }, []);

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-accent mb-8">
          Ingredients
        </h1>

        {/* Search + Categories */}
        <div className="w-full max-w-3xl mx-auto mb-10">
          <Input
            type="text"
            placeholder="Search for ingredients"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-8 py-4 text-2xl border rounded-lg mb-4"
          />
          <div className="flex justify-between gap-4 flex-wrap w-full">
        {categories.map((category, index) => (
          <Button
            key={index}
            className="px-6 py-3 rounded-md text-lg button-pointer"
            variant={"outline"}
          >
            {category}
          </Button>
        ))}
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((ing) => (
            <IngredientCard
              key={ing.id}
              name={ing.name}
              description={ing.type.description}
              price={ing.price ?? "Price not available"}
              brand={ing.brand}
              packageSize={ing.packageSize}
              isInCart={cart.has(ing.id)}
              onAddToCart={() =>
                setCart((prev) => {
                  const next = new Set(prev);
                  if (next.has(ing.id)) next.delete(ing.id);
                  else next.add(ing.id);
                  return next;
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}