# CLAUDE.md

## Project Overview

Subscription Inventory is a Red Hat Insights micro-frontend for viewing subscription product inventory, served on `console.redhat.com`. Built with React/TypeScript and loaded into the Insights Chrome shell via Webpack Module Federation (`fec` CLI).

## Common Commands

- `npm run start` — dev server with proxy (requires Red Hat VPN + proxy setup)
- `npm run build` — production build
- `npm run test` — run Jest tests
- `npm run lint` — ESLint + Stylelint
- `npm run verify` — build + lint + test (full CI check)
- `npm run format` — Prettier formatting

## Architecture & Conventions

- Functional components only, arrow functions, typed with `FC<Props>` or inline prop interfaces
- PascalCase directories with `index.ts` barrel exports for each component
- Types colocated with hooks/components (no central types directory)
- PatternFly v6 for UI components; some `pf-v5-*` utility classes remain (migration in progress)
- Plain SCSS — custom styles auto-scoped under `.subscription-inventory` / `.subscriptionInventory` by `fec.config.js`
- Native `fetch` + TanStack React Query v5 for data fetching; JWT auth via `useToken()` from platform services
- React Router v6 with lazy loading
- No Redux — React Query for server state, React Context for notifications, `useState` for UI state
- Feature flags via Unleash (`useFeatureFlag` hook wraps `@unleash/proxy-client-react`)
- Authorization via Kessel (`@project-kessel/react-kessel-access-check`) for relation-based access control
- Prefer code reuse over duplication — extract shared logic into hooks or utilities
- Prefer small, focused React components over large complex ones
- Stay in scope — do not refactor or "improve" unrelated code when working on a feature. Instead, note potential improvements for the developer as a follow-up for a future ticket

## Testing

- Jest 30 (with `jest-jasmine2` runner) + React Testing Library + jest-fetch-mock
- Tests colocated in `__tests__/` subdirectories
- Test data via `fishery` factories (with `@faker-js/faker`) in `src/utilities/factories/`
- BDD-style lazy vars (`def`/`get`) from `bdd-lazy-var` used in some test files
- `createQueryWrapper()` from `src/utilities/testHelpers.tsx` for wrapping hook tests
- Coverage thresholds: 85% across branches, functions, lines, and statements
- New features must include unit tests
- Do NOT use snapshot tests — test observable behavior and functionality (what the user sees and does), not implementation details (internal state, component structure, CSS classes)
- Pre-existing test failures are a code smell — if existing tests break after your changes, investigate the unintended consequences rather than just updating the test to pass. The failing test may be revealing buggy behavior introduced by your changes

## Key Caveats

- Pre-commit hook runs Prettier + ESLint via husky/lint-staged
- App runs inside Red Hat Insights Chrome shell — `useChrome()` provides auth, navigation, and environment
- Local dev requires Red Hat VPN and proxy setup
- `fec.config.js` configures Webpack/Module Federation — app exposes `./RootApp` and `./SubscriptionsWidget`
