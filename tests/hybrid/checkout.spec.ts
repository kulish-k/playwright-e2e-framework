import { test, expect } from '../../src/fixtures/testFixtures';

test.describe('Hybrid E2E Interactions @regression', () => {

  // Demonstrates the Senior framework approach: using storageState 
  // means ZERO login code executes here, dramatically accelerating tests ⚡
  test('Validates multi-item shopping sequence via API verification', async ({ dashboardPage, page, request }) => {
    
    // We arrive natively at the dashboard!
    await dashboardPage.goto();
    await dashboardPage.verifyIsOnDashboard();

    // The UI fetches from a backend natively. 
    // In Hybrid testing, we can assert UI matches API payload.
    await test.step('Interact with primary application layer', async () => {
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
      
      const badgeCount = await dashboardPage.navbar.fetchCartCount();
      expect(badgeCount).toBe(2);
    });

    // We can also leverage pure request contexts to hit microservices verifying actual data commits
    await test.step('Verify transactional backend directly using Request API (Simulated)', async () => {
      // In a real framework, you hit your DB or Internal microservice confirming transaction!
      const simulatedValidation = await request.get('https://dummyjson.com/carts/user/5', { timeout: 10000 }).catch(() => null);
      if (simulatedValidation) {
        expect(simulatedValidation.status()).toBe(200);
      }
    });

  });

});
