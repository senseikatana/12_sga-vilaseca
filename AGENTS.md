# AGENTS.md — ESINSA WMS (SGA)

## Stack
- Astro 7.1.1 (SSR, `output: 'server'`, Node standalone adapter)
- React 18 + Tailwind 3.4 (dark mode via `class`)
- TypeScript strict mode, path alias `@/*` → `./src/*`
- Bun as package manager (lockfile: `bun.lock`)

## Commands
```bash
bun install                  # install deps
bun run dev                  # dev server (astro dev)
bun run build                # production build → dist/
bun run preview              # preview production build
bun run bot                  # WhatsApp bot (separate process)
```

No test, lint, or format scripts configured.

## Design System

**Siempre** seguir los tokens de `DESIGN.md` salvo que el usuario diga lo contrario.

- Tokens extraídos del sitio oficial: `DESIGN.md`
- Paleta: primary `#173f7a`, accent `#7fa344`, surface `#f1f3f7`
- Tipografía: Aileron (display 49px, heading 30px, body 16px)
- Espaciado base: `3px`, escala: `[3, 6, 12, 15, 27, 30, 72]`
- Radius: `sm 2px`, `md 15px`
- Animaciones: `fast 200ms`, `base 400ms`, `slow 500ms`
- Breakpoints: desde `421px` hasta `1600px`

Colores Tailwind en `tailwind.config.ts` mapean a estos tokens. Si creas componentes, usa las clases de Tailwind derivadas de los tokens (ej: `bg-brand`, `text-brand`, `bg-brand-surface`).

## Architecture
- `src/pages/` — file-based routing (Astro pages + API routes)
- `src/pages/api/` — SSR API endpoints (Node, not static)
- `src/pages/landing.astro` — **prerendered** static page (`export const prerender = true`)
- `src/components/` — React + Astro components
- `src/services/` — business logic (AI, WhatsApp, PDF, Sheets sync)
- `src/db/` — Drizzle ORM schema + stub connection (not wired yet)
- `src/bot/` — WhatsApp bot (@builderbot/baileys), separate from Astro
- `src/data/` — static JSON content (esinsa-content.json, navigation, etc.)
- `src/lib/` — shared utilities, stores (Zustand), auth, hooks

## Deployment
| Platform | What | Config |
|---|---|---|
| **Railway** | Full SSR app (API + DB + Puppeteer) | `railway.toml` |
| **Netlify** | Static landing page only | `netlify.toml` |
| **GitHub Pages** | Backup landing | `.github/workflows/deploy-pages.yml` |

- `DEPLOY_TARGET=pages` env var switches `base` to `/12_sga-vilaseca/` for GitHub Pages
- Without it, `base: '/'` (default for Railway/Netlify/local)

## Environment Variables
Server-side (Railway): `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `JARVIS_*`

Build-time (Netlify/Pages): `PUBLIC_APP_URL` → Railway backend URL

`.env.example` has the full list with descriptions.

## Git
- `dev` — active development
- `main` — production (deployed to Railway)
- Workflow: `.github/workflows/git-flow.md` documents branch strategy

## Gotchas
- `src/db/index.ts` is a **stub** — returns empty arrays. Schema exists but DB is not wired.
- Puppeteer needs Chromium — only works on Railway (server), not Netlify/Pages.
- `dist/server/` contains the Node server bundle — do not serve statically.
- `.env` is gitignored. `.env.example` is committed as reference.
- Sensitive files gitignored: `baileys.log`, `bot.qr.png`, `creds.json`, `test_auth2/`
- No `package-lock.json` — Bun only. Do not generate npm lockfiles.
