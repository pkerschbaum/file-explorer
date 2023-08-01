import { expect, test } from '@playwright/test';

import { bootstrap, retrievePageScreenshot } from '#pkg-playwright/playwright.util';

test.describe('ResourcesGallery [visual]', () => {
  test('Default Case', async ({ page }) => {
    await bootstrap({
      page,
      storybookIdToVisit: 'resourcesgallery--default-case',
    });
    expect(await retrievePageScreenshot(page)).toMatchSnapshot('default-case_1.png');
  });
});
