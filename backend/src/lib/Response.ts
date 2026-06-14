export class ApiResponse {
  static json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  static success(data: unknown, status = 200): Response {
    return ApiResponse.json({ success: true, data }, status)
  }

  static created(data: unknown): Response {
    return ApiResponse.success(data, 201)
  }

  static error(message: string, status = 400): Response {
    return ApiResponse.json({ success: false, error: message }, status)
  }

  static notFound(message = 'Recurso no encontrado'): Response {
    return ApiResponse.error(message, 404)
  }

  static conflict(message = 'El recurso ya existe'): Response {
    return ApiResponse.error(message, 409)
  }

  static serverError(error?: unknown): Response {
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    return ApiResponse.error(message, 500)
  }
}
