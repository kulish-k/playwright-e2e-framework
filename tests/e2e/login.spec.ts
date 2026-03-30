import { test, expect } from '../../src/fixtures/testFixtures';

test.describe('Authentication Flows @auth', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Successful log in redirects to dashboard', async ({ loginPage, testUser, page }) => {
    // Navigate via POM providing deterministic assertions
    await loginPage.login(testUser.email, testUser.pass);
    await expect(page).toHaveURL(/.*\/inventory.html/);
  });

  test('Displays validation error for incorrect credentials', async ({ loginPage, testUser }) => {
    await loginPage.login(testUser.email, 'WrongPassword123!');
    await loginPage.verifyErrorDisplayed('Epic sadface: Username and password do not match any user in this service');
  });
});
