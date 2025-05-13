import { Ingredient, IngredientType } from './Ingredients.js';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  instructions: Array<string>;
  ingredients: Array<IngredientType>; // list of ingredienttype ids
  recommendedIngredients?: Array<Ingredient>; // list of ingredient ids
  servings: number;
  prepTime: number;
  cookTime: number;
  equipment: Array<string>; // list of equipmenttype ids
  recommendedEquipment?: Array<string>; // list of equipment ids
}

export interface GuidedRecipe {
  id: string;
  recipeId: string; // foreign key to Recipe
  name?: string; // optional, if not provided, use recipe name
  steps: Map<string, string>; // step title to instruction
  assets?: Map<string, string>; // step title to asset (image or video) url
}
