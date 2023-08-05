import { expect, test } from '@playwright/test';
import { queries } from '@playwright-testing-library/test';

import { network } from '@file-explorer/code-oss-ecma/network';
import { resources } from '@file-explorer/code-oss-ecma/resources';
import { URI } from '@file-explorer/code-oss-ecma/uri';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';

import { bootstrap } from '#pkg-playwright/playwright.util';

test.describe('CwdBreadcrumbs [logic]', () => {
  test('ActionsMenu - click on "Copy Directory Path" should put the CWD path into the clipboard', async ({
    page,
  }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
    });

    const navBreadcrumbs = await queries.findByRole($document, 'navigation', {
      name: /breadcrumbs/i,
    });
    const buttonActionsMenuTrigger = await queries.findByRole(navBreadcrumbs, 'link', {
      name: /testdir/i,
    });
    await buttonActionsMenuTrigger.click();
    const menuItemCopyCwd = await queries.findByRole($document, 'menuitem', {
      name: /copy directory path/i,
    });
    await menuItemCopyCwd.click();

    // assert clipboard
    const textInClipboard = await page.evaluate(() =>
      globalThis.modules.nativeHost.clipboard.readText(),
    );
    const actualUri = uriHelper.parseUri(network.Schemas.file, textInClipboard);
    const expectedUri = uriHelper.parseUri(network.Schemas.file, '/home/testdir');
    try {
      expect(resources.isEqual(actualUri, expectedUri)).toBeTruthy();
    } catch {
      throw new Error(
        `ActualUri is not equal to ExpectedUri! ` +
          `actualUri=${URI.toString(actualUri)}, expectedUri=${URI.toString(expectedUri)}`,
      );
    }
  });
});
