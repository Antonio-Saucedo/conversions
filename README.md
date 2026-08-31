# Instant Conversion

A small weight unit converter — grams, kilograms, metric tonnes, micrograms, milligrams, ounces, and pounds — with live
conversion as you type, a dark/light mode toggle, and a fully keyboard- and screen-reader-accessible interface.

**Live app:** https://antonio-saucedo.github.io/conversions/

[![CI](https://github.com/Antonio-Saucedo/conversions/actions/workflows/ci.yml/badge.svg)](https://github.com/Antonio-Saucedo/conversions/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/Antonio-Saucedo/conversions/actions/workflows/deploy.yml/badge.svg)](https://github.com/Antonio-Saucedo/conversions/actions/workflows/deploy.yml)

## Features

- Convert between g, kg, mt, mcg, mg, oz, and lb, with the result updating live as you type
- Swap button to instantly reverse the "from"/"to" units
- Dark / light mode toggle
- Keyboard-operable keypad and controls, with `aria-live` regions so screen readers announce the result and formula as
  they update

## Tech stack

- [React 19](https://react.dev/) + TypeScript (see note on the TypeScript setup below)
- [Vite](https://vite.dev/) 8

## Getting started

```bash
npm install
npm run dev
```

## Available scripts

| Script              | What it does                                                               |
|---------------------|----------------------------------------------------------------------------|
| `npm run dev`       | Start the Vite dev server                                                  |
| `npm run build`     | Production build to `dist/`                                                |
| `npm run typecheck` | Type-check the project with `tsc` (no output emitted)                      |
| `npm run test`      | Run the unit test suite once (Vitest)                                      |
| `npm run test:e2e`  | Build the app, then run the Playwright end-to-end suite against that build |
| `npm run lint`      | Lint with ESLint                                                           |
| `npm run preview`   | Serve the production build locally (also used by Playwright, see below)    |

> `npm run test:e2e` always rebuilds first — `pretest:e2e` runs `npm run build` automatically before the E2E suite
> starts, and Playwright serves that build via `npm run preview` rather than the dev server. You don't need to build
> manually before running E2E tests.

### A note on the TypeScript setup

`package.json` lists two TypeScript-related devDependencies that look redundant but aren't:

```json
"@typescript/native": "npm:typescript@^7.0.2",
"typescript": "npm:@typescript/typescript6@^6.0.2"
```

TypeScript 7 ships a rewritten native compiler with a major speed improvement, but it doesn't yet expose the stable
programmatic API that `typescript-eslint` depends on (expected in 7.1). Installing TypeScript 7 directly under the
`typescript` package name breaks `typescript-eslint`'s install with a peer dependency conflict. The fix is to alias
`typescript` to the 6.x compatibility package so lint tooling keeps working, while `@typescript/native` holds the real
7.x compiler for type-checking.

**Don't merge a Dependabot PR that bumps `typescript` directly** — it will reintroduce the conflict this alias avoids.
Once `typescript-eslint` adds TypeScript 7 support, this can collapse back down to a single `typescript` entry.

## Testing

- **Unit tests** — [Vitest](https://vitest.dev/) with Testing Library, running in a jsdom environment.
- **End-to-end tests** — [Playwright](https://playwright.dev/), run against the production build across Chromium,
  Firefox, WebKit, and a mobile Safari (iPhone 14) viewport.
- **Accessibility audit** — [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) runs as part of the E2E
  suite, checking the app against WCAG 2A/2AA rules.

## CI/CD

Two GitHub Actions workflows live in `.github/workflows/`:

- **`ci.yml`** — runs on every push and pull request against `main`: installs dependencies, audits them
  (`npm audit --audit-level=high`), lints, type-checks, runs the unit suite, then installs Playwright's browsers and
  runs the full E2E + accessibility suite, and finally builds. The Playwright HTML report is uploaded as an artifact if
  any E2E test fails, and the production build is uploaded as an artifact on every run.
- **`deploy.yml`** — runs after `ci.yml` succeeds on `main`. Rebuilds the app (with `VITE_BASE_PATH=/conversions/` so
  asset paths resolve correctly under a project-page subpath) and publishes `dist/` to GitHub Pages.

### One-time setup to enable deployment

In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**. After that, every push to `main` that
passes CI deploys automatically.

## Dependency updates

Dependabot is configured (`.github/dependabot.yml`) to check weekly for npm package updates and GitHub Actions version
updates, opening up to 10 pull requests at a time. Review `typescript`-related PRs against the note above before
merging.

---

© 2026 Antonio Saucedo
