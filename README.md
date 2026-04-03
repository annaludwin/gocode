# FashionHub E2E (Playwright)

Cross-browser E2E tests for the **FashionHub** demo (login scenario). Environments are selected via **`TEST_ENV` (CLI)** with fallback to **`config/runtime.json`**, then default **`production`**.

## Requirements

- Node.js **18+** (LTS recommended)
- npm **9+**

## Setup

```bash
npm ci
npx playwright install
```

## Run tests

```bash
# All projects (Chromium, Firefox, WebKit)
npm test

# Single browser
npm run test:chromium
npm run test:headed
```

### Environment selection

| `TEST_ENV` | Base URL |
|------------|----------|
| `local` | `http://localhost:4000/fashionhub/` |
| `staging` | `https://staging-env/fashionhub/` |
| `production` (default) | `https://pocketaces2.github.io/fashionhub/` |

**Priority:** `TEST_ENV` from the shell **overrides** `config/runtime.json`. If both are absent, **`production`** is used.

Examples:

```bash
# Windows-friendly scripts (cross-env)
npm run test:production
npm run test:local

# Or set the variable directly in your shell
export TEST_ENV=production   # Linux/macOS
set TEST_ENV=production && npm test   # Windows cmd
```

**Config file:** copy `config/runtime.json.example` to `config/runtime.json` and set `"env"`.

```bash
cp config/runtime.json.example config/runtime.json
# edit env to local | staging | production
npm test
```

## Run FashionHub locally (Docker)

Per the challenge description, you can run the app from Docker Hub, then use `TEST_ENV=local`:

```bash
docker run --rm -p 4000:4000 pocketaces2/fashionhub-demo-app
```

In another terminal:

```bash
npm run test:local
```

> If the container publishes a different port or path, adjust the URL in `config/resolve-env.ts` (`local` entry).

## Reports

- HTML: `playwright-report/` (after the run)
- JUnit: `test-results/junit.xml` (for Jenkins)

## Docker (test runner)

Build and run the test suite inside Playwrightâ€™s official image (version pinned to match `@playwright/test`):

```bash
docker build -t fashionhub-e2e .
docker run --rm -e TEST_ENV=production fashionhub-e2e
```

## Jenkins

A sample pipeline is in `Jenkinsfile`. It runs steps inside `mcr.microsoft.com/playwright:v1.59.1-noble`, uses parameter **`TARGET_ENV`**, sets `TEST_ENV`, and archives **`playwright-report/**`**.

Requirements on the Jenkins controller/agents:

- **Docker Pipeline** plugin (agent `{ docker { ... } }`)
- Network access to the chosen environment URL

## Scenario covered

**Login:** valid user (`demouser` / `fashion123`) opens `/login.html`, submits the form, lands on the account page, and sees a **welcome heading** containing the username.

## Project layout

- `config/resolve-env.ts` â€” environment resolution
- `src/pages/*` â€” page objects
- `fixtures/test.fixtures.ts` â€” Playwright fixtures
- `tests/*.spec.ts` â€” specs
- `test-data/users.json` â€” test credentials