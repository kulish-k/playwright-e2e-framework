import { test, expect } from '@playwright/test';

test.describe('Advanced AI-Ready Features: Network Interception @advanced', () => {

  test('Mocks API responses seamlessly manipulating strict frontend state', async ({ page }) => {
    // 1. We define a strict mock payload mimicking what AI or backend engineers might generate
    const mockedUserPayload = {
      users: [
        { id: 1, firstName: 'QA', lastName: 'Architect', age: 99, email: 'mocked@enterprise.com' }
      ],
      total: 1,
      skip: 0,
      limit: 1
    };

    // 2. Playwright Network Interception blocks real traffic and injects our custom JSON
    await page.route('**/users', async route => {
      // Allows verifying network boundaries entirely offline
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedUserPayload),
      });
    });

    // 3. We load a UI that attempts to fetch from that endpoint.
    // For this example, we literally intercept the raw browser fetching engine natively.
    await page.goto('about:blank'); // Safely isolated
    
    // Natively fetching in the exact browser context triggering our interceptor!
    const result = await page.evaluate(async () => {
      const response = await fetch('https://dummyjson.com/users');
      return await response.json();
    });

    // 4. Assertion - Proves the Frontend receives the mocked payload securely
    expect(result.users[0].firstName).toBe('QA');
    expect(result.users[0].email).toContain('mocked');
  });

  test('Blocks expensive analytics or images speeding up parallel test layers', async ({ page }) => {
    // Intercepts all traffic matching PNG/JPG and aborts it.
    // This is purely for demonstrating advanced optimization techniques (saves massive bandwidth down).
    await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

    // Navigating natively - Images will visibly break safely
    await page.goto('https://www.saucedemo.com');
    
    // UI remains testable 
    const loginButton = page.locator('[data-test="login-button"]');
    await expect(loginButton).toBeVisible();
  });
});
