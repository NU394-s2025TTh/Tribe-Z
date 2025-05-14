import { Equipment, EquipmentType } from './items/Equipment.js';
import { Ingredient, IngredientType } from './items/Ingredients.js';

export enum MeasurementUnits {
  TEASPOON = 'teaspoon',
  TABLESPOON = 'tablespoon',
  CUP = 'cup',
  PINT = 'pint',
  QUART = 'quart',
  GALLON = 'gallon',
  FLUID_OUNCE = 'fluid ounce',
  LITER = 'liter',
  MILLILITER = 'milliliter',
  GRAM = 'gram',
  KILOGRAM = 'kilogram',
  OUNCE = 'ounce',
  POUND = 'pound',
}

export interface MeasuredIngredient {
  ingredient: IngredientType;
  recommendation: Ingredient['id']; // foreign key to Ingredient
  amount: number; // amount of the ingredient
  unit: MeasurementUnits; // unit of measurement
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  instructions: Array<string>;
  ingredients: Array<MeasuredIngredient>;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  equipment?: Array<EquipmentType>;
  headerImage?: string; // url to the header image
  recommendedEquipment?: Array<Equipment['id']>; // foreign key to Equipment
}

export interface GuidedRecipe {
  id: string;
  recipeId: Recipe['id']; // foreign key to Recipe
  name?: string; // optional, if not provided, use recipe name
  steps: Record<string, string>; // step title to instruction
  assets?: Record<string, string>; // step title to asset (image or video) url
}
