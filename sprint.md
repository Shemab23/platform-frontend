# FRONTEND checklist (`platform-frontend`)

Stack: Next.js (App Router), TypeScript, Tailwind, Jest + React Testing Library + msw.
Sprints are global numbers shared with BACKEND.md. Frontend owns sprints 00, 03, 05, 07, 08.
Rule: a frontend sprint starts only after the backend sprint it depends on is merged into `develop`.

## Workflow rules

- One branch per milestone: `milestone/NN-name`, created from `develop`.
- One commit per task: `sprint 03: task 3.2 - added onboarding page and tests`
- Milestone closing commit: `ml 02: end of tenant admin UI - SAFE` (or `NOT SAFE`)
- One PR per milestone into `develop`, merged with a merge commit. Then `git tag ml-NN`.
- Only open a `develop -> main` PR when the milestone is SAFE on staging.
- Test levels: **unit** (helpers), **component** (RTL + msw), **global** (a full page flow against mocked API).

## Milestone gate (copy into every milestone PR)

- [ ] `npm test` green locally
- [ ] CI green on the PR (lint, tsc, test, build)
- [ ] `npm run build` succeeds
- [ ] Vercel preview works against the staging backend
- [ ] Manual smoke test on the staging URL passed
- [ ] No secrets in the diff, `.env.example` updated
- [ ] No page shows a disabled module's data
- Verdict: SAFE / NOT SAFE

---

# ML 00: Pipeline

## Sprint 00: Repo, CI, deploy
- [ ] **Task 0.1: repo, protection, CI, deploys**
  - Starts from: nothing
  - Use: create-next-app, GitHub (public), Vercel
  - Create: repo, `develop` + `main`, rulesets, `ci.yml`, CODEOWNERS, `/api/*` rewrite to `BACKEND_URL`, hello page showing `/api/tenant/config`
  - Ends with: staging and prod pages show backend JSON, pushes blocked
- [ ] **ML 00 close:** gate checked, commit `ml 00: end of pipeline - SAFE`, tag `ml-00`

---

# ML 02: Tenant admin UI (closes together with BACKEND Sprint 02)

Prerequisite: BACKEND ML 01 merged, BACKEND Sprint 02 task 2.1 merged.

## Sprint 03: Foundation, onboarding, login, sidebar, products
- [ ] **Task 3.1: test harness and API client**
  - Use: Jest, `next/jest`, RTL, msw
  - Create: `jest.config.ts`, `lib/api.ts` (`credentials: 'include'`, `x-tenant` header), `lib/tenant.ts` (host or `/t/[slug]`), CI test step
  - Tests: header attached, tenant parsing for `shop-a.localhost` and `/t/shop-a`
- [ ] **Task 3.2: onboarding page**
  - Create: `app/onboarding/page.tsx` (shop name, slug, owner credentials, feature + gateway checkboxes), calls register-tenant
  - Tests: validation errors, submit sends chosen flags
  - Ends with: you can create "Shop A" from the browser
- [ ] **Task 3.3: login and shop picker**
  - Create: `app/login/page.tsx` (pick shop, email, password), redirect to `/t/[slug]/dashboard`, logout button, `middleware.ts` setting tenant on **request** headers
  - Tests: login redirects to correct tenant, protected route redirects to login
- [ ] **Task 3.4: config-driven sidebar**
  - Create: `app/t/[tenant]/layout.tsx`, `TenantProvider`, `Sidebar` rendering only enabled modules, locked page for disabled URLs
  - Tests: orders on / delivery off shows only Orders, disabled URL shows locked page
  - Ends with: two tenants see different admin interfaces
- [ ] **Task 3.5: product management page**
  - Create: admin Products table + form
  - Tests: list renders, create calls API
- [ ] **ML 02 close (both repos):** run tests in both, push both milestone branches, PR each into `develop`, verdict, commit `ml 02: end of tenant admin UI - SAFE`, tag `ml-02`

---

# ML 03: Storefront and payments UI (closes together with BACKEND Sprint 04)

Prerequisite: BACKEND Sprint 02 and Sprint 04 merged.

## Sprint 05: Marketplace, cart, checkout, receipt, payouts
- [ ] **Task 5.1: public marketplace page**
  - Create: `app/(market)/page.tsx`, product cards with shop name, search box
  - Tests: renders mixed-shop products, search calls API
- [ ] **Task 5.2: cart UI**
  - Create: add-to-cart button, `app/cart/page.tsx` grouped by shop, quantity edit/remove
  - Tests: grouping by shop, totals shown from API data
  - Ends with: guest mixes two shops, cart survives refresh
- [ ] **Task 5.3: checkout page**
  - Create: `app/checkout/page.tsx` (email, name, provider buttons from tenants' allowed gateways), redirect to provider
  - Tests: only allowed providers render
- [ ] **Task 5.4: receipt and return pages**
  - Create: `app/orders/[id]/page.tsx` polling until `paid`, itemized per shop, redirect-return pages
  - Tests: shows paid after polling update (msw)
- [ ] **Task 5.5: payouts page**
  - Create: admin Payouts page (gross, fee, net)
  - Tests: renders rows
- [ ] **ML 03 close (both repos):** full guest flow on staging with all three providers, tests green, commit `ml 03: end of storefront and payments - SAFE`, tag `ml-03`

---

# ML 04: Optional modules UI (closes together with BACKEND Sprint 06)

Prerequisite: BACKEND Sprint 06 merged.

## Sprint 07: Module pages
- [ ] **Task 7.1: orders page** (only if `hasOrderHistory`): table, filters, detail drawer. Tests: renders, hidden when off
- [ ] **Task 7.2: analytics page** (only if `hasCustomerTracking`): cards + 2 Recharts charts, customers table. Tests: renders values from msw data
- [ ] **Task 7.3: deliveries page** (only if `hasDeliveryProcessing`): action buttons, status line on customer receipt. Tests: buttons call the PATCH route
- [ ] **Task 7.4 (stretch): quote request form and admin list**
- [ ] **ML 04 close (both repos):** Shop A (all on) and Shop B (orders only) look different, commit `ml 04: end of optional modules UI - SAFE`, tag `ml-04`

---

# ML 05: Hardening and release

## Sprint 08: Polish and release
- [ ] **Task 8.1: error and empty states**: loading, empty, error, and 403 screens everywhere
- [ ] **Task 8.2: global flow test**: onboard, add product, buy, see receipt, see payout, against msw
- [ ] **Task 8.3: production release**: Vercel production env `BACKEND_URL`, PR `develop -> main`
- [ ] **Task 8.4: README and `DEMO.md`**: setup, branch workflow, demo script (two shops, different features, three providers, locked modules)
- [ ] **ML 05 close (both repos):** commit `ml 05: end of hardening and release - SAFE`, tag `ml-05`, PR to `main`
