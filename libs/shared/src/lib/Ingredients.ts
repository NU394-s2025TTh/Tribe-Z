// all ids provided by firebase
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

export interface IngredientType {
  id: string;
  name: string;
  description: string;
  unit: MeasurementUnits;
  amount: number;
}

export interface Ingredient {
  id: string;
  ingredientTypeId: string; // foreign key to IngredientType
  name: string; // product name of the ingredient ("Wonder Classic White" vs "white bread")
  brand?: string; // (e.g. "Wonder Bread")
  preferredVendor?: string; // (e.g. "Kroger")
  vendorProductId?: string; // (e.g. "123456789")
}
