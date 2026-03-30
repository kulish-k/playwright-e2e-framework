# Playwright Enterprise Framework 🎭

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

A production-grade, highly scalable Playwright automation framework designed to test modern web applications (particularly React-based architectures). Built by a Senior QA Automation Engineer, this framework demonstrates advanced enterprise design patterns natively within Playwright.

## 🌟 Core Architecture & Capabilities

This framework isn't just a collection of tests; it relies on strict software engineering principles optimized for maintainability and flake-free execution in CI/CD environments.

### 1. Robust Page Object Model (POM)
Every page context is modeled using strictly typed classes (`src/pages`). UI Interactions abstract away complexity, making tests highly readable.
- **Robust Selectors:** Prefer prioritizing resilient locators mapping to frontend test identifiers (`data-testid`).
- **Async Resilience:** Wait mechanisms for frontend hydrations (`waitForLoadState`, spinner handlers) are directly incorporated into action flows.

### 2. Dependency Injection via Custom Fixtures
Say goodbye to `beforeEach` and instantiating 10 different POM classes per test!
- Foundational `test.ts` (in `src/fixtures`) is overridden to automatically hydrate and tear down Page Objects, APIs, and test-data bindings.
- Check `login.spec.ts` to see how cleanly `dashboardPage` is requested in the test parameters!

### 3. API Mocking & Network Interception
End-to-end tests are famously slow and brittle. 
- Integrated robust utility helpers (`src/utils/apiMocking.ts`) to intercept network traffic, force backend HTTP status codes, load static UI payloads, or artificially delay APIs (`delayApiCall`) to ensure frontend loading states work correctly without depending on temperamental backends.

### 4. CI/CD Integration & Reporting
Integrated directly with GitHub Actions (`.github/workflows/playwright.yml`).
- Triggers on PR boundaries.
- Uses `ubuntu-latest` workers, parallelized shards (configurable in playwright object), caching layers, and exports standardized **JUnit / Playwright HTML Reporter** artifacts universally.

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `v18+`
- `npm`

### Installation
```bash
# Clone the repository
git clone https://github.com/kulish-k/playwright-e2e-framework.git
cd playwright-e2e-framework

# Install module dependencies
npm install

# Install Playwright browser binaries
npx playwright install --with-deps
```

### Execution Scripts
Run tests sequentially across multiple browsers:
```bash
npm run test
```

Run tests targeting a specific environment (simulated via `cross-env` config parameters):
```bash
npm run test:staging
```

Use Playwright's brilliant visual UI mode for real-time debugging:
```bash
npm run test:ui
```

### Linting & Formatting
To ensure standard practices across the QA Team:
```bash
npm run format
npm run lint
```

## 🧠 Quality Assurance Strategy (QAS) 

- **State Independence**: Tests run 100% concurrently. No test relies on the state left by another.
- **Flakiness mitigation**: We natively enable `retries: 2` mapped directly onto GitHub action runs via Node `process.env.CI` flags ensuring transient flakes do not block deployment pipes. Traces and Videos are recorded *only on the first retry* so as not to bloat local developer machines or CI retention limits.
- **Fail-Fast Methodology**: `forbidOnly` is enabled; developers cannot accidentally merge disabled `.only` blocks to `main`.

---
*Authored and Maintained by [Kulish Kulshrestha](https://github.com/kulish-k).*
