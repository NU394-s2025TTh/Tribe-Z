export interface Item {
  name: string;
  description: string;
  category?: string;
}

export interface RecommendedItem<T extends Item> {
  id: string;
  type: T;
  name: string;
  price?: string;
  brand?: string,
  preferredVendor?: string,
  vendorProductId?: string,
  link?: string;
  productImage?: string;
}
