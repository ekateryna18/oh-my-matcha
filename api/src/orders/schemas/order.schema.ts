import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  READY = 'ready',
  COMPLETED = 'completed',
}

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Object, default: {} })
  customization: Record<string, string>;
}

@Schema({ _id: false })
class OrderBillingAddress {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zip: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, default: 0 })
  creditApplied: number;

  @Prop({ required: true })
  finalAmount: number;

  @Prop({ required: true })
  pickupSlot: string;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: OrderBillingAddress, required: true })
  billingAddress: OrderBillingAddress;

  @Prop({ required: true })
  loyaltyPointsEarned: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
