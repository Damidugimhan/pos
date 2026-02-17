import { create } from 'zustand';
import type { CartLine, MenuItem } from '../types/domain';

interface PosState {
  cart: CartLine[];
  orderNote: string;
  discountValue: number;
  discountType: 'fixed' | 'percentage';
  addItem: (menuItem: MenuItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
  setOrderNote: (value: string) => void;
  setDiscount: (type: 'fixed' | 'percentage', value: number) => void;
}

export const usePosStore = create<PosState>((set) => ({
  cart: [], orderNote: '', discountValue: 0, discountType: 'fixed',
  addItem: (menuItem) => set((state) => {
    const existing = state.cart.find((line) => line.menuItem.id === menuItem.id);
    if (existing) {
      return { cart: state.cart.map((line) => line.menuItem.id === menuItem.id ? { ...line, quantity: line.quantity + 1 } : line) };
    }
    return { cart: [...state.cart, { menuItem, quantity: 1 }] };
  }),
  updateQuantity: (itemId, quantity) => set((state) => ({
    cart: state.cart.map((line) => line.menuItem.id === itemId ? { ...line, quantity: Math.max(1, quantity) } : line)
  })),
  removeItem: (itemId) => set((state) => ({ cart: state.cart.filter((line) => line.menuItem.id !== itemId) })),
  clear: () => set({ cart: [], orderNote: '', discountValue: 0, discountType: 'fixed' }),
  setOrderNote: (value) => set({ orderNote: value }),
  setDiscount: (type, value) => set({ discountType: type, discountValue: Math.max(0, value) })
}));
