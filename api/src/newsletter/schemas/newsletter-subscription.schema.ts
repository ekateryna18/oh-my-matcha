import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NewsletterSubscriptionDocument = HydratedDocument<NewsletterSubscription>;

@Schema({ timestamps: true })
export class NewsletterSubscription {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  // Null when subscriber is not a registered user
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  // GDPR — consent timestamp
  @Prop({ required: true })
  consentDate: Date;

  // True once the +5 pts newsletter bonus has been credited (registered users only, once ever)
  @Prop({ required: true, default: false })
  bonusPointsCredited: boolean;

  @Prop({ required: true, default: true })
  active: boolean;

  // Set on unsubscribe — GDPR audit trail
  @Prop()
  unsubscribeDate?: Date;
}

export const NewsletterSubscriptionSchema = SchemaFactory.createForClass(NewsletterSubscription);
