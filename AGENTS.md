# AGENTS.md — Thalassa Hub (webthalassaoficial)

## Quick commands

```bash
npm run dev          # Vite dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Build with development mode
npm run lint         # ESLint flat config (eslint.config.js)
npm test             # Vitest single run (jsdom, globals)
npm run test:watch   # Vitest watch mode
```

## Architecture

- **SPA with hash-scrolling.** Single route `/` renders `src/pages/Index.tsx`, which composes sections (Navbar, Hero, About, Services, Events, Contact, Footer). Navigation uses `#inicio`, `#nosotros`, `#servicios`, `#eventos`, `#contacto` links that scroll to section IDs. The only other page is `src/pages/NotFound.tsx` (404 catch-all).
- **Custom bilingual i18n.** `src/contexts/LanguageContext.tsx` manages ES/EN state via `localStorage`. Text lives in `src/locales/{es,en}.json`. Translation keys are typed in `src/locales/index.ts` (`TranslationKey` union type). **When adding text, update both JSON files AND the `TranslationKey` type.** Fallback is always Spanish.
- **shadcn/ui components** live in `src/components/ui/`. Add new ones with `npx shadcn-ui@latest add <name>`. The `@` alias maps to `./src`.
- **Brand CSS** is defined as custom properties and utility classes in `src/index.css` (e.g., `--primary`, `--champagne`, `.btn-primary`, `.glass-card`, `.card-service`). Prefer these over hardcoded colors.

## TypeScript

- **Relaxed type checking.** `tsconfig.app.json` has `strict: false`, `noUnusedLocals: false`, `noImplicitAny: false`. ESLint also has `@typescript-eslint/no-unused-vars: off`. Do not introduce strict mode or unused-var checks without explicit approval.
- SWC plugin handles compilation (not tsc). There is no `typecheck` script.

## Project conventions

- **Use npm, not bun.** A `bun.lockb` file exists but npm is canonical (`package-lock.json`).
- **React 18** (not 19). Use React 18 patterns.
- **Vite `lovable-tagger`** plugin is loaded conditionally in dev mode. Do not remove it.
- **Cookie consent** is managed by `src/components/CookieBanner.tsx` (stores in `localStorage`).

## Testing

- **Vitest + jsdom + `@testing-library/react`**. Setup at `src/test/setup.ts` mocks `window.matchMedia` and adds jest-dom matchers.
- Tests go in `src/**/*.{test,spec}.{ts,tsx}`.
- Only a placeholder test exists (`src/test/example.test.ts`).

## SEO/GEO

- The repo includes an installable agent skill at `.agents/skills/seo-geo/` for SEO and Generative Engine Optimization tasks. Load it with the `skill` tool when working on search visibility, metadata, or structured data.

## No CI/CD

- No `.github/workflows/`. No pre-push hooks. Lint and test must be run manually.

## vercel.json

- **No admite comentarios.** Vercel valida el fichero contra un esquema estricto
  y rechaza claves como `"//"` dentro de los objetos de `rewrites` o `headers`:
  el despliegue falla entero con "Configuration error", sin más detalle.
- La reescritura de `/profesionales` va **antes** del comodín, porque esa ruta
  se sirve desde `profesionales.html`, un HTML aparte que genera el plugin de
  `vite.config.ts` con su propio title, description y canonical.
- El comodín `/(.*)` existe para que `/resena/:token` no dé 404 al entrar
  directamente: es una ruta de cliente, no un fichero.
