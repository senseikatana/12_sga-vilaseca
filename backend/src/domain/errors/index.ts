export class AppError extends Error {
  public readonly statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') { super(message, 404) }
}

export class ValidationError extends AppError {
  constructor(message = 'Datos inválidos') { super(message, 400) }
}

export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') { super(message, 409) }
}
