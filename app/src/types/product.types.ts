export type ProductCategory = 'matcha' | 'bubble_tea' | 'tea' | 'mochi';

export interface ProductCustomizationOptions {
  flavours: string[];
  syrups: string[];
  sweetnessLevel: string[];
  temperature: string[];
  milkType: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  image?: string;
  customizationOptions: ProductCustomizationOptions;
  allergens: string[];
  hasMilk: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}
