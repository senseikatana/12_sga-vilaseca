# WarehouseFlow SGA

Sistema de Gestión de Almacén (WMS) enterprise construido con **Astro + React + Tailwind CSS**.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Astro](https://astro.build) v4 |
| UI (islas interactivas) | React 18 |
| Estilos | Tailwind CSS v3 |
| Iconos | Lucide React |
| IA integrada | Gemini API (opcional) |

## Estructura del proyecto

```
frontend/
├── src/
│   ├── components/    # Componentes React (islas interactivas)
│   │   ├── App.tsx               # Raíz de la SPA
│   │   ├── DesktopDashboardView.tsx
│   │   ├── CrudView.tsx
│   │   ├── VoicePickingView.tsx
│   │   ├── RoutesView.tsx
│   │   ├── WhatsAppAgentView.tsx
│   │   ├── SapIntegrationView.tsx
│   │   ├── MobileAppSimulator.tsx
│   │   ├── KpiCard.tsx
│   │   └── SidebarItem.tsx
│   ├── layouts/
│   │   └── BaseLayout.astro     # Shell HTML (meta, fuentes, favicon)
│   ├── pages/
│   │   └── index.astro          # Punto de entrada — monta App como isla React
│   └── styles/
│       └── global.css           # Tailwind base + utilities globales
├── public/                      # Activos estáticos (favicon, iconos)
├── astro.config.mjs
├── tailwind.config.ts
└── package.json
```

## Módulos del SGA

- **Panel General** — KPIs en tiempo real, gráfico de volumen diario, registro operativo
- **Inventario & Stock** — CRUD de productos con alertas de stock crítico
- **Entradas (Inbounds)** — Gestión de recepciones de proveedor
- **Salidas (Outbounds)** — Gestión de expediciones a cliente
- **Picking por Voz (IA)** — Simulador de picking guiado por voz
- **Rutas Internas** — Optimización de rutas con IA Gemini
- **Agente WhatsApp AI** — Respuestas automáticas a operarios/transportistas
- **SAP ERP Integration** — Log de sincronización con sistemas ERP
- **Equipo y Operarios** — Gestión de personal y turnos
- **Terminal PDA** — Vista simulada de handheld para operarios de almacén

## Desarrollo local

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321).

## IA con Gemini (opcional)

En la app, pulsa **"Conectar IA"** e introduce tu clave de [Google AI Studio](https://aistudio.google.com/). Sin clave, la app funciona en modo mock con datos de ejemplo.

## Build y despliegue

```bash
cd frontend
npm run build   # genera dist/
npm run preview # previsualiza el build
```

La salida estática en `dist/` se puede servir con cualquier CDN (Vercel, Netlify, Cloudflare Pages…).
# 12_sga-vilaseca
# 12_sga-vilaseca
# 12_sga-vilaseca
# 12_sga-vilaseca
