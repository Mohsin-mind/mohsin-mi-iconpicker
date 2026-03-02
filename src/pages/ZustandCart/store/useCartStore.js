import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * useCartStore — Zustand store for the shopping cart with persistence.
 *
 * The `persist` middleware automatically saves the store to localStorage under
 * the key "cart-storage" and rehydrates it on page load.
 *
 * State:
 *   items  — array of cart items { id, name, price, emoji, qty }
 *
 * Actions:
 *   addItem(product)       — add product or increment qty if already present
 *   removeItem(id)         — remove item by id
 *   updateQty(id, qty)     — set exact qty for an item
 *   clearCart()            — empty the cart
 */
const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...product, qty: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Optionally persist only the `items` slice (exclude actions):
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export default useCartStore;
