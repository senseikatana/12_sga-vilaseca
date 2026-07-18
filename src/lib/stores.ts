import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryItem, Order, Customer } from './schemas';
import { generateNUTCode, generateOrderNumber, generateCustomerCode, generateId, initCounters } from './generator';

// ============================================================
// INVENTORY STORE
// ============================================================
interface InventoryState {
  items: InventoryItem[];
  addItem: (data: { desc: string; type: InventoryItem['type']; stock: number; loc: string }) => InventoryItem;
  updateItem: (id: string, data: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getByNUT: (nutcode: string) => InventoryItem | undefined;
  deductStock: (nutcode: string, qty: number) => boolean;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (data) => {
        const item: InventoryItem = {
          id: generateId(),
          nutcode: generateNUTCode(),
          ...data,
        };
        set((s) => ({ items: [...s.items, item] }));
        return item;
      },
      updateItem: (id, data) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      getByNUT: (nutcode) => get().items.find((i) => i.nutcode === nutcode),
      deductStock: (nutcode, qty) => {
        const item = get().items.find((i) => i.nutcode === nutcode);
        if (!item || item.stock < qty) return false;
        set((s) => ({
          items: s.items.map((i) =>
            i.nutcode === nutcode ? { ...i, stock: i.stock - qty } : i
          ),
        }));
        return true;
      },
    }),
    { name: 'esinsa_inventory', version: 1 }
  )
);

// ============================================================
// ORDERS STORE
// ============================================================
interface OrdersState {
  items: Order[];
  addItem: (data: { customer: string; status: Order['status']; amount: number }) => Order;
  updateItem: (id: string, data: Partial<Order>) => void;
  deleteItem: (id: string) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (data) => {
        const item: Order = {
          id: generateId(),
          number: generateOrderNumber(),
          ...data,
        };
        set((s) => ({ items: [...s.items, item] }));
        return item;
      },
      updateItem: (id, data) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: 'esinsa_orders', version: 1 }
  )
);

// ============================================================
// CUSTOMERS STORE
// ============================================================
interface CustomersState {
  items: Customer[];
  addItem: (data: { name: string; email: string; plan: Customer['plan']; status: Customer['status'] }) => Customer;
  updateItem: (id: string, data: Partial<Customer>) => void;
  deleteItem: (id: string) => void;
}

export const useCustomersStore = create<CustomersState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (data) => {
        const item: Customer = {
          id: generateId(),
          code: generateCustomerCode(),
          ...data,
        };
        set((s) => ({ items: [...s.items, item] }));
        return item;
      },
      updateItem: (id, data) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: 'esinsa_customers', version: 1 }
  )
);

// ============================================================
// Initialize counters from persisted data
// ============================================================
export function seedGenerators(): void {
  const inv = useInventoryStore.getState().items;
  const ord = useOrdersStore.getState().items;
  const cus = useCustomersStore.getState().items;
  initCounters(inv, ord, cus);
}

// Seed on module load in browser context
if (typeof window !== 'undefined') {
  seedGenerators();
}
