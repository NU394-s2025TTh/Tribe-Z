import { type Recipe } from '@cs394-vite-nx-template/shared';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RecipeAndIngredientInfoProps {
    recipeId: string | undefined;
};

export default function RecipeAndIngredientInfo({ recipeId }: RecipeAndIngredientInfoProps) {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (loading) {
        return <div>Loading recipe...</div>; // Show a loading state while fetching
    }

    if (!recipe) {
        return <div>Recipe not found.</div>; // Handle case where recipe is not found
    }

    return (
        <div>
            <h1 className="text-3xl font-bold leading">{recipe.name}</h1>
            <div>
                <img
                    src="https://placehold.co/600x400"
                    alt={recipe.name}
                    className="w-full h-48 object-cover rounded-md mt-4 mb-4"
                />
            </div>
            <p><strong>Ingredients Needed:</strong></p>
            <ul style={{ listStyleType: '"- "', paddingLeft: '1.5rem' }}>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.amount} {ingredient.unit} {ingredient.ingredient.name}
                    </li>
                ))}
            </ul>
            <p><strong>Equipment Needed:</strong></p>
            <ul style={{ listStyleType: '"- "', paddingLeft: '1.5rem' }}>
                {recipe.equipment?.map((item, index) => (
                    <li key={index}>
                        {item.name}
                        {item.description && `: ${item.description}`}
                    </li>
                ))}
            </ul>
            <p><strong>Instructions:</strong></p>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem' }}>
                {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
            <div className="mt-6 text-center">
                <p>
                    Missing some ingredients? See our consolidated list of recommended vendors for each ingredient!
                </p>
                <Button
                    className="rounded-md px-4 py-4 justify-self-end mt-4"
                    variant="outline"
                    onClick={() => { navigate('/package') }}
                >
                    Go to {recipe.name} Package
                </Button>
            </div>
        </div>
    );
}