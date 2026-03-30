import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environmental variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Flakiness handling: Fail entire TS compilation if `.only` accidentally leaks
  forbidOnly: !!process.env.CI,
  // Flakiness handling: Automatically retry flaky CI network requests
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  
  // Advanced Reporting integration
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    // Allure reporter added per Enterprise requirements
    ['allure-playwright', { detail: true, outputFolder: 'allure-results' }]
  ],

  use: {
    // Dynamically handle environment base URLs globally
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    
    // Tracing strategy: Capture trace ONLY on first retry to vastly save CI log space.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    
    // Pass extra context or API details statically accessible through `request` fixture
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'X-Enterprise-QA-Audit': 'Playwright Automation Core'
    }
  },

  projects: [
    // --- 1. Global Setup Context ---
    {
      name: 'setup',
      testDir: './src/setup',
      testMatch: /.*\.setup\.ts/,
      // Setup tasks aren't tests, they prepare dependency contexts
    },
    
    // --- 2. GUI & E2E Testing Tiers ---
    {
      name: 'chromium-e2e',
      testIgnore: [/.*api\.spec\.ts/], // Ignore bare API tests here
      use: {
        ...devices['Desktop Chrome'],
        // We instruct UI tests to rely upon the globally populated session!
        storageState: 'src/setup/auth.json',
      },
      dependencies: ['setup'], // Forces `setup` project to execute and populate `auth.json` first
    },
    
    // --- 3. API & Microservices Tier ---
    {
      name: 'api-integration',
      testMatch: /.*api\.spec\.ts/, // Matches raw network API validation
      use: {
        // Change the API baseURL if backend relies on entirely different host
        baseURL: process.env.API_BASE_URL || 'https://dummyjson.com'
      }
    }
  ],
});
