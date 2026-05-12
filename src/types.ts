export type OrderStatus = "Pending" | "Confirmed" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Unpaid";
export type JerseySize = "S" | "M" | "L" | "XL";

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  jerseyName: string;
  teamName: string;
  size: JerseySize;
  quantity: number;
  sellingPrice: number;
  buyingCost: number;
  deliveryCharge: number;
  otherExpense: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: "Facebook Ads" | "Courier Cost" | "Packaging" | "Miscellaneous";
  date: string;
  notes: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  team: string;
  season: string;
  size: JerseySize[];
  stockQuantity: number;
  buyingPrice: number;
  sellingPrice: number;
  image?: string;
  createdAt: string;
}

export interface User {
  email: string;
  id: string;
}
