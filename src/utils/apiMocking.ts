import { Page, Route } from '@playwright/test';

/**
 * Utility to intercept specific API calls and respond with mock data.
 * Ideal for simulating backend failures or ensuring deterministic test data states without needing a database.
 */
export class ApiMockingHelpers {
  /**
   * Mocks a specific API endpoint cleanly returning static JSON overriding backend
   * @param page Playwright page instance
   * @param urlString Regex or exact string URL to intercept (e.g., '**/api/v1/analytics')
   * @param mockResponse Static JSON object to return
   * @param status HTTP Status code (default 200)
   */
  static async mockApiResponse(page: Page, urlString: string | RegExp, mockResponse: object, status: number = 200) {
    await page.route(urlString, async (route: Route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });
  }

  /**
   * Introduces an artificial delay to test asynchronous/loading states in the UI
   * @param page Playwright page instance
   * @param urlString Regex or string URL to intercept
   * @param delayMs Delay before fulfilling the request in milliseconds
   */
  static async delayApiCall(page: Page, urlString: string | RegExp, delayMs: number = 2000) {
    await page.route(urlString, async (route: Route) => {
      await page.waitForTimeout(delayMs);
      await route.continue();
    });
  }
}
