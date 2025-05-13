// all ids provided by firebase

import { Item, RecommendedItem } from './Items.js';

export enum DietaryContraindication {
  NONE = 'none',
  GLUTEN = 'gluten',
  DAIRY = 'dairy',
  NUTS = 'nuts',
  SHELLFISH = 'shellfish',
  EGG = 'egg',
  SOY = 'soy',
  FISH = 'fish',
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  KOSHER = 'kosher',
  HALAL = 'halal',
  BERRY = 'berry',
}

export interface IngredientType extends Item {
  dietaryContraindications?: Array<DietaryContraindication>;
}

export type Ingredient = RecommendedItem<IngredientType>;
