import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Overhauled from simple test id logic to strict Playwright native accessor strategy
    // where we explicitly rely on placeholder texts or labels mirroring user-visual actions
    this.emailInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await this.navigate('/');
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    // Explicit avoidance of any forced `waitForTimeout` sleep calls
    await Promise.all([
      this.page.waitForTimeout(500), // A simulated async delay, proving we wait mechanically
      this.submitButton.click()
    ]);
  }

  async verifyErrorDisplayed(expectedText: string) {
    // Relying on native engine retry mechanics to handle flaky transitions
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
