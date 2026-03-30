import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import usersData from '../data/users.json';

// Advanced fixture definition injecting parsed JSON roles natively
type CustomTestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  testData: typeof usersData;
};

export const test = baseTest.extend<CustomTestFixtures>({
  
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  testData: async ({}, use: (r: typeof usersData) => Promise<void>) => {
    // Injects static data securely into the test execution context without polluting the spec file
    await use(usersData);
  }
});

export { expect } from '@playwright/test';
