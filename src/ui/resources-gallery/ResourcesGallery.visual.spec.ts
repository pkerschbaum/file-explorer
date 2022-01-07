import { expect, test } from '@playwright/test';

import { bootstrap } from '@app-playwright/playwright.util';

test.describe('ResourcesGallery [visual]', () => {
  test('Default Case', async ({ page }) => {
    await bootstrap({
      page,
      storybookIdToVisit: 'resourcesgallery--default-case',
    });
    expect(await page.screenshot()).toMatchSnapshot('default-case_1.png');
  });
});
