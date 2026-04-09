export interface CartItemCustomization {
  flavour?: string;
  syrup?: string;
  sweetnessLevel?: string;
  temperature?: string;
  milkType?: string;
}

export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  customization: CartItemCustomization;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

export interface Slot {
  _id: string;
  time: string;
  date: string;
  maxOrders: number;
  currentOrders: number;
}
