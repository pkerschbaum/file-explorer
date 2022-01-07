import { getDocument } from '@playwright-testing-library/test';
import { expect, PlaywrightTestArgs } from '@playwright/test';

export async function bootstrap({
  page,
  storybookIdToVisit,
}: {
  page: PlaywrightTestArgs['page'];
  storybookIdToVisit: string;
}) {
  await page.goto(
    `http://localhost:6006/iframe.html?viewMode=story&args=&id=${storybookIdToVisit}`,
  );
  const rootContainer = page.locator('#root > *');
  await expect(rootContainer).toHaveCount(1);
  const $document = await getDocument(page);
  return $document;
}

export function getTestTitle(): string {
  // TODO
  return '';
}
