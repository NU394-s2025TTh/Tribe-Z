import type { Ingredient } from '@cs394-vite-nx-template/shared';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface StoreIngredientCardProps {
  ingredients: Ingredient[];
  storeName: string;
}

export function StoreIngredientCard({
  ingredients,
  storeName,
}: StoreIngredientCardProps) {
  return (
    <Card className="w-[100%]">
      <CardHeader className="border-b-1">
        <CardTitle className="text-lg font-semibold leading">
          {storeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex justify-between items-center text-sm py-1"
          >
            {(ingredient as Ingredient & { additionalInfo: string })
              .additionalInfo ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        to={ingredient.link as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate flex-1 mr-8 text-blue-600 hover:underline"
                      >
                        {ingredient.name}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="">
                      {`Closest match for our recommended ingredient, ${
                        (ingredient as Ingredient & { additionalInfo: string })
                          .additionalInfo
                      }`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="font-medium ml-8">{ingredient.price}</span>
              </>
            ) : (
              <>
                <Link
                  to={ingredient.link as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate flex-1 mr-8 text-blue-600 hover:underline"
                >
                  {ingredient.name}
                </Link>
                <span className="font-medium ml-8">{ingredient.price}</span>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
