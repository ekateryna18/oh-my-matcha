export interface BillingAddress {
  street: string;
  city: string;
  zip: string;
}

export interface LoyaltyHistoryEntry {
  date: string;
  amount: number;
  reason: string;
  orderId?: string;
}

export interface CookieConsents {
  marketing: boolean;
  functional: boolean;
  date: string;
  version: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  billingAddress?: BillingAddress;
  loyaltyPoints: number;
  loyaltyHistory: LoyaltyHistoryEntry[];
  newsletterSubscribed: boolean;
  newsletterConsentDate?: string;
  cookieConsents: CookieConsents;
  createdAt: string;
  updatedAt: string;
}
