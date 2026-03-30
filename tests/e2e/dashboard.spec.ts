import { test, expect } from '../../src/fixtures/testFixtures';

test.describe('Dashboard Interactions @dashboard', () => {

  test('Validates core dashboard elements load reliably', async ({ dashboardPage }) => {
    // Navigate directly. Because of our global.setup project mapping in playwright.config
    // the UI is already authenticated via auth.json injection!
    await dashboardPage.goto();
    
    // We arrive at Dashboard and verify elements natively
    await dashboardPage.verifyIsOnDashboard();
    
    // Validates data loaded (waits for spinners to clear if any)
    await dashboardPage.verifyDataLoaded();
    
    // Swag Labs statically renders 6 inventory items for standard_user
    await dashboardPage.verifyAnalyticsCount(6); 
  });
});
