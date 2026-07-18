import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useInventoryStore, useOrdersStore, useCustomersStore, seedGenerators } from './stores';
import type { InventoryItem, Order, Customer, InventoryItemForm, OrderForm, CustomerForm } from './schemas';

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ============================================================
// Query keys
// ============================================================
export const queryKeys = {
  inventory: ['esinsa', 'inventory'] as const,
  orders: ['esinsa', 'orders'] as const,
  customers: ['esinsa', 'customers'] as const,
};

// ============================================================
// INVENTORY MUTATIONS
// ============================================================
export function useAddInventoryItem() {
  const qc = useQueryClient();
  const addItem = useInventoryStore((s) => s.addItem);
  return useMutation({
    mutationFn: async (data: InventoryItemForm) => {
      await delay(200);
      return addItem(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventory }),
  });
}

export function useUpdateInventoryItem() {
  const qc = useQueryClient();
  const updateItem = useInventoryStore((s) => s.updateItem);
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InventoryItem> }) => {
      await delay(200);
      updateItem(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventory }),
  });
}

export function useDeleteInventoryItem() {
  const qc = useQueryClient();
  const deleteItem = useInventoryStore((s) => s.deleteItem);
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(100);
      deleteItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventory }),
  });
}

// ============================================================
// ORDER MUTATIONS
// ============================================================
export function useAddOrder() {
  const qc = useQueryClient();
  const addItem = useOrdersStore((s) => s.addItem);
  return useMutation({
    mutationFn: async (data: OrderForm) => {
      await delay(200);
      return addItem(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  const updateItem = useOrdersStore((s) => s.updateItem);
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Order> }) => {
      await delay(200);
      updateItem(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders }),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  const deleteItem = useOrdersStore((s) => s.deleteItem);
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(100);
      deleteItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders }),
  });
}

// ============================================================
// CUSTOMER MUTATIONS
// ============================================================
export function useAddCustomer() {
  const qc = useQueryClient();
  const addItem = useCustomersStore((s) => s.addItem);
  return useMutation({
    mutationFn: async (data: CustomerForm) => {
      await delay(200);
      return addItem(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.customers }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  const updateItem = useCustomersStore((s) => s.updateItem);
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      await delay(200);
      updateItem(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.customers }),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  const deleteItem = useCustomersStore((s) => s.deleteItem);
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(100);
      deleteItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.customers }),
  });
}

// ============================================================
// AI GENERATION MUTATIONS
// ============================================================
const MOCK_COMPANIES = [
  'Acme Corp', 'Globex Inc', 'Initech', 'Hooli', 'Stark Industries',
  'Wayne Enterprises', 'Oscorp', 'Cyberdyne Systems', 'Umbrella Corp',
  'Wonka Industries', 'Duff Beer', 'Sterling Cooper',
];

const MOCK_NAMES = [
  'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez',
  'Pedro Sánchez', 'Laura Rodríguez', 'Miguel Ángel', 'Sofía Ruiz',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useAIGenerateOrders() {
  const qc = useQueryClient();
  const addItem = useOrdersStore((s) => s.addItem);
  return useMutation({
    mutationFn: async (count: number = 3) => {
      await delay(1500);
      const created: Order[] = [];
      for (let i = 0; i < count; i++) {
        const order = addItem({
          customer: randomItem(MOCK_COMPANIES),
          status: randomItem(['paid', 'pending', 'refunded'] as const),
          amount: Math.round(Math.random() * 900 + 50),
        });
        created.push(order);
      }
      return created;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders }),
  });
}

export function useAIGenerateCustomers() {
  const qc = useQueryClient();
  const addItem = useCustomersStore((s) => s.addItem);
  return useMutation({
    mutationFn: async (count: number = 3) => {
      await delay(1500);
      const created: Customer[] = [];
      for (let i = 0; i < count; i++) {
        const name = randomItem(MOCK_NAMES);
        const company = randomItem(MOCK_COMPANIES).toLowerCase().replace(/\s+/g, '');
        const customer = addItem({
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@${company}.com`,
          plan: randomItem(['Team', 'Starter', 'Enterprise'] as const),
          status: randomItem(['active', 'trial', 'past-due'] as const),
        });
        created.push(customer);
      }
      return created;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.customers }),
  });
}

export function useAIGenerateInventory() {
  const qc = useQueryClient();
  const addItem = useInventoryStore((s) => s.addItem);
  return useMutation({
    mutationFn: async (count: number = 3) => {
      await delay(1500);
      const types = ['Espárragos', 'Tuercas', 'Tornillos sin fin', 'Juntas', 'Cajas/Embalaje'] as const;
      const locs = ['A-01', 'A-02', 'B-01', 'B-02', 'C-01', 'D-01'];
      const descs = [
        'Tornillo M10x40', 'Tuerca M12', 'Junta DN80 PN16',
        'Espárrago M16x100', 'Caja embalaje estándar', 'Junta espiral DN50',
        'Tornillo allen M8', 'Tuerca autoblocante M10',
      ];
      const created: InventoryItem[] = [];
      for (let i = 0; i < count; i++) {
        const item = addItem({
          desc: randomItem(descs),
          type: randomItem(types),
          stock: Math.floor(Math.random() * 500 + 10),
          loc: randomItem(locs),
        });
        created.push(item);
      }
      return created;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventory }),
  });
}

// ============================================================
// Reset all data
// ============================================================
export function useResetAllData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(200);
      useInventoryStore.setState({ items: [] });
      useOrdersStore.setState({ items: [] });
      useCustomersStore.setState({ items: [] });
      seedGenerators();
    },
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}
