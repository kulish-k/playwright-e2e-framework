import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';

// We isolate this suite intentionally from the global storageState 
// to prove API token generation organically within the specific worker.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Hybrid E2E Interactions @hybrid', () => {

  test('Seamlessly login via external API bypassing UI constraints and validating rendering', async ({ request, context, page }) => {

    // 1. Authenticate via Backend API entirely offline from the UI framework
    // Using a public authentication endpoint as the core API testing mechanism
    const response = await request.post('https://dummyjson.com/auth/login', {
      data: {
        username: 'emilys', 
        password: 'emilyspass',
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Explicit API payload verification asserting authorization integrity
    expect(body).toHaveProperty('accessToken');
    expect(body.username).toBe('emilys');

    // 2. Injecting the raw API credentials natively into the browser thread
    // In a real framework, you map the JWT into the UI's specific cookie/localStorage keys
    await context.addCookies([
      {
        name: 'session-username',
        value: body.username,
        domain: 'www.saucedemo.com',
        path: '/',
      }
    ]);

    // 3. Render the UI Dashboard natively, entirely skipping the /login UI page!
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    
    // 4. Assert UI rendering visually confirms the authorization state success.
    await dashboardPage.verifyIsOnDashboard();
    await dashboardPage.verifyDataLoaded();
  });
});
