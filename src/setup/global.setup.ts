import { test as setup, expect } from '@playwright/test';

// Use a distinct auth file for holding session state
const authFile = 'src/setup/auth.json';

setup('authenticate global state', async ({ page }) => {
  // We mock environmental credentials. In real enterprise frameworks this comes from AWS Secrets or Vault.
  const email = process.env.TEST_USER_EMAIL || 'standard_user';
  const pass = process.env.TEST_USER_PASS || 'secret_sauce';

  await page.goto('/');

  // Adhere strictly to dynamic A11Y selectors (getByTestId, getByRole, getByLabel)
  // SauceDemo primarily supports data-test natively.
  await page.getByTestId('username').fill(email);
  await page.getByTestId('password').fill(pass);
  await page.getByTestId('login-button').click();

  // Validate authentication was highly successful before saving state
  await expect(page).toHaveURL(/.*\/inventory.html/);
  
  // Store the browser session context dynamically
  await page.context().storageState({ path: authFile });
});
