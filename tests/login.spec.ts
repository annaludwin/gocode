import * as fs from 'fs';
import * as path from 'path';
import { expect, test } from '../fixtures/test.fixtures';

const usersPath = path.join(__dirname, '..', 'test-data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8')) as {
  validUser: { username: string; password: string };
};

test.describe('Login (FashionHub)', () => {
  test('valid user sees welcome message with username', async ({ page, loginPage, accountPage }) => {
    const { username, password } = users.validUser;

    await loginPage.open();
    await loginPage.expectOnLoginPage();

    await loginPage.login(username, password);

    await expect(page).toHaveURL(/account\.html/i);
    await accountPage.expectWelcomeMessageContainsUsername(username);
  });
});
