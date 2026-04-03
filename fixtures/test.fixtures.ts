import { test as base } from '@playwright/test';
import { AccountPage } from '../src/pages/account.page';
import { LoginPage } from '../src/pages/login.page';

type Fixtures = {
  loginPage: LoginPage;
  accountPage: AccountPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
});

export { expect } from '@playwright/test';
