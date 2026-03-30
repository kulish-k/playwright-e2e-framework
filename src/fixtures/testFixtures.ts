import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type CustomTestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  testUser: { email: string; pass: string };
};

export const test = baseTest.extend<CustomTestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  testUser: async ({}, use) => {
    const user = {
      email: process.env.TEST_USER_EMAIL || 'standard_user',
      pass: process.env.TEST_USER_PASS || 'secret_sauce'
    };
    await use(user);
  }
});

export { expect } from '@playwright/test';
