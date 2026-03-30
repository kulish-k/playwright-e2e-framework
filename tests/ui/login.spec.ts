import { test, expect } from '../../src/fixtures/testFixtures';

test.describe('Authentication Flows @auth @smoke', () => {

  // For verifying raw login capabilities, we forcibly isolate this suite 
  // from the globally cached authentication state populated by `global.setup`.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Successful log in redirects to dashboard', async ({ loginPage, testData, page }) => {
    // Navigate via POM providing deterministic assertions
    await loginPage.login(testData.roles.standard.username, testData.roles.standard.password);
    await expect(page).toHaveURL(/.*\/inventory.html/);
  });

  test('Displays validation error for incorrect credentials', async ({ loginPage, testData }) => {
    await loginPage.login(testData.roles.standard.username, 'WrongPassword123!');
    await loginPage.verifyErrorDisplayed('Epic sadface: Username and password do not match any user in this service');
  });
});
