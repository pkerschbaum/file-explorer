import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import { bootstrap, enableFakeClock } from '@app-playwright/playwright.util';

test.describe('Shell [visual]', () => {
  test('with processes', async ({ page }) => {
    await bootstrap({
      page,
      storybookIdToVisit: 'shell--with-processes',
    });
    expect(await page.screenshot()).toMatchSnapshot('with-processes_1.png');
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

    expect(await page.screenshot()).toMatchSnapshot('trigger-rename_1_after-trigger-of-rename.png');
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

    expect(await page.screenshot()).toMatchSnapshot('open-and-close-sidebar_1_sidebar-open.png');

    const buttonHideUserPreferences = await queries.findByRole($document, 'button', {
      name: /Hide User Preferences/i,
    });
    await buttonHideUserPreferences.click();

    expect(await page.screenshot()).toMatchSnapshot('open-and-close-sidebar_2_sidebar-hidden.png');
  });

  test('switch theme', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
    });

    const buttonOpenUserPreferences = await queries.findByRole($document, 'button', {
      name: /Open User Preferences/i,
    });
    await buttonOpenUserPreferences.click();
    const radiogroupTheme = await queries.findByRole($document, 'radiogroup', { name: /Theme/i });
    const radioThemeFlow = await queries.findByRole(radiogroupTheme, 'radio', { name: /Flow/i });
    await radioThemeFlow.click({ force: true });

    expect(await page.screenshot()).toMatchSnapshot('switch-theme_1_switched-theme.png');
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

    expect(await page.screenshot()).toMatchSnapshot(
      'switch-file-icon-theme_1_switched-file-icon-theme.png',
    );
  });

  test('the CWD should automatically update if a new folder is created', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
    });

    const buttonNewFolder = await queries.findByRole($document, 'button', { name: /New Folder/i });
    await buttonNewFolder.click();
    const textboxNameOfFolder = await queries.findByRole($document, 'textbox', {
      name: /Name of folder/i,
    });
    await textboxNameOfFolder.type('name of new folder');
    const buttonCreateFolder = await queries.findByRole($document, 'button', { name: /Create/i });
    await buttonCreateFolder.click();

    const tableOfResources = await queries.findByRole($document, 'table', {
      name: /Table of resources/i,
    });

    expect(await tableOfResources.screenshot()).toMatchSnapshot(
      'cwd-should-automatically-update_1_folder-created.png',
    );
  });

  test('available shortcuts should be shown depending on pressed modifier keys and current focus', async ({
    page,
  }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--multiple-tabs',
    });

    expect(await page.screenshot()).toMatchSnapshot(
      'shortcuts-should-be-shown_1_no-modifier-keydown_default-shortcuts-should-be-shown.png',
    );

    await page.keyboard.down('Control');
    expect(await page.screenshot()).toMatchSnapshot(
      'shortcuts-should-be-shown_2_ctrl-keydown_ctrl-shortcuts-should-be-shown.png',
    );
    await page.keyboard.up('Control');

    await page.keyboard.down('Alt');
    expect(await page.screenshot()).toMatchSnapshot(
      'shortcuts-should-be-shown_3_alt-keydown_alt-shortcuts-should-be-shown.png',
    );
    await page.keyboard.up('Alt');

    expect(await page.screenshot()).toMatchSnapshot(
      'shortcuts-should-be-shown_4_modifier-released_default-shortcuts-should-be-shown.png',
    );

    const buttonOpen = await queries.findByRole($document, 'button', { name: /^Open$/i });
    await buttonOpen.focus();
    expect(await page.screenshot()).toMatchSnapshot(
      'shortcuts-should-be-shown_5_focus-present_no-shortcuts-should-be-shown.png',
    );
  });

  test('ctrl+c should trigger copy action', async ({ page }) => {
    await bootstrap({
      page,
      storybookIdToVisit: 'shell--multiple-tabs',
    });

    await page.keyboard.press('Control+c');
    expect(await page.screenshot()).toMatchSnapshot('ctrl-c-should-copy_1_ctrl-and-c-pressed.png');
  });

  test.describe('tests with manual clock', () => {
    // control time to be able to invoke the debounce of the filter input manually
    test.beforeEach(enableFakeClock);

    test('filter files', async ({ page }) => {
      const $document = await bootstrap({
        page,
        storybookIdToVisit: 'shell--simple-case',
      });

      const textboxFilter = await queries.findByRole($document, 'textbox', { name: /Filter/i });
      await textboxFilter.type('testf');
      // invoke debounce of filter input and "yield" to browser via wait of 1ms
      await page.evaluate(() => window.__clock.tick(1000));
      await page.evaluate(() => window.__clock.tick(1000));
      await page.waitForTimeout(1);

      expect(await page.screenshot()).toMatchSnapshot(
        'filter-files_1_after-first-filter-input.png',
      );

      await textboxFilter.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await page.keyboard.type('aa test');
      // invoke debounce of filter input and "yield" to browser via wait of 1ms
      await page.evaluate(() => window.__clock.tick(1000));
      await page.evaluate(() => window.__clock.tick(1000));
      await page.waitForTimeout(200);

      expect(await page.screenshot()).toMatchSnapshot(
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
      // invoke debounce of filter input and "yield" to browser via wait of 1ms
      await page.evaluate(() => window.__clock.tick(1000));
      await page.waitForTimeout(1);
      await page.keyboard.press('ArrowDown');
      expect(await page.screenshot()).toMatchSnapshot(
        'navigating-down-and-up-should-restore-state_1_filter-and-selection-was-applied.png',
      );

      await page.keyboard.press('Enter');
      expect(await page.screenshot()).toMatchSnapshot(
        'navigating-down-and-up-should-restore-state_2_navigated-down.png',
      );

      await page.keyboard.press('Alt+ArrowLeft');
      // invoke debounce of filter input and "yield" to browser via wait of 1ms
      await page.evaluate(() => window.__clock.tick(1000));
      await page.waitForTimeout(1);
      expect(await page.screenshot()).toMatchSnapshot(
        'navigating-down-and-up-should-restore-state_3_navigated-up-and-restored-state.png',
      );
    });
  });
});
