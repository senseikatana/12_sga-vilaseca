import { db } from '@/db'
import { products, orders, customers } from '@/db/schema'
import type { IDashboardService } from '@/domain/interfaces'

export class DashboardService implements IDashboardService {
  async getStats() {
    const allProducts = db.select().from(products).all() as any[]
    const allOrders = db.select().from(orders).all() as any[]
    const allCustomers = db.select().from(customers).all() as any[]
    return {
      totalProducts: allProducts.length,
      openOrders: allOrders.filter((o: any) => ['pending', 'picking', 'packing'].includes(o.status)).length,
      activeCustomers: allCustomers.filter((c: any) => c.type === 'customer').length,
      stockAlerts: allProducts.filter((p: any) => p.stock <= p.minStock).length,
    }
  }
}
