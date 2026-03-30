import { Page, Locator, expect } from '@playwright/test';

/**
 * Reusable Component Object Model (COM) representing a generic modal dialog.
 * Can be instantiated globally or within specific Page Objects.
 */
export class ModalComponent {
  readonly page: Page;
  readonly modalContainer: Locator;
  readonly closeButton: Locator;
  readonly titleElement: Locator;

  constructor(page: Page) {
    this.page = page;
    // A11y role mapping for modal isolation
    // Most SaaS components use [role="dialog"] for modals
    this.modalContainer = page.getByRole('dialog');
    
    // Scoped inside the modal container to avoid clicking wrong close buttons externally
    this.closeButton = this.modalContainer.getByRole('button', { name: /close|x/i });
    this.titleElement = this.modalContainer.getByRole('heading').first();
  }

  /**
   * Waits for the modal to fully render and stabilize structurally.
   */
  async waitForRender() {
    await this.modalContainer.waitFor({ state: 'visible', timeout: 5000 });
    // Ensures modal animation completes dynamically before proceeding
    await expect(this.modalContainer).toBeVisible();
  }

  /**
   * Fetches the structural heading inside the dialog.
   */
  async getTitleText(): Promise<string> {
    await this.waitForRender();
    return await this.titleElement.innerText();
  }

  /**
   * Accepts/Closes the modal generically based on standard A11y layouts
   */
  async dismiss() {
    await this.closeButton.click();
    await this.modalContainer.waitFor({ state: 'hidden' });
  }
}
