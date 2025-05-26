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
  const [cart, setCart] = useState<Set<string>>(new Set());
  // NEW: track which category is selected (or null for "all")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // define what terms each category should match
  const categoryFilters: Record<string, string[]> = {
    Flour: ["flour"],
    Cheese: ["cheese", "mozzarella", "parmesan"],
    Sauce: ["sauce"],
    Tomatoes: ["tomato"],
    Yeast: ["yeast"],
    Meats: ["sausage", "meat"],
  };

  const categories = Object.keys(categoryFilters);

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

  // first filter by search text...
  // then, if a category is selected, further filter by that category's terms
  const filtered = ingredients
    .filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((i) => {
      if (!selectedCategory) return true;
      const terms = categoryFilters[selectedCategory];
      const lower = i.name.toLowerCase();
      return terms.some((t) => lower.includes(t));
    });

  return (
    <div className="min-h-screen">
      <div className=" mx-auto px-4 py-8">
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
          <div className="flex flex-nowrap gap-4">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <Button
                  key={category}
                  variant={isActive ? "default" : "outline"}
                  className={`px-8 py-4 whitespace-nowrap text-xl rounded-lg ${
                    isActive ? "bg-accent text-white" : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory((prev) =>
                      prev === category ? null : category
                    )
                  }
                >
                  {category}
                </Button>
              );
            })}
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