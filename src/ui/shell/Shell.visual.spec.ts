import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import {
  bootstrap,
  enableFakeClock,
  letBrowserUpdateStuffDependingOnClock,
  retrievePageScreenshot,
  waitForAnimations,
} from '@app-playwright/playwright.util';

test.describe('Shell [visual]', () => {
  test('with processes', async ({ page }) => {
    await bootstrap({
      page,
      storybookIdToVisit: 'shell--with-processes',
    });
    expect(await retrievePageScreenshot(page)).toMatchSnapshot('with-processes_1.png');
  });

  test('trigger rename', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
    });

    const rowTestfile2 = await queries.findByRole($document, 'row', { name: /testfile2.docx/i });
    await rowTestfile2.click();
    const buttonRename = await queries.findByRole($document, 'button', { name: /Rename/i });
    await buttonRename.click();

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'trigger-rename_1_after-trigger-of-rename.png',
    );
  });

  test('open and close sidebar', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
    });

    const buttonOpenUserPreferences = await queries.findByRole($document, 'button', {
      name: /Open User Preferences/i,
    });
    await buttonOpenUserPreferences.click();

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'open-and-close-sidebar_1_sidebar-open.png',
    );

    const buttonDismissUserPreferences = await queries.findByRole($document, 'button', {
      name: /Dismiss/i,
    });
    await buttonDismissUserPreferences.click({ force: true });

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'open-and-close-sidebar_2_sidebar-hidden.png',
    );
  });

  test('switch theme', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
      enableAnimationsObserver: true,
    });

    const buttonOpenUserPreferences = await queries.findByRole($document, 'button', {
      name: /Open User Preferences/i,
    });
    await buttonOpenUserPreferences.click();
    const radiogroupTheme = await queries.findByRole($document, 'radiogroup', { name: /Theme/i });
    const radioThemeFlow = await queries.findByRole(radiogroupTheme, 'radio', { name: /Flow/i });
    await radioThemeFlow.click({ force: true });

    // the change of the foreground color (because of the theme change) needs some time to propagate (in Chrome)
    await waitForAnimations({ page });

    expect(await retrievePageScreenshot(page)).toMatchSnapshot('switch-theme_1_switched-theme.png');
  });

  test('switch file icon theme', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
    });

    const buttonOpenUserPreferences = await queries.findByRole($document, 'button', {
      name: /Open User Preferences/i,
    });
    await buttonOpenUserPreferences.click();
    const radiogroupFileIcons = await queries.findByRole($document, 'radiogroup', {
      name: /File Icons/i,
    });
    const radioIconsMaterialDesign = await queries.findByRole(radiogroupFileIcons, 'radio', {
      name: /Material Design/i,
    });
    await Promise.all([
      radioIconsMaterialDesign.click({ force: true }),
      page.waitForResponse(/icons\/folder\.svg/i),
    ]);

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'switch-file-icon-theme_1_switched-file-icon-theme.png',
    );
  });

  test('available shortcuts should be shown depending on pressed modifier keys and current focus', async ({
    page,
  }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--multiple-tabs',
    });

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'shortcuts-should-be-shown_1_no-modifier-keydown_default-shortcuts-should-be-shown.png',
    );

    await page.keyboard.down('Control');
    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'shortcuts-should-be-shown_2_ctrl-keydown_ctrl-shortcuts-should-be-shown.png',
    );
    await page.keyboard.up('Control');

    await page.keyboard.down('Alt');
    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'shortcuts-should-be-shown_3_alt-keydown_alt-shortcuts-should-be-shown.png',
    );
    await page.keyboard.up('Alt');

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'shortcuts-should-be-shown_4_modifier-released_default-shortcuts-should-be-shown.png',
    );

    const buttonOpen = await queries.findByRole($document, 'button', { name: /^Open$/i });
    await buttonOpen.focus();
    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'shortcuts-should-be-shown_5_focus-present_no-shortcuts-should-be-shown.png',
    );
  });

  test('ctrl+c should trigger copy action', async ({ page }) => {
    await bootstrap({
      page,
      storybookIdToVisit: 'shell--multiple-tabs',
      enableAnimationsObserver: true,
    });

    await page.keyboard.press('Control+c');
    // the change of the paste button icon color needs some time to propagate (in Chrome)
    await waitForAnimations({ page });

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'ctrl-c-should-copy_1_ctrl-and-c-pressed.png',
    );
  });

  test.describe('tests with manual clock', () => {
    // control time to be able to invoke the debounce of the filter input manually
    test.beforeEach(enableFakeClock);

    test('the CWD should automatically update if a new folder is created', async ({ page }) => {
      /**
       * this test case uses a fake clock because otherwise, the newly created folder would get
       * another timestamp in each test run
       */

      const $document = await bootstrap({
        page,
        storybookIdToVisit: 'shell--simple-case',
      });

      const buttonNewFolder = await queries.findByRole($document, 'button', {
        name: /New Folder/i,
      });
      await buttonNewFolder.click();
      const textboxNameOfFolder = await queries.findByRole($document, 'textbox', {
        name: /Name of folder/i,
      });
      await textboxNameOfFolder.type('name of new folder');
      const buttonCreateFolder = await queries.findByRole($document, 'button', { name: /Create/i });
      await buttonCreateFolder.click();

      await letBrowserUpdateStuffDependingOnClock(page);

      expect(await retrievePageScreenshot(page)).toMatchSnapshot(
        'cwd-should-automatically-update_1_folder-created.png',
      );
    });

    test('filter files', async ({ page }) => {
      const $document = await bootstrap({
        page,
        storybookIdToVisit: 'shell--simple-case',
      });

      const textboxFilter = await queries.findByRole($document, 'textbox', { name: /Filter/i });
      await textboxFilter.type('testf');
      // invoke debounce of filter input
      await letBrowserUpdateStuffDependingOnClock(page);

      expect(await retrievePageScreenshot(page)).toMatchSnapshot(
        'filter-files_1_after-first-filter-input.png',
      );

      await textboxFilter.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await page.keyboard.type('aa test');
      // invoke debounce of filter input
      await letBrowserUpdateStuffDependingOnClock(page);

      expect(await retrievePageScreenshot(page)).toMatchSnapshot(
        'filter-files_2_after-second-filter-input.png',
      );
    });

    test('navigating down and up the file system should restore resources view state (filter, selection, ...)', async ({
      page,
    }) => {
      const $document = await bootstrap({
        page,
        storybookIdToVisit: 'shell--simple-case',
      });

      const textboxFilter = await queries.findByRole($document, 'textbox', { name: /Filter/i });
      await textboxFilter.type('test folder');
      // invoke debounce of filter input
      await letBrowserUpdateStuffDependingOnClock(page);
      await page.keyboard.press('ArrowDown');
      expect(await retrievePageScreenshot(page)).toMatchSnapshot(
        'navigating-down-and-up-should-restore-state_1_filter-and-selection-was-applied.png',
      );

      await page.keyboard.press('Enter');
      expect(await retrievePageScreenshot(page)).toMatchSnapshot(
        'navigating-down-and-up-should-restore-state_2_navigated-down.png',
      );

      await page.keyboard.press('Alt+ArrowLeft');
      // invoke debounce of filter input
      await letBrowserUpdateStuffDependingOnClock(page);

      expect(await retrievePageScreenshot(page)).toMatchSnapshot(
        'navigating-down-and-up-should-restore-state_3_navigated-up-and-restored-state.png',
      );
    });
  });

  test('actions menu should show after click on breadcrumb and hide after "Copy Directory Path" menu item was clicked on', async ({
    page,
  }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
    });

    const navBreadcrumbs = await queries.findByRole($document, 'navigation', {
      name: /Breadcrumbs/i,
    });
    const buttonActionsMenuTrigger = await queries.findByRole(navBreadcrumbs, 'link', {
      name: /testdir/i,
    });
    await buttonActionsMenuTrigger.click();

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'actions-menu-copy-directory-path_1_after-click-on-trigger-button.png',
    );

    const menuItemCopyCwd = await queries.findByRole($document, 'menuitem', {
      name: /Copy Directory Path/i,
    });
    await menuItemCopyCwd.click();

    expect(await retrievePageScreenshot(page)).toMatchSnapshot(
      'actions-menu-copy-directory-path_2_after-click-on-menu-item.png',
    );
  });
});
