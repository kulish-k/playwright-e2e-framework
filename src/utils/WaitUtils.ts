import { Locator, expect } from '@playwright/test';

/**
 * Enterprise Utility Class for handling highly asynchronous or unpredictable DOM states.
 * Eliminates the need for 'waitForTimeout' sleeps native in Junior frameworks.
 */
export class WaitUtils {

  /**
   * Intelligently polls an element's text property continuously until it definitively matches an expected condition.
   * Superior to hard waits because the promise resolves the EXACT millisecond the element reacts.
   * Use cases: A price badge that updates after a complex XHR recalculation.
   */
  static async waitForDynamicTextEquality(locator: Locator, expectedText: string, timeoutMs: number = 10000) {
    // Playwright `expect.poll` executes the inner function constantly 
    await expect.poll(async () => {
      return await locator.innerText();
    }, { timeout: timeoutMs }).toEqual(expectedText);
  }

  /**
   * Evaluates complex attributes strictly before a user action.
   * E.g. Waiting explicitly for an `aria-disabled="false"` attribute to map before clicking.
   */
  static async waitForInteractionReady(locator: Locator, timeoutMs: number = 8000) {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
    
    // Check if there is an artificial disabling layer (Custom framework level UI blocking)
    await expect(locator).not.toHaveAttribute('aria-disabled', 'true', { timeout: timeoutMs });
    await expect(locator).toBeEnabled({ timeout: timeoutMs });
  }

}
