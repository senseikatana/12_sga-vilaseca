import { db } from '@/db'
import { pickingTasks, pickingTaskItems } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NotFoundError, ValidationError } from '@/domain/errors'
import type { IPickingTaskService } from '@/domain/interfaces'

export class PickingTaskService implements IPickingTaskService {
  async list(query: { status?: string }) {
    let q = db.select().from(pickingTasks).orderBy(desc(pickingTasks.createdAt)) as any
    if (query.status) q = q.where(eq(pickingTasks.status, query.status))
    return q.all()
  }

  async getById(id: number) {
    const task = db.select().from(pickingTasks).where(eq(pickingTasks.id, id)).get()
    if (!task) throw new NotFoundError('Tarea de picking no encontrada')
    const items = db.select().from(pickingTaskItems).where(eq(pickingTaskItems.taskId, id)).all()
    return { ...task, items }
  }

  async create(data: Record<string, unknown>) {
    if (!data.taskNumber || !data.orderNumber) throw new ValidationError('Nº de tarea y pedido son requeridos')
    const payload = { ...data }
    if (payload.method) { payload.methodology = payload.method; delete payload.method }
    if (payload.items !== undefined) { payload.totalItems = payload.items; delete payload.items }
    delete payload.customerName
    const result = db.insert(pickingTasks).values({ ...payload, createdAt: new Date().toISOString() } as any).run()
    return db.select().from(pickingTasks).where(eq(pickingTasks.id, result.lastInsertRowid as number)).get()
  }

  async update(id: number, data: Record<string, unknown>) {
    const existing = db.select().from(pickingTasks).where(eq(pickingTasks.id, id)).get()
    if (!existing) throw new NotFoundError('Tarea no encontrada')
    const payload = { ...data }
    if (payload.method) { payload.methodology = payload.method; delete payload.method }
    if (payload.items !== undefined) { payload.totalItems = payload.items; delete payload.items }
    delete payload.customerName
    if (payload.status === 'completed') (payload as any).completedAt = new Date().toISOString()
    if (payload.status === 'in_progress') (payload as any).startedAt = new Date().toISOString()
    db.update(pickingTasks).set(payload as any).where(eq(pickingTasks.id, id)).run()
    return db.select().from(pickingTasks).where(eq(pickingTasks.id, id)).get()
  }

  async delete(id: number) {
    const existing = db.select().from(pickingTasks).where(eq(pickingTasks.id, id)).get()
    if (!existing) throw new NotFoundError('Tarea no encontrada')
    db.delete(pickingTaskItems).where(eq(pickingTaskItems.taskId, id)).run()
    db.delete(pickingTasks).where(eq(pickingTasks.id, id)).run()
  }
}
