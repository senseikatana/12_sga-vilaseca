export interface IProductService {
  list(query: { search?: string; category?: string; lowStock?: string }): Promise<any[]>
  getById(id: number): Promise<any>
  create(data: Record<string, unknown>): Promise<any>
  update(id: number, data: Record<string, unknown>): Promise<any>
  delete(id: number): Promise<void>
  scan(code: string, type: string, location?: string, scannedBy?: string, deviceId?: string): Promise<any>
  adjustStock(id: number, quantity: number, type: string, reason?: string, performedBy?: string): Promise<any>
  lowStock(): Promise<any[]>
}

export interface ICustomerService {
  list(): Promise<any[]>
  getById(id: number): Promise<any>
  create(data: Record<string, unknown>): Promise<any>
  update(id: number, data: Record<string, unknown>): Promise<any>
  delete(id: number): Promise<void>
}

export interface IOrderService {
  list(query: { status?: string; search?: string }): Promise<any[]>
  getById(id: number): Promise<any>
  create(data: Record<string, unknown>): Promise<any>
  update(id: number, data: Record<string, unknown>): Promise<any>
  delete(id: number): Promise<void>
}

export interface IPickingTaskService {
  list(query: { status?: string }): Promise<any[]>
  getById(id: number): Promise<any>
  create(data: Record<string, unknown>): Promise<any>
  update(id: number, data: Record<string, unknown>): Promise<any>
  delete(id: number): Promise<void>
}

export interface ILocationService {
  list(query: { zone?: string; search?: string; status?: string }): Promise<any[]>
  getById(id: number): Promise<any>
}

export interface IDashboardService {
  getStats(): Promise<{ totalProducts: number; openOrders: number; activeCustomers: number; stockAlerts: number }>
}
