import { Page, Locator, expect } from '@playwright/test';

/**
 * Reusable Component Object Model (COM) representing the top navigation bar.
 * Injected selectively into Page Objects to prevent duplication.
 */
export class NavbarComponent {
  readonly page: Page;
  readonly shoppingCartButton: Locator;
  readonly defaultMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using native test IDs where A11y roles are absent (swaglabs cart lacks aria-labels)
    this.shoppingCartButton = page.getByTestId('shopping-cart-link');
    this.defaultMenuButton = page.getByRole('button', { name: 'Open Menu' });
  }

  async navigateToCart() {
    await this.shoppingCartButton.waitFor({ state: 'visible' });
    await this.shoppingCartButton.click();
  }

  async fetchCartCount(): Promise<number> {
    const badge = this.shoppingCartButton.locator('.shopping_cart_badge');
    if (await badge.isVisible()) {
      const text = await badge.innerText();
      return parseInt(text, 10);
    }
    return 0;
  }
}
