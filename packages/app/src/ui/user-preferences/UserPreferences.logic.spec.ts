import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import type { AvailableFileIconTheme } from '#pkg/domain/constants';

import { bootstrap } from '#pkg-playwright/playwright.util';

test.describe('UserPreferences [logic]', () => {
  test('Change of theme should be reflected in global state and persisted storage', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });

    let activeTheme = await page.evaluate(
      () => globalThis.modules.store.getState().userSlice.preferences.activeTheme,
    );
    expect(activeTheme).toEqual('nord');

    const openUserPreferencesButton = await queries.findByRole($document, 'button', {
      name: /Open User Preferences/i,
    });
    await openUserPreferencesButton.click({ force: true });

    const themeRadioGroup = await queries.findByRole($document, 'radiogroup', { name: /Theme/i });
    const switchToCoffeeThemeRadio = await queries.findByRole(themeRadioGroup, 'radio', {
      name: /Coffee/i,
    });
    const switchToFlowThemeRadio = await queries.findByRole(themeRadioGroup, 'radio', {
      name: /Flow/i,
    });

    await switchToFlowThemeRadio.click({ force: true });

    activeTheme = await page.evaluate(
      () => globalThis.modules.store.getState().userSlice.preferences.activeTheme,
    );
    expect(activeTheme).toEqual('flow');
    const newPersistedState1 = await page.evaluate(() =>
      globalThis.modules.persistentStorage.read(),
    );
    expect(newPersistedState1.userState?.preferences.activeTheme).toEqual('flow');

    await switchToCoffeeThemeRadio.click({ force: true });

    activeTheme = await page.evaluate(
      () => globalThis.modules.store.getState().userSlice.preferences.activeTheme,
    );
    expect(activeTheme).toEqual('coffee');
    const newPersistedState2 = await page.evaluate(() =>
      globalThis.modules.persistentStorage.read(),
    );
    expect(newPersistedState2.userState?.preferences.activeTheme).toEqual('coffee');
  });

  test('Change of file icon theme should be reflected in global state and persisted storage', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });

    const vsCodeThemeId: AvailableFileIconTheme = 'vsCode';
    const materialDesignId: AvailableFileIconTheme = 'materialDesign';

    let activeFileIconTheme = await page.evaluate(
      () => globalThis.modules.store.getState().userSlice.preferences.activeFileIconTheme,
    );
    expect(activeFileIconTheme).toEqual(vsCodeThemeId);

    const openUserPreferencesButton = await queries.findByRole($document, 'button', {
      name: /Open User Preferences/i,
    });

    await openUserPreferencesButton.click({ force: true });

    const fileIconsRadioGroup = await queries.findByRole($document, 'radiogroup', {
      name: /File Icons/i,
    });
    const switchToVsCodeFileIconThemeRadio = await queries.findByRole(
      fileIconsRadioGroup,
      'radio',
      { name: /VS Code/i },
    );
    const switchToMDFileIconThemeRadio = await queries.findByRole(fileIconsRadioGroup, 'radio', {
      name: /Material Design/i,
    });

    await switchToMDFileIconThemeRadio.click({ force: true });

    activeFileIconTheme = await page.evaluate(
      () => globalThis.modules.store.getState().userSlice.preferences.activeFileIconTheme,
    );
    expect(activeFileIconTheme).toEqual(materialDesignId);
    const newPersistedState1 = await page.evaluate(() =>
      globalThis.modules.persistentStorage.read(),
    );
    expect(newPersistedState1.userState?.preferences.activeFileIconTheme).toEqual(materialDesignId);

    await switchToVsCodeFileIconThemeRadio.click({ force: true });

    activeFileIconTheme = await page.evaluate(
      () => globalThis.modules.store.getState().userSlice.preferences.activeFileIconTheme,
    );
    expect(activeFileIconTheme).toEqual(vsCodeThemeId);
    const newPersistedState2 = await page.evaluate(() =>
      globalThis.modules.persistentStorage.read(),
    );
    expect(newPersistedState2.userState?.preferences.activeFileIconTheme).toEqual(vsCodeThemeId);
  });
});
