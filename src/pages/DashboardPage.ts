import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly pageTitle: Locator;
  readonly dataTableRows: Locator;
  readonly shoppingCart: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByTestId('title');
    this.dataTableRows = page.getByTestId('inventory-item');
    this.shoppingCart = page.getByTestId('shopping-cart-link');
  }

  async goto() {
    await this.navigate('/inventory.html');
  }

  async verifyIsOnDashboard() {
    await expect(this.page).toHaveURL(/.*\/inventory.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.shoppingCart).toBeVisible();
  }

  async verifyDataLoaded() {
    await expect(this.dataTableRows.first()).toBeVisible({ timeout: 15000 });
  }

  async verifyAnalyticsCount(expectedRows: number) {
    await expect(this.dataTableRows).toHaveCount(expectedRows);
  }
}
