import { test as setup, expect } from '@playwright/test';

// Define explicit paths for multi-role session caches
const userAuthFile = 'src/setup/userStorageState.json';
const adminAuthFile = 'src/setup/adminStorageState.json';

setup('authenticate multi-role global state', async ({ page }) => {

  // 1. Authenticate Standard User
  const userEmail = process.env.TEST_USER_EMAIL || 'standard_user';
  const pass = process.env.TEST_USER_PASS || 'secret_sauce';

  await page.goto('/');
  await page.getByTestId('username').fill(userEmail);
  await page.getByTestId('password').fill(pass);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/.*\/inventory.html/);
  
  // Store the standard user session context 
  await page.context().storageState({ path: userAuthFile });

  // Clear context natively to prepare for the second role
  await page.context().clearCookies();
  
  // 2. Authenticate Admin User (using a distinct persona for the framework showcase)
  const adminEmail = process.env.TEST_ADMIN_EMAIL || 'problem_user'; // Mocking admin persona via SwagLabs

  await page.goto('/');
  await page.getByTestId('username').fill(adminEmail);
  await page.getByTestId('password').fill(pass);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/.*\/inventory.html/);

  // Store the admin user session context
  await page.context().storageState({ path: adminAuthFile });
});
