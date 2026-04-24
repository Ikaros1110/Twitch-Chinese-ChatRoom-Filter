import { test, expect } from '@playwright/test';

test('warning messages require hold feedback while safe messages send normally', async ({ page }) => {
  await page.goto('/');

  const input = page.getByLabel('Chat message');
  await input.fill('What????');
  await expect(page.getByText('Rule: Repeated Punctuation')).toBeVisible();
  await expect(page.getByText(/Hold Enter/)).toBeVisible();

  await input.fill('hello');
  await expect(page.getByText('Repeated Punctuation')).toHaveCount(0);
});
