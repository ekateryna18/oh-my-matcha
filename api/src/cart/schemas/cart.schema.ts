import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

// ─── Nested schemas ───────────────────────────────────────────────────────────

@Schema({ _id: false })
class Customization {
  @Prop()
  flavour?: string;

  @Prop()
  syrup?: string;

  @Prop()
  sweetnessLevel?: string;

  @Prop()
  temperature?: string;

  @Prop()
  milkType?: string;
}

@Schema({ _id: true })
class CartItem {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  // Price snapshot at time of adding — unaffected by future price changes
  @Prop({ required: true })
  unitPrice: number;

  @Prop({ type: Customization, default: {} })
  customization: Customization;
}

// ─── Cart schema ──────────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
