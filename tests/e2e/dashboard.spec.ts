import { test, expect } from '../../src/fixtures/testFixtures';

test.describe('Dashboard Interactions @dashboard', () => {

  test.beforeEach(async ({ loginPage, testUser }) => {
    // Standard setup: Pre-authenticate seamlessly before testing Dashboard
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.pass);
  });

  test('Validates core dashboard elements load reliably', async ({ dashboardPage }) => {
    // We already arrive at Dashboard via the beforeEach redirect
    await dashboardPage.verifyIsOnDashboard();
    
    // Validates data loaded (waits for spinners to clear if any)
    await dashboardPage.verifyDataLoaded();
    
    // Swag Labs statically renders 6 inventory items for standard_user
    await dashboardPage.verifyAnalyticsCount(6); 
  });
});
