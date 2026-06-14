import { db, initDatabase } from './index';
import { 
  products, 
  locations, 
  orders, 
  orderItems, 
  pickingTasks, 
  pickingTaskItems,
  customers,
  inventoryMovements
} from './schema';

export const seedDatabase = () => {
  console.log('🌱 Seeding database...');
  initDatabase();

  try {
    // Seed warehouse locations
    const locationData = [];
    const zones = ['A', 'B', 'C', 'D'];
    for (const zone of zones) {
      for (let rack = 1; rack <= 10; rack++) {
        for (let level = 1; level <= 5; level++) {
          locationData.push({
            code: `${zone}-${rack.toString().padStart(2, '0')}-${level.toString().padStart(2, '0')}`,
            zone,
            rack,
            level,
            capacity: 100,
            occupied: Math.floor(Math.random() * 80),
            type: zone === 'D' ? 'cold' : 'standard',
            status: 'active',
          });
        }
      }
    }
    db.insert(locations).values(locationData).run();
    console.log(`✅ Seeded ${locationData.length} warehouse locations`);

    // Seed customers
    const customerData = [
      { code: 'CUST001', name: 'Mercadona S.A.', type: 'customer', email: 'pedidos@mercadona.es', phone: '+34 900 123 456', address: 'Calle Valencia 100', city: 'Valencia', country: 'España', taxId: 'B46103834', status: 'active' },
      { code: 'CUST002', name: 'Carrefour España', type: 'customer', email: 'compras@carrefour.es', phone: '+34 900 234 567', address: 'Av. Diagonal 200', city: 'Barcelona', country: 'España', taxId: 'A28007748', status: 'active' },
      { code: 'CUST003', name: 'El Corte Inglés', type: 'customer', email: 'logistica@elcorteingles.es', phone: '+34 900 345 678', address: 'Calle Preciados 3', city: 'Madrid', country: 'España', taxId: 'A28017895', status: 'active' },
      { code: 'SUPP001', name: 'Distribuciones García SL', type: 'supplier', email: 'ventas@distgarcia.com', phone: '+34 963 123 456', address: 'Polígono Industrial Norte', city: 'Valencia', country: 'España', taxId: 'B98765432', status: 'active' },
      { code: 'SUPP002', name: 'Logística Martínez', type: 'supplier', email: 'info@logmartinez.es', phone: '+34 932 234 567', address: 'Zona Franca', city: 'Barcelona', country: 'España', taxId: 'B87654321', status: 'active' },
    ];
    db.insert(customers).values(customerData).run();
    console.log(`✅ Seeded ${customerData.length} customers`);

    // Seed products
    const productData = [
      { sku: 'SKU-001', name: 'Palet Europeo 120x80', description: 'Palet estándar europeo de madera', category: 'Palets', stock: 450, minStock: 100, maxStock: 1000, location: 'A-01-01', rfidTag: 'RFID-001', barcode: '8412345678901', price: 12.50, weight: 25.0, dimensions: '{"length": 120, "width": 80, "height": 14.5}' },
      { sku: 'SKU-002', name: 'Caja Cartón 60x40x40', description: 'Caja de cartón ondulado reforzado', category: 'Embalaje', stock: 2500, minStock: 500, maxStock: 5000, location: 'A-02-03', rfidTag: 'RFID-002', barcode: '8412345678902', price: 1.20, weight: 0.5, dimensions: '{"length": 60, "width": 40, "height": 40}' },
      { sku: 'SKU-003', name: 'Film Estirable 500mm', description: 'Rollo de film estirable transparente', category: 'Embalaje', stock: 180, minStock: 50, maxStock: 300, location: 'B-05-02', rfidTag: 'RFID-003', barcode: '8412345678903', price: 18.90, weight: 3.2, dimensions: '{"length": 50, "width": 50, "height": 15}' },
      { sku: 'SKU-004', name: 'Etiquetas Térmicas 100x150', description: 'Rollo de 1000 etiquetas térmicas', category: 'Etiquetado', stock: 95, minStock: 30, maxStock: 200, location: 'B-03-01', rfidTag: 'RFID-004', barcode: '8412345678904', price: 25.00, weight: 1.5, dimensions: '{"length": 15, "width": 15, "height": 10}' },
      { sku: 'SKU-005', name: 'Cinta Adhesiva 50mm', description: 'Rollo de cinta adhesiva marrón', category: 'Embalaje', stock: 8, minStock: 20, maxStock: 150, location: 'A-04-02', rfidTag: 'RFID-005', barcode: '8412345678905', price: 2.50, weight: 0.3, dimensions: '{"length": 10, "width": 10, "height": 5}' },
      { sku: 'SKU-006', name: 'Transpaleta Manual 2500kg', description: 'Transpaleta manual hidráulica', category: 'Equipamiento', stock: 12, minStock: 5, maxStock: 20, location: 'C-01-01', rfidTag: 'RFID-006', barcode: '8412345678906', price: 285.00, weight: 75.0, dimensions: '{"length": 115, "width": 55, "height": 80}' },
      { sku: 'SKU-007', name: 'Estantería Metálica 200x100', description: 'Estantería metálica industrial', category: 'Equipamiento', stock: 35, minStock: 10, maxStock: 50, location: 'C-02-01', rfidTag: 'RFID-007', barcode: '8412345678907', price: 450.00, weight: 120.0, dimensions: '{"length": 200, "width": 100, "height": 250}' },
      { sku: 'SKU-008', name: 'Contenedor Plástico 60L', description: 'Contenedor apilable con tapa', category: 'Almacenaje', stock: 320, minStock: 100, maxStock: 500, location: 'B-08-03', rfidTag: 'RFID-008', barcode: '8412345678908', price: 15.50, weight: 2.8, dimensions: '{"length": 60, "width": 40, "height": 35}' },
      { sku: 'SKU-009', name: 'Guantes Trabajo Talla L', description: 'Caja 100 pares guantes nitrilo', category: 'EPI', stock: 145, minStock: 50, maxStock: 300, location: 'A-06-04', rfidTag: 'RFID-009', barcode: '8412345678909', price: 28.00, weight: 1.2, dimensions: '{"length": 30, "width": 20, "height": 15}' },
      { sku: 'SKU-010', name: 'Chaleco Reflectante', description: 'Chaleco alta visibilidad amarillo', category: 'EPI', stock: 78, minStock: 30, maxStock: 150, location: 'A-06-05', rfidTag: 'RFID-010', barcode: '8412345678910', price: 5.50, weight: 0.2, dimensions: '{"length": 25, "width": 20, "height": 5}' },
      { sku: 'SKU-011', name: 'Scanner Código Barras', description: 'Lector láser USB', category: 'Tecnología', stock: 25, minStock: 10, maxStock: 40, location: 'C-05-02', rfidTag: 'RFID-011', barcode: '8412345678911', price: 85.00, weight: 0.4, dimensions: '{"length": 18, "width": 8, "height": 10}' },
      { sku: 'SKU-012', name: 'PDA Industrial Zebra', description: 'Terminal portátil con escáner', category: 'Tecnología', stock: 18, minStock: 8, maxStock: 25, location: 'C-05-03', rfidTag: 'RFID-012', barcode: '8412345678912', price: 1250.00, weight: 0.5, dimensions: '{"length": 20, "width": 8, "height": 4}' },
      { sku: 'SKU-013', name: 'Impresora Etiquetas Zebra', description: 'Impresora térmica industrial', category: 'Tecnología', stock: 8, minStock: 5, maxStock: 15, location: 'C-05-01', rfidTag: 'RFID-013', barcode: '8412345678913', price: 850.00, weight: 5.5, dimensions: '{"length": 45, "width": 35, "height": 25}' },
      { sku: 'SKU-014', name: 'Carretilla Elevadora 2T', description: 'Carretilla eléctrica 2000kg', category: 'Equipamiento', stock: 4, minStock: 2, maxStock: 8, location: 'C-01-01', rfidTag: 'RFID-014', barcode: '8412345678914', price: 18500.00, weight: 2500.0, dimensions: '{"length": 280, "width": 120, "height": 210}' },
      { sku: 'SKU-015', name: 'Caja Plástico Apilable 40L', description: 'Caja eurobox apilable', category: 'Almacenaje', stock: 580, minStock: 200, maxStock: 1000, location: 'B-08-04', rfidTag: 'RFID-015', barcode: '8412345678915', price: 12.00, weight: 1.8, dimensions: '{"length": 60, "width": 40, "height": 22}' },
      { sku: 'SKU-016', name: 'Papel Burbuja 100cm', description: 'Rollo papel burbuja 100m', category: 'Embalaje', stock: 65, minStock: 20, maxStock: 100, location: 'B-05-03', rfidTag: 'RFID-016', barcode: '8412345678916', price: 45.00, weight: 8.0, dimensions: '{"length": 100, "width": 15, "height": 15}' },
      { sku: 'SKU-017', name: 'Esquineros Cartón', description: 'Protectores esquina 50x50x3mm', category: 'Embalaje', stock: 1200, minStock: 300, maxStock: 2000, location: 'A-03-02', rfidTag: 'RFID-017', barcode: '8412345678917', price: 0.35, weight: 0.05, dimensions: '{"length": 100, "width": 5, "height": 5}' },
      { sku: 'SKU-018', name: 'Fleje Plástico 12mm', description: 'Bobina fleje PP 2000m', category: 'Embalaje', stock: 42, minStock: 15, maxStock: 60, location: 'B-04-02', rfidTag: 'RFID-018', barcode: '8412345678918', price: 32.00, weight: 12.0, dimensions: '{"length": 40, "width": 40, "height": 20}' },
      { sku: 'SKU-019', name: 'Grapadora Neumática', description: 'Grapadora para flejes', category: 'Herramientas', stock: 15, minStock: 5, maxStock: 20, location: 'C-03-02', rfidTag: 'RFID-019', barcode: '8412345678919', price: 125.00, weight: 2.5, dimensions: '{"length": 30, "width": 15, "height": 10}' },
      { sku: 'SKU-020', name: 'Báscula Industrial 500kg', description: 'Báscula plataforma digital', category: 'Equipamiento', stock: 6, minStock: 3, maxStock: 10, location: 'C-04-01', rfidTag: 'RFID-020', barcode: '8412345678920', price: 650.00, weight: 45.0, dimensions: '{"length": 80, "width": 60, "height": 10}' },
      { sku: 'SKU-021', name: 'Carro Plataforma 300kg', description: 'Carro transporte con plataforma', category: 'Equipamiento', stock: 22, minStock: 10, maxStock: 30, location: 'C-02-02', rfidTag: 'RFID-021', barcode: '8412345678921', price: 95.00, weight: 18.0, dimensions: '{"length": 90, "width": 60, "height": 85}' },
      { sku: 'SKU-022', name: 'Bolsas Plástico 50x70', description: 'Bolsas polietileno galga 200', category: 'Embalaje', stock: 4500, minStock: 1000, maxStock: 8000, location: 'A-05-03', rfidTag: 'RFID-022', barcode: '8412345678922', price: 0.08, weight: 0.02, dimensions: '{"length": 50, "width": 70, "height": 0.02}' },
      { sku: 'SKU-023', name: 'Separadores Cartón', description: 'Separadores para cajas', category: 'Embalaje', stock: 850, minStock: 200, maxStock: 1500, location: 'A-03-03', rfidTag: 'RFID-023', barcode: '8412345678923', price: 0.45, weight: 0.08, dimensions: '{"length": 40, "width": 30, "height": 0.3}' },
      { sku: 'SKU-024', name: 'Lector RFID Portátil', description: 'Lector RFID UHF portátil', category: 'Tecnología', stock: 12, minStock: 5, maxStock: 20, location: 'C-05-04', rfidTag: 'RFID-024', barcode: '8412345678924', price: 450.00, weight: 0.6, dimensions: '{"length": 22, "width": 9, "height": 5}' },
      { sku: 'SKU-025', name: 'Tags RFID Adhesivos', description: 'Etiquetas RFID UHF 100 uds', category: 'Tecnología', stock: 2800, minStock: 500, maxStock: 5000, location: 'B-03-02', rfidTag: 'RFID-025', barcode: '8412345678925', price: 0.75, weight: 0.01, dimensions: '{"length": 9, "width": 2, "height": 0.1}' },
    ];
    db.insert(products).values(productData).run();
    console.log(`✅ Seeded ${productData.length} products`);

    // Seed orders
    const orderData = [
      { orderNumber: 'PED-2026-001', customerId: 1, customerName: 'Mercadona S.A.', status: 'pending', priority: 'high', totalItems: 3, totalValue: 1850.50, shippingAddress: 'Centro Logístico Valencia', notes: 'Entrega urgente' },
      { orderNumber: 'PED-2026-002', customerId: 2, customerName: 'Carrefour España', status: 'picking', priority: 'normal', totalItems: 5, totalValue: 3250.00, shippingAddress: 'Plataforma Barcelona', notes: '' },
      { orderNumber: 'PED-2026-003', customerId: 3, customerName: 'El Corte Inglés', status: 'pending', priority: 'normal', totalItems: 2, totalValue: 890.00, shippingAddress: 'Almacén Madrid Norte', notes: '' },
      { orderNumber: 'PED-2026-004', customerId: 1, customerName: 'Mercadona S.A.', status: 'packing', priority: 'high', totalItems: 4, totalValue: 2100.00, shippingAddress: 'Centro Logístico Valencia', notes: 'Verificar cantidades' },
      { orderNumber: 'PED-2026-005', customerId: 2, customerName: 'Carrefour España', status: 'shipped', priority: 'normal', totalItems: 6, totalValue: 4500.00, shippingAddress: 'Plataforma Barcelona', notes: '', shippedAt: new Date(Date.now() - 86400000).toISOString() },
      { orderNumber: 'PED-2026-006', customerId: 3, customerName: 'El Corte Inglés', status: 'pending', priority: 'urgent', totalItems: 8, totalValue: 6750.00, shippingAddress: 'Almacén Madrid Norte', notes: 'Cliente VIP - Prioridad máxima' },
      { orderNumber: 'PED-2026-007', customerId: 1, customerName: 'Mercadona S.A.', status: 'delivered', priority: 'normal', totalItems: 3, totalValue: 1200.00, shippingAddress: 'Centro Logístico Valencia', notes: '', shippedAt: new Date(Date.now() - 172800000).toISOString(), deliveredAt: new Date(Date.now() - 86400000).toISOString() },
      { orderNumber: 'PED-2026-008', customerId: 2, customerName: 'Carrefour España', status: 'pending', priority: 'low', totalItems: 2, totalValue: 450.00, shippingAddress: 'Plataforma Barcelona', notes: '' },
      { orderNumber: 'PED-2026-009', customerId: 3, customerName: 'El Corte Inglés', status: 'picking', priority: 'normal', totalItems: 5, totalValue: 3800.00, shippingAddress: 'Almacén Madrid Norte', notes: '' },
      { orderNumber: 'PED-2026-010', customerId: 1, customerName: 'Mercadona S.A.', status: 'pending', priority: 'high', totalItems: 7, totalValue: 5200.00, shippingAddress: 'Centro Logístico Valencia', notes: 'Pedido recurrente mensual' },
    ];
    db.insert(orders).values(orderData).run();
    console.log(`✅ Seeded ${orderData.length} orders`);

    // Seed order items for first 3 orders
    const orderItemsData = [
      // Order 1
      { orderId: 1, productId: 1, sku: 'SKU-001', productName: 'Palet Europeo 120x80', quantity: 50, pickedQuantity: 0, price: 12.50, location: 'A-01-01', status: 'pending' },
      { orderId: 1, productId: 2, sku: 'SKU-002', productName: 'Caja Cartón 60x40x40', quantity: 200, pickedQuantity: 0, price: 1.20, location: 'A-02-03', status: 'pending' },
      { orderId: 1, productId: 3, sku: 'SKU-003', productName: 'Film Estirable 500mm', quantity: 30, pickedQuantity: 0, price: 18.90, location: 'B-05-02', status: 'pending' },
      // Order 2
      { orderId: 2, productId: 6, sku: 'SKU-006', productName: 'Transpaleta Manual 2500kg', quantity: 2, pickedQuantity: 1, price: 285.00, location: 'C-01-01', status: 'picking' },
      { orderId: 2, productId: 8, sku: 'SKU-008', productName: 'Contenedor Plástico 60L', quantity: 50, pickedQuantity: 25, price: 15.50, location: 'B-08-03', status: 'picking' },
      { orderId: 2, productId: 15, sku: 'SKU-015', productName: 'Caja Plástico Apilable 40L', quantity: 100, pickedQuantity: 0, price: 12.00, location: 'B-08-04', status: 'pending' },
      { orderId: 2, productId: 9, sku: 'SKU-009', productName: 'Guantes Trabajo Talla L', quantity: 20, pickedQuantity: 20, price: 28.00, location: 'A-06-04', status: 'picked' },
      { orderId: 2, productId: 10, sku: 'SKU-010', productName: 'Chaleco Reflectante', quantity: 30, pickedQuantity: 0, price: 5.50, location: 'A-06-05', status: 'pending' },
      // Order 3
      { orderId: 3, productId: 11, sku: 'SKU-011', productName: 'Scanner Código Barras', quantity: 5, pickedQuantity: 0, price: 85.00, location: 'C-05-02', status: 'pending' },
      { orderId: 3, productId: 13, sku: 'SKU-013', productName: 'Impresora Etiquetas Zebra', quantity: 2, pickedQuantity: 0, price: 850.00, location: 'C-05-01', status: 'pending' },
    ];
    db.insert(orderItems).values(orderItemsData).run();
    console.log(`✅ Seeded ${orderItemsData.length} order items`);

    // Seed picking tasks
    const pickingTasksData = [
      { taskNumber: 'PICK-001', orderId: 1, orderNumber: 'PED-2026-001', methodology: 'discrete', assignedTo: 'Juan García', zone: 'A', status: 'pending', priority: 'high', totalItems: 3, pickedItems: 0 },
      { taskNumber: 'PICK-002', orderId: 2, orderNumber: 'PED-2026-002', methodology: 'batch', assignedTo: 'María López', zone: 'B', status: 'in_progress', priority: 'normal', totalItems: 5, pickedItems: 2, startedAt: new Date(Date.now() - 3600000).toISOString() },
      { taskNumber: 'PICK-003', orderId: 3, orderNumber: 'PED-2026-003', methodology: 'zone', assignedTo: 'Carlos Ruiz', zone: 'C', status: 'pending', priority: 'normal', totalItems: 2, pickedItems: 0 },
      { taskNumber: 'PICK-004', orderId: 6, orderNumber: 'PED-2026-006', methodology: 'wave', assignedTo: 'Ana Martínez', zone: 'A', status: 'pending', priority: 'urgent', totalItems: 8, pickedItems: 0 },
      { taskNumber: 'PICK-005', orderId: 9, orderNumber: 'PED-2026-009', methodology: 'discrete', assignedTo: 'Pedro Sánchez', zone: 'B', status: 'in_progress', priority: 'normal', totalItems: 5, pickedItems: 3, startedAt: new Date(Date.now() - 1800000).toISOString() },
    ];
    db.insert(pickingTasks).values(pickingTasksData).run();
    console.log(`✅ Seeded ${pickingTasksData.length} picking tasks`);

    // Seed picking task items for first 2 tasks
    const pickingTaskItemsData = [
      // Task 1
      { taskId: 1, productId: 1, sku: 'SKU-001', productName: 'Palet Europeo 120x80', location: 'A-01-01', quantity: 50, pickedQuantity: 0, status: 'pending', sequence: 1 },
      { taskId: 1, productId: 2, sku: 'SKU-002', productName: 'Caja Cartón 60x40x40', location: 'A-02-03', quantity: 200, pickedQuantity: 0, status: 'pending', sequence: 2 },
      { taskId: 1, productId: 3, sku: 'SKU-003', productName: 'Film Estirable 500mm', location: 'B-05-02', quantity: 30, pickedQuantity: 0, status: 'pending', sequence: 3 },
      // Task 2
      { taskId: 2, productId: 6, sku: 'SKU-006', productName: 'Transpaleta Manual 2500kg', location: 'C-01-01', quantity: 2, pickedQuantity: 1, status: 'picked', sequence: 1, pickedAt: new Date(Date.now() - 3000000).toISOString() },
      { taskId: 2, productId: 8, sku: 'SKU-008', productName: 'Contenedor Plástico 60L', location: 'B-08-03', quantity: 50, pickedQuantity: 25, status: 'picked', sequence: 2, pickedAt: new Date(Date.now() - 2400000).toISOString() },
      { taskId: 2, productId: 15, sku: 'SKU-015', productName: 'Caja Plástico Apilable 40L', location: 'B-08-04', quantity: 100, pickedQuantity: 0, status: 'pending', sequence: 3 },
      { taskId: 2, productId: 9, sku: 'SKU-009', productName: 'Guantes Trabajo Talla L', location: 'A-06-04', quantity: 20, pickedQuantity: 20, status: 'verified', sequence: 4, pickedAt: new Date(Date.now() - 1800000).toISOString() },
      { taskId: 2, productId: 10, sku: 'SKU-010', productName: 'Chaleco Reflectante', location: 'A-06-05', quantity: 30, pickedQuantity: 0, status: 'pending', sequence: 5 },
    ];
    db.insert(pickingTaskItems).values(pickingTaskItemsData).run();
    console.log(`✅ Seeded ${pickingTaskItemsData.length} picking task items`);

    // Seed some inventory movements
    const movementsData = [
      { productId: 1, sku: 'SKU-001', type: 'inbound', quantity: 100, toLocation: 'A-01-01', reference: 'REC-001', reason: 'Recepción proveedor', performedBy: 'Sistema' },
      { productId: 2, sku: 'SKU-002', type: 'inbound', quantity: 500, toLocation: 'A-02-03', reference: 'REC-002', reason: 'Recepción proveedor', performedBy: 'Sistema' },
      { productId: 5, sku: 'SKU-005', type: 'outbound', quantity: 12, fromLocation: 'A-04-02', reference: 'PED-2026-007', reason: 'Pedido cliente', performedBy: 'Juan García' },
      { productId: 8, sku: 'SKU-008', type: 'adjustment', quantity: -5, fromLocation: 'B-08-03', reference: 'ADJ-001', reason: 'Ajuste inventario - rotura', performedBy: 'María López' },
      { productId: 15, sku: 'SKU-015', type: 'transfer', quantity: 50, fromLocation: 'B-08-04', toLocation: 'B-08-05', reference: 'TRF-001', reason: 'Reorganización almacén', performedBy: 'Carlos Ruiz' },
    ];
    db.insert(inventoryMovements).values(movementsData).run();
    console.log(`✅ Seeded ${movementsData.length} inventory movements`);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Execute if run directly
if (import.meta.url === import.meta.resolve(import.meta.url)) {
  seedDatabase();
}

// Made with Bob
