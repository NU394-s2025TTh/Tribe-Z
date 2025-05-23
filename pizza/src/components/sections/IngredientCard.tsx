import React from "react";

interface IngredientCardProps {
  name: string;
  description: string;
  price: string;
  brand?: string;
  packageSize?: string;
}

export default function IngredientCard({
  name,
  description,
  price,
  brand,
  packageSize,
}: IngredientCardProps) {
  return (
    <div className="border rounded-lg shadow-lg p-4 flex flex-col items-center bg-white w-full h-auto">
      <img
        src={"https://placehold.co/350x200"}
        alt={name}
        className=" object-cover rounded-md mb-4"
      />
      <p className="font-semibold text-l text-center">{name}</p>
      <p className="text-gray-700 text-center mt-2">{price}</p>
      {/* {brand && <p className="text-gray-500 text-center">Brand: {brand}</p>}
      {packageSize && (
        <p className="text-gray-500 text-center">Package Size: {packageSize}</p>
      )} */}
    </div>
  );
}