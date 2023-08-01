import { expect, test } from '@playwright/test';
import { queries } from '@playwright-testing-library/test';

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
      name: /open user preferences/i,
    });
    await openUserPreferencesButton.click({ force: true });

    const themeRadioGroup = await queries.findByRole($document, 'radiogroup', { name: /theme/i });
    const switchToCoffeeThemeRadio = await queries.findByRole(themeRadioGroup, 'radio', {
      name: /coffee/i,
    });
    const switchToFlowThemeRadio = await queries.findByRole(themeRadioGroup, 'radio', {
      name: /flow/i,
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
      name: /open user preferences/i,
    });

    await openUserPreferencesButton.click({ force: true });

    const fileIconsRadioGroup = await queries.findByRole($document, 'radiogroup', {
      name: /file icons/i,
    });
    const switchToVsCodeFileIconThemeRadio = await queries.findByRole(
      fileIconsRadioGroup,
      'radio',
      { name: /vs code/i },
    );
    const switchToMDFileIconThemeRadio = await queries.findByRole(fileIconsRadioGroup, 'radio', {
      name: /material design/i,
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
