import RecipeAndIngredientInfo from '@/components/sections/RecipeAndIngredientInfo';
import { useParams } from 'react-router-dom';

export default function RecipeDetails() {
    const { recipeId } = useParams();
  return <RecipeAndIngredientInfo recipeId={recipeId}/>;
}