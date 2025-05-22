import React from "react";

interface IngredientCardProps {
  image: string;
  description: string;
  price: string;
}

export default function IngredientCard({ image, description, price }: IngredientCardProps) {
  return (
    <div className="border rounded-lg shadow-lg p-6 flex flex-col items-center bg-white">
      <img
        src={image}
        alt={description}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <p className="font-semibold text-xl text-center">{description}</p>
      <p className="text-gray-500 text-lg text-center">{price}</p>
    </div>
  );
}