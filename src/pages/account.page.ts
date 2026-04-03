import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectWelcomeMessageContainsUsername(username: string): Promise<void> {
    const name = new RegExp(`Welcome,?\\s*${escapeRegExp(username)}`, 'i');
    await expect(this.page.getByRole('heading', { name })).toBeVisible();
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
