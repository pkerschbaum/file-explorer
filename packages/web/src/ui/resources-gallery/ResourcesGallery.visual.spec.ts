import { expect, test } from '@playwright/test';

import { bootstrap, retrieveScreenshot } from '#pkg-playwright/playwright.util';

test.describe('ResourcesGallery [visual]', () => {
  test('Default Case', async ({ page }) => {
    await bootstrap({
      page,
      storybookIdToVisit: 'resourcesgallery--default-case',
    });
    expect(await retrieveScreenshot(page)).toMatchSnapshot('default-case_1.png');
  });
});
