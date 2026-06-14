# SGA Vilaseca - Backend API

Backend transaccional para el Sistema de Gestión de Almacenes (WMS). 

Diseñado para alta concurrencia, baja latencia y preparado para integración con PDAs/escáneres de almacén.

## 🛠 Stack Tecnológico
- **Runtime**: [Bun](https://bun.sh/) (ultrarrápido, motor JS nativo)
- **Framework Web**: [Hono](https://hono.dev/)
- **Base de Datos**: SQLite nativo (`bun:sqlite`) configurado en modo WAL.
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar dependencias
bun install

# 2. Inicializar base de datos y poblar con datos de prueba (Seed)
bun run src/db/seed.ts

# 3. Iniciar el servidor (desarrollo)
bun run dev

# 4. Construir para producción
bun run build
bun start
```

## 📡 Documentación de la API (Para equipo de Frontend)

El servidor corre por defecto en `http://localhost:3000`. 
Todas las rutas de la aplicación están bajo el prefijo `/api`.

### General
- `GET /` : Información básica de la API.
- `GET /health` : Estado de salud del servidor (Status 200 OK).

### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción | Parámetros / Body |
|--------|----------|-------------|-------------------|
| `GET` | `/api/products` | Lista el inventario de productos. | Query params: `?search=...` (buscar por SKU, nombre, barcode) o `?category=...` |
| `GET` | `/api/products/low-stock` | Lista productos por debajo de su umbral de `min_stock`. | - |
| `GET` | `/api/products/:id` | Detalle de un producto específico. | `id` (integer) en la URL |
| `POST` | `/api/products` | Crea un nuevo producto. | Body JSON con los datos del producto (SKU, nombre, etc.) |
| `PUT` | `/api/products/:id` | Actualiza un producto existente. | Body JSON con los campos a actualizar |
| `DELETE`| `/api/products/:id` | Elimina un producto. | - |
| `POST` | `/api/products/scan` | Registra el escaneo de un producto. | Body JSON: `{ "rfidTag": "...", "barcode": "..." }` |
| `POST` | `/api/products/:id/adjust`| Ajusta el stock (movimiento manual). | Body JSON: `{ "quantity": 5, "reason": "...", "performedBy": "..." }` |

> **Nota para frontend:** Considerad el uso de implementaciones optimistas al llamar a `/adjust` y `/scan`, ya que los operarios del almacén necesitan una interfaz de respuesta instantánea.
