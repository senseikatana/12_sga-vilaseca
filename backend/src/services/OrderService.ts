import { db } from '@/db'
import { orders, orderItems } from '@/db/schema'
import { eq, like, desc } from 'drizzle-orm'
import { NotFoundError, ValidationError } from '@/domain/errors'
import type { IOrderService } from '@/domain/interfaces'

export class OrderService implements IOrderService {
  async list(query: { status?: string; search?: string }) {
    let q = db.select().from(orders).orderBy(desc(orders.createdAt)) as any
    if (query.status) q = q.where(eq(orders.status, query.status))
    if (query.search) q = q.where(like(orders.orderNumber, `%${query.search}%`))
    return q.all()
  }

  async getById(id: number) {
    const order = db.select().from(orders).where(eq(orders.id, id)).get()
    if (!order) throw new NotFoundError('Pedido no encontrado')
    const items = db.select().from(orderItems).where(eq(orderItems.orderId, id)).all()
    return { ...order, items }
  }

  async create(data: Record<string, unknown>) {
    if (!data.orderNumber || !data.customerName) throw new ValidationError('Nº de pedido y cliente son requeridos')
    const payload = { ...data }
    if (payload.type) { payload.priority = String(payload.type) === 'express' ? 'high' : 'normal'; delete payload.type }
    if (payload.total !== undefined) { payload.totalValue = payload.total; delete payload.total }
    if (payload.items !== undefined) { payload.totalItems = payload.items; delete payload.items }
    const result = db.insert(orders).values({ ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any).run()
    return db.select().from(orders).where(eq(orders.id, result.lastInsertRowid as number)).get()
  }

  async update(id: number, data: Record<string, unknown>) {
    const existing = db.select().from(orders).where(eq(orders.id, id)).get()
    if (!existing) throw new NotFoundError('Pedido no encontrado')
    const payload = { ...data }
    if (payload.type) { payload.priority = String(payload.type) === 'express' ? 'high' : 'normal'; delete payload.type }
    if (payload.total !== undefined) { payload.totalValue = payload.total; delete payload.total }
    if (payload.items !== undefined) { payload.totalItems = payload.items; delete payload.items }
    db.update(orders).set({ ...payload, updatedAt: new Date().toISOString() } as any).where(eq(orders.id, id)).run()
    return db.select().from(orders).where(eq(orders.id, id)).get()
  }

  async delete(id: number) {
    const existing = db.select().from(orders).where(eq(orders.id, id)).get()
    if (!existing) throw new NotFoundError('Pedido no encontrado')
    db.delete(orderItems).where(eq(orderItems.orderId, id)).run()
    db.delete(orders).where(eq(orders.id, id)).run()
  }
}
