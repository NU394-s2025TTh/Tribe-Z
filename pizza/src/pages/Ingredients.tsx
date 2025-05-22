import React, { useState } from "react";
import IngredientCard from "@/components/sections/IngredientCard";
import { Input } from "@/components/ui/input";

export default function Ingredients() {
  const [search, setSearch] = useState("");

  const categories = ["Flour", "Cheese", "Sauce", "Tomatoes", "Yeast", "Meats"];
  const ingredients = [
    { image: "https://via.placeholder.com/300x200", description: "Ingredient 1", price: "$5.00" },
    { image: "https://via.placeholder.com/300x200", description: "Ingredient 2", price: "$3.50" },
    { image: "https://via.placeholder.com/300x200", description: "Ingredient 3", price: "$7.25" },
    { image: "https://via.placeholder.com/300x200", description: "Ingredient 4", price: "$2.00" },
    { image: "https://via.placeholder.com/300x200", description: "Ingredient 5", price: "$4.75" },
    { image: "https://via.placeholder.com/300x200", description: "Ingredient 6", price: "$6.00" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-3 text-accent">Ingredients</h1>
      <div className="flex justify-center mb-6">
        <Input
          type="text"
          placeholder="Search for ingredients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-6 py-3 w-full max-w-lg text-lg"
        />
      </div>
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {categories.map((category, index) => (
          <button
            key={index}
            className="px-6 py-3 bg-gray-200 rounded-md hover:bg-gray-300 text-lg"
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ingredients.map((ingredient, index) => (
          <IngredientCard
            key={index}
            image={ingredient.image}
            description={ingredient.description}
            price={ingredient.price}
          />
        ))}
      </div>
    </div>
  );
}