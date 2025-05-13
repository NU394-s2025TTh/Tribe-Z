// all ids provided by firebase

import { Item, RecommendedItem } from './Items.js';

export enum EquipmentCategory {
  APPLIANCE = 'appliance',
  CUTLERY = 'cutlery',
}

export interface EquipmentType extends Item {
  category?: EquipmentCategory;
}

export type Equipment = RecommendedItem<EquipmentType>;
