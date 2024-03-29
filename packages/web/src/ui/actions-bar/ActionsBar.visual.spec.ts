import { expect, test } from '@playwright/test';
import { queries } from '@playwright-testing-library/test';

import { bootstrap, retrieveScreenshot } from '#pkg-playwright/playwright.util';

test.describe('ActionsBar [visual]', () => {
  test('given an error on an attempt to rename a resource, a snackbar should be shown', async ({
    page,
  }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'explorerpanel--errors-on-create-folder-and-move',
    });

    const rowTestfile1 = await queries.findByRole($document, 'row', { name: /testfile1.txt/i });
    await rowTestfile1.click();
    const buttonRename = await queries.findByRole($document, 'button', { name: /rename/i });
    await buttonRename.click();
    const textboxRename = await queries.findByRole($document, 'textbox', {
      name: /new name for resource/i,
    });
    await textboxRename.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.keyboard.type('new-name.txt');
    const buttonOk = await queries.findByRole($document, 'button', { name: /ok/i });
    await buttonOk.click();

    expect(await retrieveScreenshot(page)).toMatchSnapshot(
      'rename-resource-error_1_snackbar-should-be-shown.png',
    );
  });

  test('given an error on an attempt to create a folder, a snackbar should be shown', async ({
    page,
  }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'explorerpanel--errors-on-create-folder-and-move',
    });

    const buttonNewFolder = await queries.findByRole($document, 'button', {
      name: /new folder/i,
    });
    await buttonNewFolder.click();
    const textboxNameOfFolder = await queries.findByRole($document, 'textbox', {
      name: /name of folder/i,
    });
    await textboxNameOfFolder.type('name of new folder');
    const buttonCreateFolder = await queries.findByRole($document, 'button', { name: /create/i });
    await buttonCreateFolder.click();

    expect(await retrieveScreenshot(page)).toMatchSnapshot(
      'create-folder-error_1_snackbar-should-be-shown.png',
    );
  });

  test('given an error on an attempt to open the selected file, a snackbar should be shown', async ({
    page,
  }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'explorerpanel--errors-on-create-folder-and-move',
    });

    const rowTestfile1 = await queries.findByRole($document, 'row', { name: /testfile1.txt/i });
    await rowTestfile1.click();
    const buttonOpen = await queries.findByRole($document, 'button', {
      name: /open/i,
    });
    await buttonOpen.click();

    expect(await retrieveScreenshot(page)).toMatchSnapshot(
      'open-selected-file-error_1_snackbar-should-be-shown.png',
    );
  });
});
