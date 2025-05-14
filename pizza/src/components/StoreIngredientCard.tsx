import { Ingredient } from "../../../libs/shared/src/lib/items/Ingredients";

interface StoreIngredientCardProps {
  ingredients: Ingredient[];
  storeName: string;
}

export function StoreIngredientCard({ ingredients, storeName }: StoreIngredientCardProps) {
  return (
    <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-xl shadow-sm mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b font-semibold text-gray-800">
        <span>{storeName}</span>
      </div>

      <div className="px-4 py-2">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex justify-between items-center text-sm py-1"
          >
            <a
              href={ingredient.link}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-blue-600 hover:underline flex-1 mr-8"
            >
              {ingredient.name}
            </a>
            <span className="font-medium ml-8">{ingredient.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}