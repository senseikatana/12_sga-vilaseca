import { db } from '@/db'
import { products, inventoryMovements, rfidScans } from '@/db/schema'
import { eq, like, or, desc } from 'drizzle-orm'
import { NotFoundError, ValidationError, ConflictError } from '@/domain/errors'
import type { IProductService } from '@/domain/interfaces'

const CATEGORY_PREFIX: Record<string, string> = {
  Alimentación: 'ALI', Bebidas: 'BEB', Limpieza: 'LIM',
  Electrónica: 'ELE', Hogar: 'HOG', Droguería: 'DRO',
  Palets: 'PAL', Embalaje: 'EMB', Etiquetado: 'ETI',
  Equipamiento: 'EQU', Almacenaje: 'ALM', EPI: 'EPI',
  Tecnología: 'TEC', Herramientas: 'HER',
}

function generateSku(category: string | undefined, existingSkus: string[]): string {
  const prefix = CATEGORY_PREFIX[category || ''] || (category ? category.substring(0, 3).toUpperCase() : 'PRD')
  const maxNum = existingSkus
    .filter(s => s.startsWith(prefix))
    .reduce((max, s) => { const n = parseInt(s.split('-')[1], 10); return isNaN(n) ? max : Math.max(max, n) }, 0)
  return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`
}

function generateEan13(): string {
  const country = '841'
  const machine = String(Math.floor(100000000 + Math.random() * 900000000))
  const digits = (country + machine).split('').map(Number)
  const sum = digits.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0)
  return country + machine + ((10 - (sum % 10)) % 10)
}

export class ProductService implements IProductService {
  async list(query: { search?: string; category?: string; lowStock?: string }) {
    let q = db.select().from(products).orderBy(desc(products.createdAt)) as any
    if (query.search) {
      q = q.where(or(like(products.sku, `%${query.search}%`), like(products.name, `%${query.search}%`), like(products.barcode, `%${query.search}%`)))
    }
    if (query.category) q = q.where(eq(products.category, query.category))
    let result = q.all() as any[]
    if (query.lowStock === 'true') result = result.filter(p => p.stock <= p.minStock)
    return result
  }

  async getById(id: number) {
    const item = db.select().from(products).where(eq(products.id, id)).get()
    if (!item) throw new NotFoundError('Producto no encontrado')
    return item
  }

  async create(data: Record<string, unknown>) {
    if (!data.name) throw new ValidationError('El nombre del producto es requerido')
    const allSkus = db.select({ sku: products.sku }).from(products).all().map(r => r.sku)
    const sku = (data.sku as string)?.trim() || generateSku(data.category as string | undefined, allSkus)
    const barcode = (data.barcode as string)?.trim() || generateEan13()
    try {
      const result = db.insert(products).values({ ...data, sku, barcode, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any).run()
      return db.select().from(products).where(eq(products.id, result.lastInsertRowid as number)).get()
    } catch (err: any) {
      if (err.message?.includes('UNIQUE constraint failed')) throw new ConflictError('El SKU ya existe')
      throw err
    }
  }

  async update(id: number, data: Record<string, unknown>) {
    const existing = db.select().from(products).where(eq(products.id, id)).get()
    if (!existing) throw new NotFoundError('Producto no encontrado')
    db.update(products).set({ ...data, updatedAt: new Date().toISOString() } as any).where(eq(products.id, id)).run()
    return db.select().from(products).where(eq(products.id, id)).get()
  }

  async delete(id: number) {
    const existing = db.select().from(products).where(eq(products.id, id)).get()
    if (!existing) throw new NotFoundError('Producto no encontrado')
    db.delete(products).where(eq(products.id, id)).run()
  }

  async scan(code: string, type: string, location?: string, scannedBy?: string, deviceId?: string) {
    if (!code) throw new ValidationError('Código requerido')
    let product: any
    if (type === 'rfid') {
      product = db.select().from(products).where(eq(products.rfidTag, code)).get()
    } else {
      product = db.select().from(products).where(or(eq(products.barcode, code), eq(products.sku, code))).get()
    }
    if (!product) throw new NotFoundError('Producto no encontrado')
    if (type === 'rfid') {
      db.insert(rfidScans).values({ rfidTag: code, productId: product.id, sku: product.sku, location: location || product.location || null, scanType: 'inventory', scannedBy: scannedBy || null, deviceId: deviceId || null, createdAt: new Date().toISOString() } as any).run()
    }
    return product
  }

  async adjustStock(id: number, quantity: number, type: string, reason?: string, performedBy?: string) {
    if (!id || !quantity || !type) throw new ValidationError('Cantidad y tipo son requeridos')
    const product = db.select().from(products).where(eq(products.id, id)).get()
    if (!product) throw new NotFoundError('Producto no encontrado')
    const newStock = type === 'increase' ? product.stock + quantity : product.stock - quantity
    if (newStock < 0) throw new ValidationError('Stock insuficiente')
    db.update(products).set({ stock: newStock, updatedAt: new Date().toISOString() } as any).where(eq(products.id, id)).run()
    db.insert(inventoryMovements).values({ productId: id, sku: product.sku, type: 'adjustment', quantity: type === 'increase' ? quantity : -quantity, fromLocation: product.location || null, toLocation: product.location || null, reason: reason || null, performedBy: performedBy || null, createdAt: new Date().toISOString() } as any).run()
    return db.select().from(products).where(eq(products.id, id)).get()
  }

  async lowStock() {
    const all = db.select().from(products).all() as any[]
    return all.filter(p => p.stock <= p.minStock)
  }
}
