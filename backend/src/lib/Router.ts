type RouteHandler = (req: Request, params: Record<string, string>, body: unknown) => Response | Promise<Response>

interface RouteEntry {
  method: string
  pattern: RegExp
  paramNames: string[]
  handler: RouteHandler
}

export class Router {
  private routes: RouteEntry[] = []

  get(path: string, handler: RouteHandler): void {
    this.add('GET', path, handler)
  }

  post(path: string, handler: RouteHandler): void {
    this.add('POST', path, handler)
  }

  put(path: string, handler: RouteHandler): void {
    this.add('PUT', path, handler)
  }

  delete(path: string, handler: RouteHandler): void {
    this.add('DELETE', path, handler)
  }

  private add(method: string, path: string, handler: RouteHandler): void {
    const paramNames: string[] = []
    const regexStr = path.replace(/:(\w+)/g, (_, name: string) => {
      paramNames.push(name)
      return '([^/]+)'
    })
    this.routes.push({ method, pattern: new RegExp(`^${regexStr}$`), paramNames, handler })
  }

  async dispatch(req: Request): Promise<Response | null> {
    const url = new URL(req.url)
    for (const route of this.routes) {
      if (route.method !== req.method) continue
      const m = url.pathname.match(route.pattern)
      if (!m) continue
      const params: Record<string, string> = {}
      route.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]) })
      let body: unknown = undefined
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        try { body = await req.json() } catch { body = null }
      }
      return route.handler(req, params, body)
    }
    return null
  }
}
