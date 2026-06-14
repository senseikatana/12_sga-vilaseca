import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Products table
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  stock: integer('stock').notNull().default(0),
  minStock: integer('min_stock').notNull().default(10),
  maxStock: integer('max_stock').notNull().default(1000),
  location: text('location'), // e.g., "A-03-02" (Zone-Rack-Level)
  rfidTag: text('rfid_tag'),
  barcode: text('barcode'),
  price: real('price').notNull().default(0),
  weight: real('weight'), // in kg
  dimensions: text('dimensions'), // JSON string: {length, width, height}
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Warehouse locations table
export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(), // e.g., "A-03-02"
  zone: text('zone').notNull(), // A, B, C, D
  rack: integer('rack').notNull(),
  level: integer('level').notNull(),
  capacity: integer('capacity').notNull().default(100),
  occupied: integer('occupied').notNull().default(0),
  type: text('type').notNull().default('standard'), // standard, cold, hazmat
  status: text('status').notNull().default('active'), // active, maintenance, blocked
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderNumber: text('order_number').notNull().unique(),
  customerId: integer('customer_id'),
  customerName: text('customer_name').notNull(),
  status: text('status').notNull().default('pending'), // pending, picking, packing, shipped, delivered, cancelled
  priority: text('priority').notNull().default('normal'), // low, normal, high, urgent
  totalItems: integer('total_items').notNull().default(0),
  totalValue: real('total_value').notNull().default(0),
  shippingAddress: text('shipping_address'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  shippedAt: text('shipped_at'),
  deliveredAt: text('delivered_at'),
});

// Order items table
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  sku: text('sku').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  pickedQuantity: integer('picked_quantity').notNull().default(0),
  price: real('price').notNull(),
  location: text('location'),
  status: text('status').notNull().default('pending'), // pending, picking, picked, packed
});

// Picking tasks table
export const pickingTasks = sqliteTable('picking_tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  taskNumber: text('task_number').notNull().unique(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  orderNumber: text('order_number').notNull(),
  methodology: text('methodology').notNull().default('discrete'), // discrete, batch, zone, wave
  assignedTo: text('assigned_to'), // operator name/id
  zone: text('zone'), // for zone picking
  status: text('status').notNull().default('pending'), // pending, in_progress, completed, cancelled
  priority: text('priority').notNull().default('normal'),
  totalItems: integer('total_items').notNull().default(0),
  pickedItems: integer('picked_items').notNull().default(0),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Picking task items table
export const pickingTaskItems = sqliteTable('picking_task_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  taskId: integer('task_id').notNull().references(() => pickingTasks.id),
  productId: integer('product_id').notNull().references(() => products.id),
  sku: text('sku').notNull(),
  productName: text('product_name').notNull(),
  location: text('location').notNull(),
  quantity: integer('quantity').notNull(),
  pickedQuantity: integer('picked_quantity').notNull().default(0),
  status: text('status').notNull().default('pending'), // pending, picked, verified
  pickedAt: text('picked_at'),
  sequence: integer('sequence'), // picking order
});

// Inventory movements table
export const inventoryMovements = sqliteTable('inventory_movements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id),
  sku: text('sku').notNull(),
  type: text('type').notNull(), // inbound, outbound, adjustment, transfer
  quantity: integer('quantity').notNull(),
  fromLocation: text('from_location'),
  toLocation: text('to_location'),
  reference: text('reference'), // order number, transfer number, etc.
  reason: text('reason'),
  performedBy: text('performed_by'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// RFID scans table
export const rfidScans = sqliteTable('rfid_scans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rfidTag: text('rfid_tag').notNull(),
  productId: integer('product_id').references(() => products.id),
  sku: text('sku'),
  location: text('location'),
  scanType: text('scan_type').notNull(), // inventory, picking, receiving, shipping
  scannedBy: text('scanned_by'),
  deviceId: text('device_id'), // PDA/scanner device ID
  metadata: text('metadata'), // JSON string for additional data
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Customers table
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  type: text('type').notNull().default('customer'), // customer, supplier, both
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  country: text('country'),
  taxId: text('tax_id'),
  status: text('status').notNull().default('active'), // active, inactive
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Export types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type PickingTask = typeof pickingTasks.$inferSelect;
export type NewPickingTask = typeof pickingTasks.$inferInsert;
export type PickingTaskItem = typeof pickingTaskItems.$inferSelect;
export type NewPickingTaskItem = typeof pickingTaskItems.$inferInsert;
export type InventoryMovement = typeof inventoryMovements.$inferSelect;
export type NewInventoryMovement = typeof inventoryMovements.$inferInsert;
export type RfidScan = typeof rfidScans.$inferSelect;
export type NewRfidScan = typeof rfidScans.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

// Made with Bob
