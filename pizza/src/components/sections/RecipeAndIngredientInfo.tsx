import { type Recipe } from '@cs394-vite-nx-template/shared';
import { SetStateAction, useEffect, useState, Dispatch} from 'react';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Fuse from 'fuse.js';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import OverlayCard from '@/components/sections/LocationInputForm';
import type { Ingredient } from '@cs394-vite-nx-template/shared';

interface RecipeAndIngredientInfoProps {
  recipeId: string | undefined;
}

export default function RecipeAndIngredientInfo({
  recipeId,
}: RecipeAndIngredientInfoProps) {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedEquipment, setCheckedEquipment] = useState<Set<number>>(new Set());

  const toggleItem = (index: number, setCheckedItem: Dispatch<SetStateAction<Set<number>>>) => {
    setCheckedItem((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const handleGoToPackage = () => {
    const location = localStorage.getItem("userLocation");
    if (location) {
      navigate(`/package/${recipeId}`);
    } else {
      setOverlayOpen(true);
    }
  };

  const getRecipe = async (): Promise<void> => {
    if (!recipeId) return; // Ensure recipeId is defined
    try {
      const recipeRef = doc(db, 'recipes', recipeId); // Reference to the specific recipe
      const recipeSnapshot = await getDoc(recipeRef);
      if (recipeSnapshot.exists()) {
        setRecipe(recipeSnapshot.data() as Recipe); // Set the recipe data
      } else {
        console.error('Recipe not found');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  useEffect(() => {
    getRecipe();
  }, [recipeId]);


  const logFuzzyMatches = async () => {
    if (!recipe) return;
    const snap = await getDocs(collection(db, 'ingredients'));
    const allIngredients = snap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name ?? 'Unknown Ingredient',
      type: doc.data().type ?? { description: 'No description available' },
      price: doc.data().price ?? null,
      brand: doc.data().brand ?? 'Brand not specified',
      packageSize: doc.data().packageSize,
    })) as Ingredient[];
    const ingredientOnly = allIngredients.filter((i) => {
      const cat = (i.type as any).category;
      return !cat || String(cat).toLowerCase() !=='equipment';
    });

    const fuse = new Fuse(ingredientOnly,{
      keys: ['name'],
      threshold: 0.55,          // higher threshold = more lenient
      distance: 200,           // allow matches farther apart
      minMatchCharLength: 1,   // match even short terms oka
      ignoreLocation: true,    // don't penalize based on match location
    });

    //findds best match
    const matches = recipe.ingredients
      .map(({ ingredient }) => {
        const results = fuse.search(ingredient.name);
        return results.length ? results[0].item : null;
      })
      .filter((m): m is Ingredient => Boolean(m));

    console.log('Fuzzy matches for recipe:', matches);
  };

  if (loading) {
    return <div>Loading recipe...</div>; // Show a loading state while fetching
  }

  if (!recipe) {
    return <div>Recipe not found.</div>; // Handle case where recipe is not found
  }

  return (
    <div>
      <h1 className="text-3xl font-bold leading text-accent text-center">{recipe.name}</h1>
      
      <div className='md:w-[50%] text-center md:translate-x-[50%] bg-accent text-accent-foreground rounded-md flex flex-col gap-2 p-2 mt-4'>
        <div>
          <img
            src={recipe.headerImage} 
            alt={recipe.name}
            className="w-full h-48 object-cover rounded-md mt-4 mb-4"
          />
        </div>
        <div> <strong> {recipe.name}: </strong>  {recipe.description} </div>
        <div> <strong> Estimated prep time:</strong> {recipe.prepTime} minutes</div>
        <div> <strong> Cook time:</strong> {recipe.cookTime} minutes</div>
        <div> <strong> Servings: </strong>{recipe.servings} servings </div>
        <div className='flex flex-row items-center justify-center gap-2'> <strong> Cook mode: </strong> <Switch /></div>
      </div>
      <div className='md:w-[50%] md:translate-x-[50%] border-4 rounded-md p-2'> 
      <p className='pt-5'>
        <strong>Ingredients Needed:</strong>
      </p>
      <div className="flex flex-row">
        <div className="flex-col flex">
          <ul style={{ paddingLeft: '1.5rem' }}>
            {recipe.ingredients.map((ingredient, index) => { 
              const isChecked = checkedIngredients.has(index);
              
              return (
              <li key={index}>
                <Checkbox checked={isChecked} onCheckedChange={() => toggleItem(index, setCheckedIngredients)}/> 
                  <span className={isChecked ? "line-through text-accent" : ""}> {ingredient.amount} {ingredient.unit}{' '}
                {ingredient.ingredient.name} </span>
              </li>
            );})}
          </ul>
          <p className='pt-5'>
            <strong>Equipment Needed:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {recipe.equipment?.map((item, index) => {
              const isChecked = checkedEquipment.has(index);

              return (
              <li key={index}>
                <Checkbox checked={isChecked} onCheckedChange={() => toggleItem(index, setCheckedEquipment)} /> 
                  <span className={isChecked ? "line-through text-accent" : ""}> {item.name}
                {item.description && `: ${item.description}`}</span>
              </li>
            );})}
          </ul>
        </div>
      </div>
      <p className='pt-5'>
        <strong>Instructions:</strong>
      </p>
      <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem'}}>
        {recipe.instructions.map((step, index) => (
          <li key={index} className='pt-2'>{step}</li>
        ))}
      </ol>
      </div>
      <div className="mt-6 text-center bg-muted p-2 rounded-md">
        <p className='text-lg'>
          Missing some ingredients? See our consolidated list of recommended
          vendors for each ingredient!
        </p>
          <Button
            className="rounded-md px-4 py-4 justify-self-end mt-4 hover:scale-105 button-pointer"
            variant="outline"
            onClick={handleGoToPackage}
          >
            Go to {recipe.name} Package
          </Button>
          {/* <Button
          variant="outline"
          onClick={logFuzzyMatches}
          disabled={!recipe}
        >
          Log Matching Ingredients
        </Button> */}
      </div>
      <OverlayCard open={overlayOpen} onClose={() => setOverlayOpen(false)} recipeId={recipeId}/>
    </div>
  );
}
