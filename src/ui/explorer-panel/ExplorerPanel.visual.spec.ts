import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import { bootstrap } from '@app-playwright/playwright.util';

test.describe('ExplorerPanel [visual]', () => {
  test('Default Case', async ({ page }) => {
    await bootstrap({
      page,
      storybookIdToVisit: 'explorerpanel--default-case',
    });
    expect(await page.screenshot()).toMatchSnapshot('default-case_1.png');
  });

  test('Rename resource', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'explorerpanel--default-case',
    });

    const rowTestfile1 = await queries.findByRole($document, 'row', { name: /testfile1.txt/i });
    await rowTestfile1.click();
    const buttonRename = await queries.findByRole($document, 'button', { name: /Rename/i });
    await buttonRename.click();

    expect(await page.screenshot()).toMatchSnapshot('rename-resource_1.png');

    const textboxRename = await queries.findByRole($document, 'textbox', {
      name: /new name for resource/i,
    });
    await textboxRename.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.keyboard.type('new-name.txt');
    const buttonOk = await queries.findByRole($document, 'button', { name: /OK/i });
    await buttonOk.click();

    expect(await page.screenshot()).toMatchSnapshot('rename-resource_2.png');
  });
});
