import { Router } from './Router'
import { ApiResponse } from './Response'

export class Server {
  private router: Router
  private port: number

  constructor(router: Router, port = 3000) {
    this.router = router
    this.port = parseInt(process.env.PORT || String(port), 10)
  }

  start(): void {
    // Allow requests from GitHub Pages and local dev
    const allowedOrigins = [
      process.env.FRONTEND_URL || '',
      'http://localhost:4321',
      'http://localhost:3000',
    ].filter(Boolean)

    Bun.serve({
      port: this.port,
      fetch: async (req) => {
        const url = new URL(req.url)
        const start = performance.now()
        const origin = req.headers.get('origin') || ''

        const corsOrigin =
          allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*'

        const corsHeaders = {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Allow-Credentials': 'true',
          Vary: 'Origin',
        }

        if (req.method === 'OPTIONS') {
          return new Response(null, { status: 204, headers: corsHeaders })
        }

        try {
          const response = await this.router.dispatch(req)

          if (!response) {
            return ApiResponse.notFound(`Ruta no encontrada: ${req.method} ${url.pathname}`)
          }

          const augmented = new Response(response.body, {
            status: response.status,
            headers: { ...Object.fromEntries(response.headers), ...corsHeaders },
          })

          const ms = (performance.now() - start).toFixed(2)
          console.log(`${req.method} ${url.pathname} → ${response.status} (${ms}ms)`)

          return augmented
        } catch (err) {
          console.error(`ERROR ${req.method} ${url.pathname}:`, err)
          return ApiResponse.serverError(err)
        }
      },
    })

    console.log(`🚀 WarehouseFlow SGA API running on port ${this.port}`)
  }
}
