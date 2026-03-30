import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the specified path.
   * If URL is not provided, navigates to the base URL configured in playwright setup.
   * @param path Path to navigate.
   */
  async navigate(path: string = '/') {
    await this.page.goto(path);
  }

  /**
   * Ensure page is fully loaded by waiting for network idle.
   * Useful for heavy SPA applications.
   */
  async waitForLoadState() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Helper to get an element by data-testid.
   * @param testId The test ID of the element
   */
  getElementByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }
}
