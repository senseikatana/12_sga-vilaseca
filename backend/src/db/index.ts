import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

// Create SQLite database
const sqlite = new Database('warehouse.db');

// Enable WAL mode for better concurrency
sqlite.exec('PRAGMA journal_mode = WAL;');

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Initialize database tables
export const initDatabase = () => {
  console.log('🗄️  Initializing database...');
  
  // Create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      min_stock INTEGER NOT NULL DEFAULT 10,
      max_stock INTEGER NOT NULL DEFAULT 1000,
      location TEXT,
      rfid_tag TEXT,
      barcode TEXT,
      price REAL NOT NULL DEFAULT 0,
      weight REAL,
      dimensions TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      zone TEXT NOT NULL,
      rack INTEGER NOT NULL,
      level INTEGER NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 100,
      occupied INTEGER NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'standard',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      customer_id INTEGER,
      customer_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'normal',
      total_items INTEGER NOT NULL DEFAULT 0,
      total_value REAL NOT NULL DEFAULT 0,
      shipping_address TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      shipped_at TEXT,
      delivered_at TEXT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      sku TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      picked_quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL,
      location TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS picking_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_number TEXT NOT NULL UNIQUE,
      order_id INTEGER NOT NULL,
      order_number TEXT NOT NULL,
      methodology TEXT NOT NULL DEFAULT 'discrete',
      assigned_to TEXT,
      zone TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'normal',
      total_items INTEGER NOT NULL DEFAULT 0,
      picked_items INTEGER NOT NULL DEFAULT 0,
      started_at TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );

    CREATE TABLE IF NOT EXISTS picking_task_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      sku TEXT NOT NULL,
      product_name TEXT NOT NULL,
      location TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      picked_quantity INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      picked_at TEXT,
      sequence INTEGER,
      FOREIGN KEY (task_id) REFERENCES picking_tasks(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS inventory_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      sku TEXT NOT NULL,
      type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      from_location TEXT,
      to_location TEXT,
      reference TEXT,
      reason TEXT,
      performed_by TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS rfid_scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rfid_tag TEXT NOT NULL,
      product_id INTEGER,
      sku TEXT,
      location TEXT,
      scan_type TEXT NOT NULL,
      scanned_by TEXT,
      device_id TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'customer',
      email TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      country TEXT,
      tax_id TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
    CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
    CREATE INDEX IF NOT EXISTS idx_products_rfid ON products(rfid_tag);
    CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_picking_tasks_status ON picking_tasks(status);
    CREATE INDEX IF NOT EXISTS idx_rfid_scans_tag ON rfid_scans(rfid_tag);
  `);

  console.log('✅ Database initialized successfully');
};

// Close database connection
export const closeDatabase = () => {
  sqlite.close();
  console.log('🔒 Database connection closed');
};
