import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  batchProductId: string;
  productId: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  facilitationPercent: number;
  quantity: number;
  farmerName?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeItem: (batchProductId: string) => void;
  updateQuantity: (batchProductId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity) => {
        const { items } = get();
        const existingItem = items.find((i) => i.batchProductId === item.batchProductId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.batchProductId === item.batchProductId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },

      removeItem: (batchProductId) => {
        set({
          items: get().items.filter((i) => i.batchProductId !== batchProductId),
        });
      },

      updateQuantity: (batchProductId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(batchProductId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.batchProductId === batchProductId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => {
          const priceWithFee = item.pricePerUnit * (1 + item.facilitationPercent / 100);
          return sum + priceWithFee * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
