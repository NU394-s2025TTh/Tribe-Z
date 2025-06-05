import { type Recipe, MeasurementUnits } from '@cs394-vite-nx-template/shared';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import OverlayCard from '@/components/sections/LocationInputForm';
import { CheckCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GuidedRecipe } from './GuidedRecipe';

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
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );
  const [checkedEquipment, setCheckedEquipment] = useState<Set<number>>(
    new Set()
  );
  const [guidedStep, setGuidedStep] = useState<number>(0);

  // Toggle between checking all ingredients/equipment and unchecking all
  const markAllAsChecked = () => {
    if (!recipe) return;

    // Check if all items are already selected
    const allIngredientsSelected = checkedIngredients.size === recipe.ingredients.length;
    const allEquipmentSelected = !recipe.equipment || checkedEquipment.size === recipe.equipment.length;
    const everythingSelected = allIngredientsSelected && allEquipmentSelected;

    if (everythingSelected) {
      // If everything is selected, clear all selections
      setCheckedIngredients(new Set());
      setCheckedEquipment(new Set());
    } else {
      // Otherwise, select everything
      const allIngredients = new Set(
        Array.from({ length: recipe.ingredients.length }, (_, i) => i)
      );
      const allEquipment = recipe.equipment
        ? new Set(
            Array.from({ length: recipe.equipment.length }, (_, i) => i)
          )
        : new Set<number>();

      setCheckedIngredients(allIngredients);
      setCheckedEquipment(allEquipment);
    }
  };

  const toggleItem = (
    index: number,
    setCheckedItem: Dispatch<SetStateAction<Set<number>>>
  ) => {
    setCheckedItem((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const handleGoToPackage = () => {
    const location = localStorage.getItem('userLocation');
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
  }, [recipeId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div>Loading recipe...</div>; // Show a loading state while fetching
  }

  if (!recipe) {
    return <div>Recipe not found.</div>; // Handle case where recipe is not found
  }

  return (
    <div>
      <h1 className="text-3xl font-bold leading text-accent text-center">
        {recipe.name}
      </h1>

      <div className="w-full flex justify-center flex-col items-center">
        <div className="w-[80%] text-center bg-accent text-accent-foreground rounded-md flex flex-col gap-2 p-2 mt-4">
          <div>
            <img
              src={recipe.headerImage}
              alt={recipe.name}
              className="w-full h-48 object-cover rounded-md mt-4 mb-4"
            />
          </div>
          <div>
            {' '}
            <strong> {recipe.name}: </strong> {recipe.description}{' '}
          </div>
          <div>
            {' '}
            <strong> Estimated prep time:</strong> {recipe.prepTime} minutes
          </div>
          <div>
            {' '}
            <strong> Cook time:</strong> {recipe.cookTime} minutes
          </div>
          <div>
            {' '}
            <strong> Servings: </strong>
            {recipe.servings} servings{' '}
          </div>
        </div>
        <div className="md:w-[80%] border-4 rounded-md p-2">
          <p className="pt-5">
            <strong>Ingredients Needed:</strong>
          </p>
          <div className="flex flex-row">
            <div className="flex-col flex">
              <ul style={{ paddingLeft: '1.5rem' }}>
                {recipe.ingredients.map((ingredient, index) => {
                  const isChecked = checkedIngredients.has(index);

                  return (
                    <li key={index}>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() =>
                          toggleItem(index, setCheckedIngredients)
                        }
                      />
                      <span
                        className={isChecked ? 'line-through text-accent' : ''}
                      >
                        {' '}
                        {ingredient.amount} {ingredient.unit}{' '}
                        {ingredient.ingredient.name}{' '}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="pt-5">
                <strong>Equipment Needed:</strong>
              </p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {recipe.equipment?.map((item, index) => {
                  const isChecked = checkedEquipment.has(index);

                  return (
                    <li key={index}>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() =>
                          toggleItem(index, setCheckedEquipment)
                        }
                      />
                      <span
                        className={isChecked ? 'line-through text-accent' : ''}
                      >
                        {' '}
                        {item.name}
                        {item.description && `: ${item.description}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={markAllAsChecked}
                  className={`${
                    checkedIngredients.size === recipe.ingredients.length && 
                    (!recipe.equipment || checkedEquipment.size === recipe.equipment.length)
                      ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                      : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                  } cursor-pointer`}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {checkedIngredients.size === recipe.ingredients.length && 
                   (!recipe.equipment || checkedEquipment.size === recipe.equipment.length)
                    ? "Unselect All"
                    : "Got Everything?"}
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Guided Recipe Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 rounded-xl border border-accent/20">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-accent mb-2">
                <span role="img" aria-label="cooking">
                  🍳
                </span>{' '}
                Ready to Cook Like a Pro?
              </h3>
              <p className="text-muted-foreground">
                Let our AI Sensei guide you through each step with personalized
                tips and real-time help!
              </p>
            </div>

            {(checkedIngredients.size < recipe.ingredients.length ||
              (recipe.equipment && checkedEquipment.size < recipe.equipment.length)) && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">
                  <span role="img" aria-label="clipboard">
                    📝
                  </span>{' '}
                  Missing Items Detected
                </h4>
                <p className="text-sm text-amber-700 mb-3">
                  You have {recipe.ingredients.length - checkedIngredients.size}{' '}
                  unchecked ingredients{recipe.equipment && checkedEquipment.size < recipe.equipment.length ?
                    ` and ${recipe.equipment.length - checkedEquipment.size} unchecked equipment items` : ''}.
                  AI Sensei will adapt the recipe with alternative techniques and substitutions!
                </p>
                <div className="text-xs text-amber-600">
                  {checkedIngredients.size < recipe.ingredients.length && (
                    <div>Missing ingredients: {recipe.ingredients
                      .filter((_, index) => !checkedIngredients.has(index))
                      .map((ing) => ing.ingredient.name)
                      .join(', ')}
                    </div>
                  )}
                  {recipe.equipment && checkedEquipment.size < recipe.equipment.length && (
                    <div>Missing equipment: {recipe.equipment
                      .filter((_, index) => !checkedEquipment.has(index))
                      .map((eq) => eq.name)
                      .join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex w-full justify-center items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <span role="img" aria-label="chef">
                      🧑‍🍳
                    </span>
                    <span className="mx-2">
                      Start Guided Cooking Experience
                    </span>
                    <span role="img" aria-label="sparkles">
                      ✨
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] h-[90vh]">
                  <DialogHeader>
                    <div className="flex justify-between items-center">
                      <DialogTitle>
                        <span role="img" aria-label="chef">
                          🧑‍🍳
                        </span>{' '}
                        Sensei's Guidance: {recipe.name}
                        {` - Step ${guidedStep + 1}`}
                      </DialogTitle>
                    </div>
                  </DialogHeader>
                  <GuidedRecipe
                    recipe={recipe}
                    recipeId={recipeId}
                    stepSetter={setGuidedStep}
                    missingIngredients={[
                      ...recipe.ingredients.filter(
                        (_, index) => !checkedIngredients.has(index)
                      ),
                      // Convert missing equipment to ingredient-like format for AI processing
                      ...(recipe.equipment
                        ?.filter((_, index) => !checkedEquipment.has(index))
                        .map((eq) => ({
                          ingredient: {
                            name: eq.name,
                            description: eq.description || "Equipment item"
                          },
                          amount: 1,
                          unit: MeasurementUnits.GRAM,
                        })) || [])
                    ]}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <p className="pt-5">
            <strong>Instructions:</strong>
          </p>
          <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem' }}>
            {recipe.instructions.map((step, index) => (
              <li key={index} className="pt-2">
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 text-center bg-muted p-2 rounded-md">
          <p className="text-lg">
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
        <OverlayCard
          open={overlayOpen}
          onClose={() => setOverlayOpen(false)}
          recipeId={recipeId}
        />
      </div>
    </div>
  );
}
