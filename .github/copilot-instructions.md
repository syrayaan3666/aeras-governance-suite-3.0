<!-- Copilot instructions for AI coding agents working on AERAS governance UI -->
# Copilot / AI Agent Instructions

Purpose: rapidly onboard an AI coding agent to make safe, targeted edits in this Vite + React + TypeScript UI.

- Project entry: use `npm i` then `npm run dev` (see `package.json` scripts).
- Build: `npm run build` and preview with `npm run preview`.
- Linting: `npm run lint` (ESLint config present).

Key architecture notes
- Frontend-only Vite React app (TypeScript) with UI primitives from `src/components/ui/*` (shadcn + Radix patterns).
- Business/typing layer and core helpers live in `src/lib`:
  - [src/lib/aeras-engine.ts](src/lib/aeras-engine.ts#L1) — canonical types (`AcademicException`, `ExceptionType`, `CaseStatus`) and risk/SLA helpers. Prefer updating types here when adding fields.
  - [src/lib/salesforce.ts](src/lib/salesforce.ts#L1) — lightweight Salesforce REST helpers. It expects a proxy at `/api/sf` and environment vars `VITE_SF_*` for credentials. Calls throw if not authenticated.
  - [src/lib/mock-data.ts](src/lib/mock-data.ts#L1) — places where UI reads `queryRecords()` outputs and maps Salesforce records into `AcademicException` shapes.

Patterns & conventions (do not change without reason)
- UI primitives: `src/components/ui/*` provide composable Radix/shadcn wrappers (use `cn()` from `src/lib/utils.ts` to combine classes).
- Component folder naming: each feature component lives in `src/components` (e.g., `CaseListPanel.tsx`, `CaseDetailView.tsx`). Prefer adding new feature components here.
- Types-first: domain types are authoritative in `src/lib/aeras-engine.ts`; update mappings in `mock-data.ts` when new Salesforce fields are added.
- Data access: UI calls into `src/lib/*` helpers (e.g., `getAcademicExceptions`, `getDashboardMetrics`) — prefer extending these helpers, not calling Salesforce directly from components.

Important integration details
- Salesforce is integrated via browser fetch to `/api/sf/services/...` from `salesforce.ts`. The app expects a proxy or backend that forwards these requests to Salesforce; do not hardcode instance URLs in the frontend.
- Environment variables: use `VITE_SF_CLIENT_ID`, `VITE_SF_CLIENT_SECRET`, `VITE_SF_USERNAME`, `VITE_SF_PASSWORD`, `VITE_SF_SECURITY_TOKEN` in local `.env` when testing Salesforce flows.

Developer workflows useful for agents
- Quick dev run: `npm i && npm run dev` — opens Vite dev server with HMR.
- When adding types or domain changes: update `src/lib/aeras-engine.ts` first, then align `src/lib/mock-data.ts` mapping functions.
- UI style updates: edit `src/components/ui/*` files. Tailwind utility merging uses `cn()` helper in `src/lib/utils.ts`.

Examples to reference when implementing changes
- Add a new field from Salesforce: add the Type to `aeras-engine.ts`, then map the SF field in `mock-data.ts`'s `getAcademicExceptions` mapping.
- Create an API helper: add a function in `src/lib/salesforce.ts` to wrap a new endpoint and call it from `mock-data.ts` or a new `src/lib/*` file.

Caveats and guardrails for AI edits
- Avoid exposing raw credentials or committing `.env` files. If adding Salesforce test hooks, use clearly-named test flags and keep credentials out of commits.
- Do not modify server/proxy behavior from the frontend code; the frontend assumes `/api/sf` exists.
- Keep UI changes localized to component files under `src/components` and primitives under `src/components/ui`.

If unclear: ask the user to confirm
- Whether Salesforce proxy is available for CI/dev, or if local mock mode is preferred.
- Any planned schema changes in Salesforce so types can be updated centrally in `src/lib/aeras-engine.ts`.

End of instructions — ask for feedback for anything missing.
