import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

// ─── Category enum ────────────────────────────────────────────────────────────

export enum ProductCategory {
  MATCHA = 'matcha',
  BUBBLE_TEA = 'bubble_tea',
  TEA = 'tea',
}

// ─── Nested schema ────────────────────────────────────────────────────────────

@Schema({ _id: false })
class CustomizationOptions {
  @Prop({ type: [String], required: true })
  flavours: string[];

  @Prop({ type: [String], required: true })
  syrups: string[];

  @Prop({ type: [String], required: true })
  sweetnessLevel: string[];

  @Prop({ type: [String], required: true })
  temperature: string[];

  // Always stored — only rendered in frontend when hasMilk is true
  @Prop({ type: [String], required: true })
  milkType: string[];
}

// ─── Product schema ───────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop({ required: true })
  price: number;

  @Prop()
  image?: string;

  @Prop({ type: CustomizationOptions, required: true })
  customizationOptions: CustomizationOptions;

  @Prop({ type: [String], default: [] })
  allergens: string[];

  // Controls whether the milk type selector appears on the customization page
  @Prop({ required: true, default: false })
  hasMilk: boolean;

  @Prop({ required: true, default: true })
  available: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
