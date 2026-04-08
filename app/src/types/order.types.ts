export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization: Record<string, string>;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  creditApplied: number;
  finalAmount: number;
  pickupSlot: string;
  status: OrderStatus;
  loyaltyPointsEarned: number;
  createdAt: string;
  updatedAt: string;
}
