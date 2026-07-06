export interface Product {
  id: string;
  entryNumber: string; // e.g., "Entry #042"
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  limited: boolean;
  soldOut: boolean;
  tag: 'NEW DROP' | 'LIMITED' | 'ARCHIVE' | 'SOLD OUT';
  description: string;
  details: string[]; // fabric weight, materials, fit specifications
  volumetricSizing: {
    size: string;
    shoulder: string;
    chest: string;
    length: string;
  }[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface OrderDetails {
  email: string;
  cart: CartItem[];
  subtotal: number;
}
