import type {
  IProductService, ICustomerService, IOrderService,
  IPickingTaskService, ILocationService, IDashboardService,
} from '@/domain/interfaces'

export class Container {
  private instances = new Map<string, unknown>()

  register<T>(key: string, instance: T): void {
    this.instances.set(key, instance)
  }

  resolve<T>(key: string): T {
    const instance = this.instances.get(key)
    if (!instance) throw new Error(`Service not registered: ${key}`)
    return instance as T
  }

  get productService(): IProductService { return this.resolve<IProductService>('productService') }
  get customerService(): ICustomerService { return this.resolve<ICustomerService>('customerService') }
  get orderService(): IOrderService { return this.resolve<IOrderService>('orderService') }
  get pickingTaskService(): IPickingTaskService { return this.resolve<IPickingTaskService>('pickingTaskService') }
  get locationService(): ILocationService { return this.resolve<ILocationService>('locationService') }
  get dashboardService(): IDashboardService { return this.resolve<IDashboardService>('dashboardService') }
}
