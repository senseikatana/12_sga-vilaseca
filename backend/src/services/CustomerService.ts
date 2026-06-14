import { db } from '@/db'
import { customers } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NotFoundError, ValidationError, ConflictError } from '@/domain/errors'
import type { ICustomerService } from '@/domain/interfaces'

export class CustomerService implements ICustomerService {
  async list() {
    return db.select().from(customers).orderBy(desc(customers.createdAt)).all()
  }

  async getById(id: number) {
    const item = db.select().from(customers).where(eq(customers.id, id)).get()
    if (!item) throw new NotFoundError('Cliente no encontrado')
    return item
  }

  async create(data: Record<string, unknown>) {
    if (!data.code || !data.name) throw new ValidationError('Código y nombre son requeridos')
    try {
      const result = db.insert(customers).values({ ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any).run()
      return db.select().from(customers).where(eq(customers.id, result.lastInsertRowid as number)).get()
    } catch (err: any) {
      if (err.message?.includes('UNIQUE constraint failed')) throw new ConflictError('El código ya existe')
      throw err
    }
  }

  async update(id: number, data: Record<string, unknown>) {
    const existing = db.select().from(customers).where(eq(customers.id, id)).get()
    if (!existing) throw new NotFoundError('Cliente no encontrado')
    db.update(customers).set({ ...data, updatedAt: new Date().toISOString() } as any).where(eq(customers.id, id)).run()
    return db.select().from(customers).where(eq(customers.id, id)).get()
  }

  async delete(id: number) {
    const existing = db.select().from(customers).where(eq(customers.id, id)).get()
    if (!existing) throw new NotFoundError('Cliente no encontrado')
    db.delete(customers).where(eq(customers.id, id)).run()
  }
}
