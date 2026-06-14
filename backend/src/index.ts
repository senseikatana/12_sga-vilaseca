import { initDatabase } from '@/db'
import { seedDatabase } from '@/db/seed'
import { Container } from '@/container'
import { ProductService } from '@/services/ProductService'
import { CustomerService } from '@/services/CustomerService'
import { OrderService } from '@/services/OrderService'
import { PickingTaskService } from '@/services/PickingTaskService'
import { LocationService } from '@/services/LocationService'
import { DashboardService } from '@/services/DashboardService'
import { AiService } from '@/services/AiService'
import { AppError } from '@/domain/errors'
import { Router } from '@/lib/Router'
import { Server } from '@/lib/Server'
import { ApiResponse } from '@/lib/Response'
import { db } from '@/db'
import { products } from '@/db/schema'

// Init DB tables
initDatabase()

// Auto-seed if database is empty (first deploy on Render)
const existing = db.select().from(products).limit(1).all()
if (existing.length === 0) {
  console.log('🌱 Empty database detected — running seed...')
  seedDatabase()
}

const container = new Container()
container.register('productService', new ProductService())
container.register('customerService', new CustomerService())
container.register('orderService', new OrderService())
container.register('pickingTaskService', new PickingTaskService())
container.register('locationService', new LocationService())
container.register('dashboardService', new DashboardService())
container.register('aiService', new AiService())

function wrap(fn: (...args: any[]) => Promise<Response>) {
  return async (...args: any[]): Promise<Response> => {
    try {
      return await fn(...args)
    } catch (err) {
      if (err instanceof AppError) return ApiResponse.error(err.message, err.statusCode)
      console.error(err)
      return ApiResponse.serverError(err)
    }
  }
}

function sid(params: Record<string, string>): number {
  const n = parseInt(params.id, 10)
  if (isNaN(n)) throw new Error('ID inválido')
  return n
}

const router = new Router()

router.get('/', () => ApiResponse.json({ message: 'WarehouseFlow SGA API', version: '1.0.0', status: 'running' }))
router.get('/api', () => ApiResponse.json({ message: 'WarehouseFlow SGA API', version: '1.0.0', status: 'running' }))
router.get('/api/health', () => ApiResponse.json({ status: 'ok', timestamp: new Date().toISOString() }))

router.get('/api/dashboard/stats', wrap(async () => ApiResponse.success(await container.dashboardService.getStats())))

router.get('/api/products', wrap(async (req) => {
  const url = new URL(req.url)
  const items = await container.productService.list(Object.fromEntries(url.searchParams))
  return ApiResponse.success({ items, count: items.length })
}))
router.get('/api/products/low-stock', wrap(async () => {
  const items = await container.productService.lowStock()
  return ApiResponse.success({ items, count: items.length })
}))
router.get('/api/products/:id', wrap(async (_, p) => ApiResponse.success(await container.productService.getById(sid(p)))))
router.post('/api/products', wrap(async (_, __, b) => ApiResponse.created(await container.productService.create(b as any))))
router.put('/api/products/:id', wrap(async (_, p, b) => ApiResponse.success(await container.productService.update(sid(p), b as any))))
router.delete('/api/products/:id', wrap(async (_, p) => { await container.productService.delete(sid(p)); return ApiResponse.json({ success: true, message: 'Producto eliminado' }) }))

router.get('/api/customers', wrap(async () => {
  const items = await container.customerService.list()
  return ApiResponse.success({ items, count: items.length })
}))
router.get('/api/customers/:id', wrap(async (_, p) => ApiResponse.success(await container.customerService.getById(sid(p)))))
router.post('/api/customers', wrap(async (_, __, b) => ApiResponse.created(await container.customerService.create(b as any))))
router.put('/api/customers/:id', wrap(async (_, p, b) => ApiResponse.success(await container.customerService.update(sid(p), b as any))))
router.delete('/api/customers/:id', wrap(async (_, p) => { await container.customerService.delete(sid(p)); return ApiResponse.json({ success: true, message: 'Cliente eliminado' }) }))

router.get('/api/orders', wrap(async (req) => {
  const url = new URL(req.url)
  const items = await container.orderService.list(Object.fromEntries(url.searchParams))
  return ApiResponse.success({ items, count: items.length })
}))
router.get('/api/orders/:id', wrap(async (_, p) => ApiResponse.success(await container.orderService.getById(sid(p)))))
router.post('/api/orders', wrap(async (_, __, b) => ApiResponse.created(await container.orderService.create(b as any))))
router.put('/api/orders/:id', wrap(async (_, p, b) => ApiResponse.success(await container.orderService.update(sid(p), b as any))))
router.delete('/api/orders/:id', wrap(async (_, p) => { await container.orderService.delete(sid(p)); return ApiResponse.json({ success: true, message: 'Pedido eliminado' }) }))

router.get('/api/picking-tasks', wrap(async (req) => {
  const url = new URL(req.url)
  const items = await container.pickingTaskService.list(Object.fromEntries(url.searchParams))
  return ApiResponse.success({ items, count: items.length })
}))
router.get('/api/picking-tasks/:id', wrap(async (_, p) => ApiResponse.success(await container.pickingTaskService.getById(sid(p)))))
router.post('/api/picking-tasks', wrap(async (_, __, b) => ApiResponse.created(await container.pickingTaskService.create(b as any))))
router.put('/api/picking-tasks/:id', wrap(async (_, p, b) => ApiResponse.success(await container.pickingTaskService.update(sid(p), b as any))))
router.delete('/api/picking-tasks/:id', wrap(async (_, p) => { await container.pickingTaskService.delete(sid(p)); return ApiResponse.json({ success: true, message: 'Tarea eliminada' }) }))

router.get('/api/locations', wrap(async (req) => {
  const url = new URL(req.url)
  const items = await container.locationService.list(Object.fromEntries(url.searchParams))
  return ApiResponse.success({ items, count: items.length })
}))
router.get('/api/locations/:id', wrap(async (_, p) => ApiResponse.success(await container.locationService.getById(sid(p)))))

// ── IA segura (server-side) ──────────────────────────────────────────────────
// El frontend solo envía { action, context? }.
// El backend construye el prompt — la API key nunca llega al cliente.
router.post('/api/ai', wrap(async (req, _, body) => {
  const b = body as { action?: string; context?: string } | null
  if (!b?.action) return ApiResponse.error('Campo "action" requerido', 400)
  // La IP la extrae el servidor del request, el cliente no puede falsificarla en este contexto
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
           ?? req.headers.get('cf-connecting-ip')
           ?? 'unknown'
  const result = await container.aiService.generate({
    action: b.action,
    context: b.context,
    ip,
  })
  return ApiResponse.success(result)
}))

new Server(router).start()
