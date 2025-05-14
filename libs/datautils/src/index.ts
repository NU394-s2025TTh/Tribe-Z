import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import admin from 'firebase-admin';

// import { ServiceAccount } from 'firebase-admin';
import * as fs from 'fs/promises';
import * as path from 'path';

import {
  Recipe as FirestoreRecipe,
  MeasuredIngredient as FirestoreMeasuredIngredient,
  GuidedRecipe as FirestoreGuidedRecipe,
} from '@cs394-vite-nx-template/shared';

import {
  Equipment as FirestoreEquipment,
  // EquipmentType,
  // EquipmentCategory,
} from '@cs394-vite-nx-template/shared';

import {
  Ingredient as FirestoreIngredient,
  // IngredientType,
  // DietaryContraindication,
} from '@cs394-vite-nx-template/shared';

const data = await import(
  path.join(__dirname, 'data', 'firebase-admin-sdk.json'),
  { with: { type: 'json' } }
).then((module) => module.default);

console.log(data, '!!');

initializeApp({
  credential: admin.credential.cert(data as admin.ServiceAccount),
});
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

console.log(db, '!!');

const INGREDIENTS_COLLECTION = 'ingredients';
const EQUIPMENT_COLLECTION = 'equipment';
const RECIPES_COLLECTION = 'recipes';
const GUIDES_COLLECTION = 'guidedRecipes';

async function loadJsonData<T>(fileName: string): Promise<T> {
  const filePath = path.join(__dirname, 'data', fileName);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading or parsing JSON file ${fileName}:`, error);
    throw error;
  }
}

async function uploadAllData() {
  const ingredientTempToFirebaseIdMap = new Map<string, string>();
  const equipmentTempToFirebaseIdMap = new Map<string, string>();
  const recipeTempToFirebaseIdMap = new Map<string, string>();

  try {
    const rawIngredients = await loadJsonData<FirestoreIngredient[]>(
      'ingredients.json'
    );
    const rawEquipment = await loadJsonData<FirestoreEquipment[]>(
      'equipment.json'
    );
    const rawRecipes = await loadJsonData<FirestoreRecipe[]>('recipes.json');
    const rawGuides = await loadJsonData<FirestoreGuidedRecipe[]>(
      'guides.json'
    );

    console.log('Uploading Ingredients...');
    for (const tempIngredient of rawIngredients) {
      const { id, ...ingredientData } = tempIngredient;

      // Check for existing ingredient by name
      const existingIngredientQuery = await db
        .collection(INGREDIENTS_COLLECTION)
        .where('name', '==', tempIngredient.name)
        .limit(1)
        .get();

      if (!existingIngredientQuery.empty) {
        const existingDoc = existingIngredientQuery.docs[0];
        ingredientTempToFirebaseIdMap.set(id, existingDoc.id);
        console.log(
          `Ingredient "${tempIngredient.name}" already exists with Firebase ID: ${existingDoc.id}. Skipping upload.`
        );
      } else {
        console.log(
          `Uploading Ingredient: ${tempIngredient.name} (TempID: ${id})`
        );
        const docRef = await db
          .collection(INGREDIENTS_COLLECTION)
          .add(ingredientData as Omit<FirestoreIngredient, 'id'>);
        ingredientTempToFirebaseIdMap.set(id, docRef.id);
        console.log(
          `Uploaded Ingredient: ${tempIngredient.name} (TempID: ${id}) -> Firebase ID: ${docRef.id}`
        );
      }
    }
    console.log('Ingredients upload complete.\n');

    console.log('Uploading Equipment...');
    for (const tempEquipment of rawEquipment) {
      const { id, ...equipmentData } = tempEquipment;

      // Check for existing equipment by name
      const existingEquipmentQuery = await db
        .collection(EQUIPMENT_COLLECTION)
        .where('name', '==', tempEquipment.name)
        .limit(1)
        .get();

      if (!existingEquipmentQuery.empty) {
        const existingDoc = existingEquipmentQuery.docs[0];
        equipmentTempToFirebaseIdMap.set(id, existingDoc.id);
        console.log(
          `Equipment "${tempEquipment.name}" already exists with Firebase ID: ${existingDoc.id}. Skipping upload.`
        );
      } else {
        const docRef = await db
          .collection(EQUIPMENT_COLLECTION)
          .add(equipmentData as Omit<FirestoreEquipment, 'id'>);
        equipmentTempToFirebaseIdMap.set(id, docRef.id);
        console.log(
          `Uploaded Equipment: ${tempEquipment.name} (TempID: ${id}) -> Firebase ID: ${docRef.id}`
        );
      }
    }
    console.log('Equipment upload complete.\n');

    console.log('Uploading Recipes...');
    for (const tempRecipe of rawRecipes) {
      const {
        id,
        ingredients: tempMeasuredIngredients,
        recommendedEquipment,
        ...recipeCoreData
      } = tempRecipe;

      // Check for existing recipe by name
      const existingRecipeQuery = await db
        .collection(RECIPES_COLLECTION)
        .where('name', '==', tempRecipe.name)
        .limit(1)
        .get();

      if (!existingRecipeQuery.empty) {
        const existingDoc = existingRecipeQuery.docs[0];
        recipeTempToFirebaseIdMap.set(id, existingDoc.id);
        console.log(
          `Recipe "${tempRecipe.name}" already exists with Firebase ID: ${existingDoc.id}. Skipping upload.`
        );
      }

      const resolvedMeasuredIngredients: FirestoreMeasuredIngredient[] =
        tempMeasuredIngredients.map((tempMI) => {
          let recommendationId: string | undefined = undefined;
          if (tempMI.recommendation) {
            recommendationId = ingredientTempToFirebaseIdMap.get(
              tempMI.recommendation
            );
            if (!recommendationId) {
              console.warn(
                `Recipe "${tempRecipe.name}": Could not find Firebase ID for ingredient recommendation tempId "${tempMI.recommendation}".`
              );
            }
          }
          return {
            ingredient: tempMI.ingredient,
            amount: tempMI.amount,
            unit: tempMI.unit,
            recommendation: recommendationId,
          };
        });

      let resolvedRecommendedEquipmentIds: string[] | undefined = undefined;
      if (recommendedEquipment && recommendedEquipment.length > 0) {
        resolvedRecommendedEquipmentIds = recommendedEquipment
          .map((tempEqId) => {
            const eqId = equipmentTempToFirebaseIdMap.get(tempEqId);
            if (!eqId) {
              console.warn(
                `Recipe "${tempRecipe.name}": Could not find Firebase ID for equipment recommendation tempId "${tempEqId}".`
              );
              return '';
            }
            return eqId;
          })
          .filter((id) => id !== '');
      }

      if (existingRecipeQuery.empty) {
        const recipeToUpload: Omit<FirestoreRecipe, 'id'> = {
          ...recipeCoreData,
          ingredients: resolvedMeasuredIngredients,
          equipment: tempRecipe.equipment || [],
          recommendedEquipment: resolvedRecommendedEquipmentIds,
        };

        const docRef = await db
          .collection(RECIPES_COLLECTION)
          .add(recipeToUpload);
        recipeTempToFirebaseIdMap.set(id, docRef.id);
        console.log(
          `Uploaded Recipe: ${tempRecipe.name} (TempID: ${id}) -> Firebase ID: ${docRef.id}`
        );
      }
    }
    console.log('Recipes upload complete.\n');

    console.log('Uploading Guided Recipes...');
    for (const tempGuide of rawGuides) {
      const { id, recipeId, ...guideCoreData } = tempGuide;

      const resolvedRecipeId = recipeTempToFirebaseIdMap.get(recipeId);
      if (!resolvedRecipeId) {
        console.error(
          `Guided Recipe "${
            tempGuide.name || id
          }": CRITICAL - Could not find Firebase ID for recipe tempId "${recipeId}". Skipping this guide.`
        );
        continue;
      }

      // Check for existing guided recipe by resolvedRecipeId and name
      const existingGuideQuery = await db
        .collection(GUIDES_COLLECTION)
        .where('recipeId', '==', resolvedRecipeId)
        .where('name', '==', tempGuide.name)
        .limit(1)
        .get();

      if (!existingGuideQuery.empty) {
        const existingDoc = existingGuideQuery.docs[0];
        console.log(
          `Guided Recipe "${
            tempGuide.name || id
          }" for recipe ID ${resolvedRecipeId} already exists with Firebase ID: ${
            existingDoc.id
          }. Skipping upload.`
        );
        continue;
      }

      const guideToUpload: Omit<FirestoreGuidedRecipe, 'id'> = {
        ...guideCoreData,
        recipeId: resolvedRecipeId,
      };

      const docRef = await db.collection(GUIDES_COLLECTION).add(guideToUpload);
      console.log(
        `Uploaded Guided Recipe: ${
          tempGuide.name || id
        } (TempID: ${id}) -> Firebase ID: ${docRef.id}`
      );
    }
    console.log('Guided Recipes upload complete.\n');

    console.log(
      'All data successfully uploaded and IDs resolved (or skipped if duplicate)!'
    );
  } catch (error) {
    console.error('An error occurred during the upload process:', error);
    process.exit(1);
  }
}

export function main() {
  console.log('Starting data upload script...');
  uploadAllData()
    .then(() => {
      console.log('Script finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Unhandled error in script execution:', error);
      process.exit(1);
    });
}

main();
