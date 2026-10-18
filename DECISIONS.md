# Decisions

A running log of notable choices and their tradeoffs. Newest at the bottom.
Each entry: what we chose, why, what we gave up, and what we considered instead.

---

## 001 · Next.js App Router with Server Components and Server Actions

**Date:** 2026-10-10
**Decision:** Reads happen in Server Components; writes go through Server Actions. No separate REST API in slice 1.
**Why:** One codebase and one type system from database to UI. Forms built on Server Actions submit without client JS, so they degrade gracefully, which is an accessibility and resilience win.
**Tradeoff:** This ties us to Next.js conventions. If a mobile client or public API is ever needed, route handlers will have to sit in front of the same service layer. That's cheap because actions are kept thin.

## 002 · Better Auth instead of Auth.js

**Date:** 2026-10-10
**Decision:** Better Auth with GitHub and Google OAuth, using the Drizzle adapter.
**Why:** Since September 2025 Auth.js has been maintained by the Better Auth team, who recommend Better Auth for new projects. In July 2026 Better Auth joined Vercel. Its schema lives in our Drizzle schema, so auth tables are visible and migrated like any other table.
**Considered:** Auth.js v5, which is the original plan. It's still patched but is no longer where new work happens.

## 003 · Database sessions, not JWT

**Date:** 2026-10-10
**Decision:** Sessions are rows in a `session` table, referenced by an httpOnly cookie.
**Why:** A session can be revoked instantly by deleting its row, and you can inspect it with plain SQL. Playwright tests can create a session directly, without automating an OAuth provider.
**Tradeoff:** One indexed DB lookup per authenticated request, which is negligible at this scale.

## 004 · Access model: allowlist plus a read-only demo account

**Date:** 2026-10-10
**Decision:** Only allowlisted emails (Zara's) can sign in via OAuth. A seeded demo user with realistic fake data lets recruiters explore without an account. The service layer rejects every write from the demo user.
**Why:** The repo is public and the app is deployed. An open sign-up would invite strangers' data (and, once AI arrives, API costs). Recruiters still need a way to see the app working.
**Future:** Every table is scoped by `user_id` from day one, so opening up to multiple users later is a config change plus review, not a rewrite.

## 005 · Neon Postgres (EU) instead of Supabase

**Date:** 2026-10-10
**Decision:** Neon, Frankfurt region.
**Why:** It's plain Postgres with nothing extra bundled. Branching gives each preview deploy its own database. Supabase's auth and storage would overlap with Better Auth and whatever storage we choose later.
**Deferred:** File storage for CVs is decided in its own slice.

## 006 · Drizzle instead of Prisma

**Date:** 2026-10-10
**Decision:** Drizzle ORM, with generated SQL migrations committed to `drizzle/`.
**Why:** The schema is TypeScript, queries read like SQL, and migrations are plain SQL that can be reviewed in a PR. For someone learning databases, this teaches Postgres rather than an ORM's abstraction. It's also lightweight in serverless.
**Tradeoff:** Less hand-holding than Prisma, and relations need more explicit code.

## 007 · `current_status` is denormalized onto `applications`

**Date:** 2026-10-10
**Decision:** `status_changes` is the history; `applications.current_status` is a copy of the latest entry.
**Why:** The main table sorts and filters by status, and a plain column keeps that query trivial.
**Risk and mitigation:** The two could drift apart. Only the service layer changes status, it always writes both in one transaction, and an integration test asserts they agree.

## 008 · Statuses as text with a CHECK constraint, not a Postgres enum

**Date:** 2026-10-10
**Decision:** A single TypeScript constant lists the statuses: `saved, applied, screening, interviewing, offer, accepted, rejected, withdrawn, no_response`. Zod, the DB CHECK constraint and the UI options are all derived from it.
**Why:** Postgres enums are easy to extend but painful to remove values from. This also keeps the door open for the future "custom statuses" idea.

## 009 · One `interviewing` status plus a `round` column

**Date:** 2026-10-10
**Decision:** Instead of hardcoding "1st/2nd/3rd interview", there's a single `interviewing` status. `status_changes.round` (nullable smallint, at least 1) records the round, and a CHECK constraint allows a round only when `to_status = 'interviewing'`.
**Why:** Real processes have anywhere from one to six rounds.

## 010 · Permissive status transitions

**Date:** 2026-10-10
**Decision:** Any status can follow any other, e.g. rejected → interviewing when a company comes back. Validation only enforces data sanity: no no-op changes, no future dates, and no date earlier than the previous change.
**Why:** Real hiring is messy, and a strict state machine would block true data.
**Future:** Custom statuses may be added later.

## 011 · `occurred_on` is a `date`, not a timestamp

**Date:** 2026-10-10
**Why:** "Interviewed on 14 Oct" is a calendar day, and storing an instant invites timezone off-by-one bugs. `created_at` (timestamptz) breaks ties between changes on the same day.

## 012 · Permanent delete

**Date:** 2026-10-10
**Decision:** Deleting an application removes it and its history (`on delete cascade`), after a confirmation step.
**Why:** It's simpler and privacy-friendly, since nothing lingers. Archiving may come later as its own feature.

## 013 · Tailwind plus CSS Modules, sharing one set of tokens

**Date:** 2026-10-10
**Decision:** Tailwind for straightforward styling; CSS Modules for complex or nested styles. The design tokens from Figma are CSS custom properties (light and dark), exposed to Tailwind via `@theme` and used directly in modules.
**Why:** Tailwind is fast for layout and simple components. Modules keep complex selectors readable. One token source means the two can't drift.
**Rule:** No invented visual design. Screens without a Figma design ship as unstyled semantic HTML.

## 014 · Authorization lives in the data layer, not the proxy

**Date:** 2026-10-10
**Decision:** `proxy.ts` (formerly `middleware.ts`) only redirects signed-out users, for convenience. Every repository function takes `userId` and filters by it.
**Why:** CVE-2025-29927 showed middleware can be bypassed. A cross-user integration test (user B cannot read or change user A's rows) guards the real boundary.
**Considered:** Postgres row-level security. It's stronger but adds complexity, so it's not needed for a single-owner app for now. Revisit if multi-user arrives.

## 015 · Real Postgres in Docker for tests

**Date:** 2026-10-10
**Decision:** Docker Compose Postgres locally; a Postgres service container in GitHub Actions. Integration tests truncate tables between runs.
**Why:** Mocks hide exactly the bugs we care about: constraints, transactions, scoping. Docker is also an industry-standard skill worth learning here.

## 016 · Pinned toolchain: TypeScript 6.0, ESLint 9, Node 24 LTS

**Date:** 2026-10-10
**Decision:** TypeScript 6.0.3 instead of 7.0, and ESLint 9 instead of 10. Node is pinned in `.tool-versions` (asdf locally, `setup-node` in CI). pnpm is pinned via `packageManager` and run through Corepack.
**Why:** `typescript-eslint` supports TS `<6.1`, and `eslint-plugin-jsx-a11y` supports ESLint `<=9`. Accessibility linting is non-negotiable, so the linters set the ceiling.
**Known cost:** ESLint 9 is now deprecated upstream. We still choose it over ESLint 10, because `eslint-config-next` bundles `eslint-plugin-react` and `eslint-plugin-import`, neither of which supports 10 yet. Moving to 10 would mean dropping Next's config and using a young jsx-a11y fork (v0.2.0). ESLint only runs locally and in CI, never in production, so the exposure is low.
**Revisit:** when `eslint-config-next` and `eslint-plugin-jsx-a11y` support ESLint 10.

## 017 · Supply-chain guard: minimum release age

**Date:** 2026-10-10
**Decision:** `minimumReleaseAge: 7 days` in `pnpm-workspace.yaml`, so pnpm refuses package versions younger than a week. Exact versions in `package.json`, and install scripts allow-listed (`onlyBuiltDependencies`).
**Why:** The 2025 npm worm attacks (e.g. "Shai-Hulud") spread through freshly published malicious versions. These were usually pulled within days.
**Tradeoff:** Security patches land a week late unless explicitly exempted (`minimumReleaseAgeExclude`). That's why we're on Next 16.3.8 rather than 16.4.0, which is four days old.

## 018 · Own axe matcher for component tests

**Date:** 2026-10-10
**Decision:** A ~40-line `toHaveNoAxeViolations` matcher on `axe-core` (`tests/setup/axe-matcher.ts`), with its own tests proving it passes clean markup and fails bad markup.
**Why:** `vitest-axe` hasn't been updated since early 2025. `jest-axe` pulls in `@types/jest`, which conflicts with Vitest's globals. Writing our own also means we control the failure message.
**Split:** jsdom has no layout, so `color-contrast` is off in component tests. `region` is also off, because a lone component sits outside the page's landmarks. Playwright runs axe in a real browser with both on (WCAG 2.0–2.2 A/AA tags).

## 019 · Test projects and Playwright scope

**Date:** 2026-10-10
**Decision:** One Vitest config with two projects: `unit` (jsdom) and `integration` (node, files run one at a time against a shared database). Playwright starts on Chromium only, runs against the production build in CI, and reuses `pnpm dev` locally.
**Why:** Fast feedback first. Firefox and WebKit roughly triple e2e time, so they're added when keyboard e2e flows exist (#18), where browser differences in Tab order actually matter (Safari skips links on Tab by default).
**Pattern:** Unfinished skeleton tests call `expect.hasAssertions()`, so they fail loudly instead of passing having checked nothing (`it.todo` is skipped, and an empty test passes).

## 020 · CI: four parallel jobs, actions pinned by SHA
**Date:** 2026-10-18
**Decision:** GitHub Actions runs four jobs on every PR and on pushes to `main`: *Lint, types, format*, *Unit tests*, *Integration tests* (with a throwaway `postgres:17` service container) and *E2E and axe* (against the production build). All four are required checks for merging.
**Why:**
- Parallel jobs give faster feedback, and the PR shows exactly which kind of check failed.
- Actions are pinned to commit SHAs, not tags. A tag can be repointed to malicious code: in March 2025 the `tj-actions/changed-files` compromise did exactly that and leaked secrets from thousands of repos. Same reasoning as DECISIONS 017.
- `permissions: contents: read` means a compromised step can't push code or edit releases.
- `--frozen-lockfile` fails the install if `package.json` and the lockfile disagree, so CI tests exactly what's committed.
**Tradeoff:** SHA pins don't update on their own. They need Dependabot or a manual bump.
**Revisit:** match the Postgres major version to the Neon project once it's created (#5).

## Open questions

- **Status control in the table (owner: Zara).** On Windows Chromium, arrow keys on a closed `<select>` fire `change` on every keypress. If a change saves immediately, keyboard users would create unintended history rows. The options are an explicit per-row submit, or a "change status" dialog that also collects the date, round and note.
