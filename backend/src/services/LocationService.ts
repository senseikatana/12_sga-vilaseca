import { db } from '@/db'
import { locations } from '@/db/schema'
import { eq, like, or, desc } from 'drizzle-orm'
import { NotFoundError } from '@/domain/errors'
import type { ILocationService } from '@/domain/interfaces'

export class LocationService implements ILocationService {
  async list(query: { zone?: string; search?: string; status?: string }) {
    let q = db.select().from(locations).orderBy(desc(locations.createdAt)) as any
    if (query.zone) q = q.where(eq(locations.zone, query.zone))
    if (query.status) q = q.where(eq(locations.status, query.status))
    if (query.search) q = q.where(or(like(locations.code, `%${query.search}%`), like(locations.zone, `%${query.search}%`)))
    return q.all()
  }

  async getById(id: number) {
    const item = db.select().from(locations).where(eq(locations.id, id)).get()
    if (!item) throw new NotFoundError('Ubicación no encontrada')
    return item
  }
}
