import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavbarComponent } from '../components/NavbarComponent';

export class DashboardPage extends BasePage {
  readonly pageTitle: Locator;
  readonly dataTableRows: Locator;
  public readonly navbar: NavbarComponent; // COM pattern implementation

  constructor(page: Page) {
    super(page);
    // Prefer A11y role attributes where possible over generic IDs.
    this.pageTitle = page.getByText('Products', { exact: true });
    
    // Inventory items structurally act like lists/articles in standard semantic HTML
    // However, SauceDemo's DOM uses simple 'inventory_item' classes. Let's use getByTestId or role
    this.dataTableRows = page.getByTestId('inventory-item');
    
    // Component injection preventing method bloat on global page
    this.navbar = new NavbarComponent(page);
  }

  async goto() {
    await this.navigate('/inventory.html');
  }

  async verifyIsOnDashboard() {
    await expect(this.page).toHaveURL(/.*\/inventory.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.navbar.shoppingCartButton).toBeVisible();
  }

  async verifyDataLoaded() {
    // Uses expect with custom timeout natively instead of brittle hard waits or custom sleep
    await expect(this.dataTableRows.first()).toBeVisible({ timeout: 15000 });
  }

  async verifyAnalyticsCount(expectedRows: number) {
    await expect(this.dataTableRows).toHaveCount(expectedRows);
  }
}
