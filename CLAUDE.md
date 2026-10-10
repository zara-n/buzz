# Buzz

Personal job application tracker, built as a public portfolio project to show
full stack and accessibility skills. Accessibility quality matters as much as
features. Full brief: [Brief.md](Brief.md). Decisions log: [DECISIONS.md](DECISIONS.md).

## Current slice: 1
Auth + CRUD for applications + status tracking + status history, accessible and
tested. **No AI features yet.** Later slices: LLM job-posting extraction, detail
page notes, CV/cover letter storage, AI cover letters, company research,
reminders, stats.

## Stack
Next.js (App Router) + strict TypeScript · Better Auth (GitHub + Google,
database sessions) · Neon Postgres (EU) + Drizzle · Zod · Tailwind + CSS Modules ·
Vitest + Testing Library + vitest-axe · Playwright + @axe-core/playwright ·
Docker Postgres for local/CI tests · Vercel · pnpm, Node 24 LTS.

## How we work together (most important section)
Zara is a senior front end / accessibility engineer, newer to backend, auth and
databases. She wants to write a good share of the code herself.

- **Never write everything.** For each task, ask whether Zara writes it or Claude drafts it.
- Default: Zara writes the first attempt, Claude reviews.
- **Claude drafts:** scaffolding, config, CI, migrations, boilerplate, test skeletons, fixtures.
- **Zara writes:** UI components, accessibility behaviour, form handling, the
  status table, status-transition service logic, and test assertions.
- **Auth, DB access, anything touching CV data:** Claude may draft, then walks
  through it line by line before moving on. Explain backend concepts in depth.
- When Claude writes code Zara hasn't seen: explain it, then ask **one** question
  to check understanding.
- Work in small steps. After each step explain what was done and why (this feeds
  interviews and a blog post). Add notable choices to DECISIONS.md.
- Ask before deciding anything significant.

## Architecture
Layered, backend logic easy to find:
- `src/server/repositories/` data access only. **Every function takes `userId`
  and filters by it.** This is the authorization boundary, not the proxy.
- `src/server/services/` business rules, transactions.
- `src/server/actions/` thin `'use server'` actions: parse (Zod) → `requireUser()`
  → service → typed `{ ok, fieldErrors }` result.
- `src/domain/` pure logic and Zod schemas shared by client and server.
- All `src/server/**` imports `server-only`.
- Reads in Server Components, writes via Server Actions. Forms work without JS.
- No TanStack Query for now.

## Accessibility (non-negotiable)
- WCAG 2.2 AA minimum, fully keyboard operable, axe in CI.
- Semantic HTML first; ARIA only when needed. Visible focus, skip link, landmarks.
- Proper labels, error summary + inline errors, focus management after submit.
- Live regions for async progress. Respect `prefers-reduced-motion` and forced colors.
- Main view is a **table/list with status control, never drag-and-drop kanban**.

## Design
- Zara designs in Figma; exports live in `docs/design/`.
- **Do not invent visual design.** No design yet → ask, or build unstyled semantic markup.
- Tokens (colour, spacing, type, focus ring) are CSS variables, light + dark,
  AA contrast checked. Tailwind for simple styling; CSS Modules for complex or
  nested styles. Both consume the same tokens.

## Testing
- Zara writes tests, or at least the assertions; she decides what "correct" means.
- Service layer test-first: Zara writes the failing test, then the implementation.
- Testing Library queries by role/label (`getByRole`, `getByLabelText`); no test IDs
  unless unavoidable. axe checks in component tests and Playwright.
- Data layer and actions: integration tests against real Postgres, never mocks.
- Playwright e2e for key flows, including keyboard-only runs.
- **When Claude writes a test, state what bug it would catch.**
- Future AI: mock Anthropic API; test that malformed LLM output is rejected by Zod.

## Rules
- Strict TypeScript. No secrets in the repo (`.env.example` only).
- Data is private to the logged-in user. Sign-in is allowlisted to Zara; a seeded
  **read-only demo account** exists for recruiters; writes from it are rejected
  in the service layer. Keep the model multi-user-ready (everything scoped by `user_id`).
- GitHub Flow: one short-lived branch + PR per issue, PR body `Closes #N`.
  Small, reviewable commits with clear messages. CI must pass before merge.
- Not doing: job-site scraping, kanban, multi-user features, TanStack Query.

## Commands
_Filled in once the project is scaffolded._
