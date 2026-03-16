import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SlotDocument = HydratedDocument<Slot>;

@Schema({ timestamps: false })
export class Slot {
  @Prop({ required: true })
  time: string; // e.g. "13:00"

  @Prop({ required: true })
  date: string; // YYYY-MM-DD — today only

  @Prop({ required: true, default: 5 })
  maxOrders: number;

  @Prop({ required: true, default: 0 })
  currentOrders: number;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
SlotSchema.index({ time: 1, date: 1 }, { unique: true });
