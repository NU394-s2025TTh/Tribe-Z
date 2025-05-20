import { useParams, useSearchParams } from 'react-router-dom';
import { StoreIngredientCard } from '../components/sections/StoreIngredientCard';
import { useState, useEffect } from 'react';
import {
  Ingredient,
  IngredientType,
  Recipe,
} from '@cs394-vite-nx-template/shared';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { resolveSoa } from 'dns';

type ResIngType = [Response, IngredientType];

function PizzaPackage() {
  // const [searchParams] = useSearchParams();
  // const pizzaName = searchParams.get('pizza');
  const { pizzaName } = useParams();

  const [ingredientIds, setIngredientIds] = useState<
    (string | IngredientType)[]
  >([]);
  const [ingredients, setIngredients] = useState<
    (Ingredient | IngredientType)[]
  >([]);

  const [formattedName, setFormattedName] = useState('');

  const getRecipe = async (): Promise<void> => {
    if (!pizzaName) return; // Ensure recipeId is defined
    try {
      const recipeRef = doc(db, 'recipes', pizzaName); // Reference to the specific recipe
      const recipeSnapshot = await getDoc(recipeRef);
      if (recipeSnapshot.exists()) {
        setIngredientIds(
          (recipeSnapshot.data() as Recipe).ingredients.map(
            (e, index) => e.recommendation ?? e.ingredient
          )
        ); // Set the recipe data
        const data: Recipe = recipeSnapshot.data() as Recipe;
        console.log('Recipe name:', data.name);
        setFormattedName(data.name);
      } else {
        console.error('Recipe not found');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  useEffect(() => {
    getRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pizzaName]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredientPromises = ingredientIds.map(async (ingredientId) => {
        if (typeof ingredientId === 'string') {
          const ingredientRef = doc(db, 'ingredients', ingredientId);
          const ingredientSnapshot = await getDoc(ingredientRef);
          if (ingredientSnapshot.exists()) {
            return {
              id: ingredientSnapshot.id,
              ...ingredientSnapshot.data(),
            } as Ingredient;
          } else {
            console.error('Ingredient not found');
          }
        }
        return ingredientId;
      });
      const ingredients = await Promise.all(ingredientPromises);
      const filteredIngredients = ingredients.filter(
        (ingredient) => ingredient !== undefined
      ) as Ingredient[];
      console.log('Fetched Ingredients:', filteredIngredients);
      setIngredients(filteredIngredients);
    };
    fetchIngredients();
  }, [ingredientIds]);

  console.log('Ingredients:', ingredients);

  const formattedPizzaName = formattedName
    ? formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
    : '';

  const [storeToIngredients, setStoreToIngredients] = useState<
    Record<string, any[]>
  >({});

  useEffect(() => {
    const transformedData = ingredients.reduce((acc, ingredient) => {
      let storeName: string;
      if ('preferredVendor' in ingredient && ingredient.preferredVendor) {
        storeName = ingredient.preferredVendor;
      } else {
        storeName = 'Unknown Store';
      }
      if (!acc[storeName]) {
        acc[storeName] = [];
      }
      acc[storeName].push(ingredient);
      return acc;
    }, {} as Record<string, (Ingredient | IngredientType)[]>);

    if ('Unknown Store' in transformedData) {
      const kroger = async () => {
        const zip = '60201';
        const locations = await fetch('/api/kroger-locations?zip=' + zip);
        return (await locations.json())['data'][0];
      };
      const handleKrogerData = async () => {
        try {
          const location = await kroger();
          console.log('Location:', location);

          const initialRecommendations: string[] = [];

          const responses = await Promise.allSettled(
            transformedData['Unknown Store'].map((ingredient) => {
              const searchTerm =
                'brand' in ingredient || !('type' in ingredient)
                  ? ingredient.name
                  : ingredient.type.name;

              initialRecommendations.push(searchTerm);

              return fetch(
                `/api/kroger-products?locationId=${
                  location['locationId']
                }&searchTerm=${searchTerm.split(' ').slice(0, 8).join(' ')}`
              );
            })
          );

          const fulfilledResponses = responses
            .map((e, i) => [e, initialRecommendations[i]])
            .filter(
              ([r, i]) =>
                (r as PromiseFulfilledResult<any>).status === 'fulfilled'
            ) as [PromiseFulfilledResult<Response>, string][];

          const remove: string[] = [];
          const products = await Promise.all(
            fulfilledResponses.map(async ([response, name]) => {
              console.log(name);
              try {
                const data = await response.value.json();

                const d = {
                  id: data.data[0]['productId'],
                  name:
                    data.data[0]['description'] +
                    ', ' +
                    data.data[0]['items'][0]['size'],
                  type: {} as IngredientType,
                  brand: data.data[0]['brand'],
                  preferredVendor: 'Kroger',
                  vendorProductId: data.data[0]['productId'],
                  link: 'https://kroger.com' + data.data[0]['productPageURI'],
                  price: '$' + data.data[0]['items'][0]['price']['regular'],
                  additionalInfo: name,
                } as Ingredient & {
                  additionalInfo: string;
                };
                remove.push(name);
                return d;
              } catch {
                // console.error('Error parsing Kroger response:', error);
                return {
                  id: 'unknown',
                  name: 'Unknown',
                  type: {} as IngredientType,
                  brand: 'Unknown',
                  preferredVendor: 'Kroger',
                  vendorProductId: 'unknown',
                  link: '',
                  price: '0.00',
                  additionalInfo: 'failed',
                } as Ingredient & {
                  additionalInfo: string;
                };
              }
            })
          );

          console.log(products, 'transformed fully');
          setStoreToIngredients({
            [location['name']]: products.filter((p) => p.id !== 'unknown'),
            'No Avaliable Merchants': transformedData['Unknown Store'].filter(
              (e) =>
                remove.indexOf(
                  'brand' in e || !('type' in e) ? e.name : e.type.name
                ) === -1
            ),
            ...Object.fromEntries(
              Object.entries(transformedData).filter(
                ([k, e]) => k !== 'Unknown Store'
              )
            ),
          });
        } catch (error) {
          console.error('Error processing Kroger data:', error);
        }
      };

      handleKrogerData();
    } else {
      setStoreToIngredients(transformedData);
    }

    console.log('Transformed Data:', transformedData);
  }, [ingredients]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold">
        {formattedPizzaName} Pizza Package
      </h1>

      <div className="flex flex-col items-center gap-4 mt-4">
        {Object.entries(storeToIngredients).map(([storeName, ingredients]) => (
          <StoreIngredientCard
            key={storeName}
            ingredients={ingredients}
            storeName={storeName}
          />
        ))}
      </div>
    </div>
  );
}
export default PizzaPackage;
