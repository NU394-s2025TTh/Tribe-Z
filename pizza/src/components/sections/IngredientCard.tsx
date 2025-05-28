import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface IngredientCardProps {
  name: string;
  description: string;
  price: string;
  brand?: string;
  packageSize?: string;
  productImage?: string; // optional, can be used for future enhancements
  isInCart: boolean;
  onAddToCart: () => void;  // now really a toggle
}

export default function IngredientCard({
  name,
  description,
  price,
  brand,
  packageSize,
  productImage,
  isInCart,
  onAddToCart,
}: IngredientCardProps) {
  const [flipped, setFlipped] = useState(false);

  console.log(productImage)

  return (
    <div
      className="w-full cursor-pointer"
      style={{ perspective: "900px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "none",
        }}
      >
        {/* FRONT */}
        <div
          className="bg-white border rounded-lg shadow-lg p-4 flex flex-col items-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={productImage || "/logo/doughjo_main.png"}
            alt={name}
            className="object-contain rounded-md mb-4 w-full aspect-3/1"
            onError={(e) => {
              e.currentTarget.src = "/logo/doughjo_main.png";
            }}
          />
          <p className="font-semibold text-lg text-center">{name}</p>
          <p className="text-gray-700 text-center mt-2">{price}</p>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 bg-white border rounded-lg shadow-lg p-4 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Name & Price */}
          <p className="font-semibold text-xl text-center mb-1">{name}</p>
          <p className="text-gray-700 text-center mb-4">{price}</p>

          {/* Details */}
          <p className="text-gray-700 text-center mb-2">{description}</p>
          {brand && (
            <p className="text-gray-500 text-center">Brand: {brand}</p>
          )}
          {packageSize && (
            <p className="text-gray-500 text-center">
              Package Size: {packageSize}
            </p>
          )}

          {/* Toggle Add/Remove */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className={`mt-4 w-full ${
              isInCart
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-accent hover:bg-accent text-white"
            }`}
          >
            {isInCart ? "Remove from cart" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
