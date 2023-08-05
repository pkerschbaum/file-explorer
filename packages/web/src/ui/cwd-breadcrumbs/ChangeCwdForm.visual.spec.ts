import { expect, test } from '@playwright/test';
import { queries } from '@playwright-testing-library/test';

import { bootstrap, retrievePageScreenshot } from '#pkg-playwright/playwright.util';

test.describe('ChangeCwdForm [visual]', () => {
  test('submitting the new directory should only be able if a valid input is given', async ({
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
    const menuItemChangeCwd = await queries.findByRole($document, 'menuitem', {
      name: /change directory/i,
    });
    await menuItemChangeCwd.click();

    expect(await retrievePageScreenshot(page)).toMatchSnapshot('change-cwd-form_1_initial.png');

    const formChangeCwd = await queries.findByRole($document, 'form', {
      name: /change directory form/i,
    });
    const textboxNewDirectory = await queries.findByRole(formChangeCwd, 'textbox', {
      name: /directory/i,
    });
    await textboxNewDirectory.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'change-cwd-form_2_input-is-empty.png',
    );

    await page.keyboard.type('/home/testdir/testfile1.txt');

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'change-cwd-form_3_input-is-no-valid-directory.png',
    );

    await textboxNewDirectory.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.keyboard.type('/home');

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'change-cwd-form_4_input-is-valid-directory.png',
    );
  });
});
