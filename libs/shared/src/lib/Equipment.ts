export interface EquipmentType {
  id: string;
  name: string;
  description: string;
}

export interface Equipment {
  id: string;
  equipmentTypeId: string; // foreign key to EquipmentType
  name: string; // product name of the equipment ("KitchenAid Stand Mixer" vs "stand mixer")
  brand?: string; // (e.g. "KitchenAid")
  preferredVendor?: string; // (e.g. "Amazon")
  vendorProductId?: string; // (e.g. "123456789")
}
