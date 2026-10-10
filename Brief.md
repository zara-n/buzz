# Buzz Brief

I'm building Buzz, a personal job application tracker, as a portfolio project
to showcase full stack and accessibility skills to potential employers. I'm
senior front end engineer with a specialty in accessibility, so accessibility
quality matters as much as the features. The repo will be public on GitHub.

## What Buzz does (full vision, built in slices)
- Track job applications and their status (applied, rejected, 1st/2nd/3rd
  interview, offer, etc.), entered manually, with dates for each stage change.
- Paste a job posting as text; an LLM extracts structured data (company, role,
  location, salary, requirements, red flags), validated with Zod before saving.
- Each application has its own detail page: status history, notes, the CV and
  cover letter versions sent.
- File storage for CVs and cover letters.
- AI cover letter generation from my CV + job data (only facts from the CV,
  output is always an editable draft).
- AI company research brief with sources, labelled "verify before using".
- Later: follow-up reminders, answer bank, stats page.

## Proposed stack (challenge this if you have good reasons)
Next.js (App Router) + TypeScript, Auth.js with GitHub/Google login,
Postgres (Neon or Supabase, EU region) with Drizzle or Prisma, Zod for
validation, Anthropic API for AI features, Vitest + Testing Library +
Playwright, deployed on Vercel.

## Non-negotiables
- WCAG 2.2 AA minimum, fully keyboard operable, tested with axe in CI.
- Main applications view is a table/list with a status dropdown, NOT
  drag-and-drop kanban.
- Semantic HTML first, ARIA only when needed, visible focus, skip link,
  proper form labels and error messaging, live regions for async/AI progress.
- Respect prefers-reduced-motion.
- Strict TypeScript, no secrets in the repo, data is private to the logged-in user.
- Small, reviewable commits with clear messages.

## Testing
- I write the tests, or at least the assertions. Claude Code may draft
  skeletons, fixtures and config, but I decide what "correct" means.
- Service layer (status transitions, validation): test-first where possible.
  I write the failing test, then the implementation.
- Component tests with Testing Library, querying by role and label
  (getByRole, getByLabelText), never by test ID unless unavoidable.
  This doubles as an accessibility check.
- Automated axe checks in component tests and Playwright.
- Data layer and server actions: integration tests against a real test
  Postgres, not mocks.
- Playwright e2e for key flows, including keyboard-only runs.
- All of it runs in GitHub Actions and is a required check before merge.
- When AI features arrive: mock the Anthropic API in tests, and test that
  malformed or hallucinated LLM output is rejected by Zod.
- When you write tests for me, tell me what bug each test would catch.

## Design
- I design the UI myself in Figma (wireframes, tokens, component states,
  accessibility annotations). Design files and exports live in docs/design/.
- Do not invent visual design. If a screen has no design yet, ask me or
  build an unstyled semantic version.
- Tokens (colours, spacing, type, focus ring) are defined as CSS variables,
  with light and dark themes, and checked for AA contrast.

## About me
- Senior front end engineer, strong on accessibility and React.
- Less experienced with backend, auth and databases, so explain those
  decisions in more detail.

## How we work together
- I want to write a good share of the code myself, especially front end and
  accessibility work. Do not write everything for me.
- Default mode: I write the first attempt, you review it. For each task, ask
  whether I want to write it or have you draft it.
- You draft: scaffolding, config, CI, migrations, boilerplate, test
  skeletons.
- I write: UI components, accessibility behaviour, form handling, the
  status table, and the service-layer logic for status transitions.
- Auth, database access and anything touching my CV data: you may draft it,
  but walk me through it line by line before moving on.
- When you write code I haven't seen before, explain it and ask me one
  question to check I understood.

## Engineering conventions
- Layered structure: data access, service/business logic, then thin
  actions/route handlers. Backend logic should be easy to find and read.
- GitHub Flow: short-lived branch and PR per issue, `Closes #N`.
- Keep DECISIONS.md of notable choices and tradeoffs.


## Not doing
- No scraping job sites (paste text only), no drag-and-drop kanban,
  no multi-user features, no TanStack Query for now (revisit if client-side
  state gets complex).