# Changelog

Registro de todos los cambios notables realizados en el backend del proyecto.

## [Unreleased] - 2026-05-30

### Added
- Documentación de la API en el `README.md` orientada al equipo de desarrollo Frontend (Opencode).
- Soporte nativo de `bun:sqlite` configurado con `PRAGMA journal_mode = WAL;` para maximizar el rendimiento de la concurrencia y transacciones en SQLite.
- Script funcional de Seeding (`src/db/seed.ts`) que ahora inicializa las tablas (DDL) de forma autónoma e inyecta un set sólido de datos de prueba:
  - 200 Ubicaciones jerárquicas de almacén.
  - 5 Clientes comerciales.
  - 25 Productos catalogados.
  - 10 Pedidos inicializados con sus respectivos ítems.
  - 5 Tareas de Picking para operarios.
  - 5 Movimientos iniciales de inventario (Entradas, salidas, ajustes).

### Changed
- Migración completa del ORM subyacente de `better-sqlite3` a `drizzle-orm/bun-sqlite`, solventando las incompatibilidades de dependencias binarias con el runtime nativo de Bun.
- Refactorización de la configuración del servidor web, conectando correctamente el enrutador anidado en `src/routes/index.ts` bajo el prefijo `/api` del servidor principal `Hono` en `src/index.ts`.
- Refactorización de controladores para inyectar correctamente la instancia de conexión `db` actualizada.

### Removed
- Eliminados todos los modelos antiguos dependientes de `mongoose` (MongoDB) de la carpeta `src/models/`.
- Eliminada configuración redundante o rota de conexiones `src/config/database.ts` a favor del indexado centralizado de la DB en `src/db/index.ts`.
