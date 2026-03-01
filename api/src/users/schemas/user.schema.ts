import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// ─── Nested schemas ───────────────────────────────────────────────────────────

@Schema({ _id: false })
class BillingAddress {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zip: string;
}

@Schema({ _id: false })
class LoyaltyHistoryEntry {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reason: string;

  @Prop()
  orderId?: string;
}

@Schema({ _id: false })
class CookieConsents {
  @Prop({ required: true })
  marketing: boolean;

  @Prop({ required: true })
  functional: boolean;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  version: string;
}

// ─── User schema ──────────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  // Never returned in API responses — excluded via toJSON transform (see factory below)
  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  // Filled at first order — not required on registration
  @Prop({ type: BillingAddress })
  billingAddress?: BillingAddress;

  @Prop({ required: true, default: 0 })
  loyaltyPoints: number;

  @Prop({ type: [LoyaltyHistoryEntry], required: true, default: [] })
  loyaltyHistory: LoyaltyHistoryEntry[];

  @Prop({ required: true, default: false })
  newsletterSubscribed: boolean;

  // Set when user subscribes — GDPR requirement
  @Prop()
  newsletterConsentDate?: Date;

  @Prop({ type: CookieConsents, required: true })
  cookieConsents: CookieConsents;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Strip passwordHash from all serialized responses — GDPR / security rule
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});
