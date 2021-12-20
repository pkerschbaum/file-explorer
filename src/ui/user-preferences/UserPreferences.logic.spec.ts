import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AvailableFileIconTheme } from '@app/constants';
import { createStoreInstance } from '@app/global-state/store';
import { storeRef } from '@app/operations/global-modules';
import { readStorageState } from '@app/operations/storage-state.operations';
import { createQueryClient } from '@app/ui/Globals';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';
import { renderApp } from '@app-test/utils/render-app';

describe('UserPreferences [logic]', () => {
  it('Change of theme should be reflected in global state and persisted storage', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    expect(storeRef.current.getState().userSlice.preferences.activeTheme).toEqual('nord');

    const openUserPreferencesButton = await screen.findByRole('button', {
      name: /Open User Preferences/i,
    });

    userEvent.click(openUserPreferencesButton);

    const themeRadioGroup = await screen.findByRole('radiogroup', { name: /Theme/i });
    const switchToCoffeeThemeRadio = await within(themeRadioGroup).findByRole('radio', {
      name: /Coffee/i,
    });
    const switchToFlowThemeRadio = await within(themeRadioGroup).findByRole('radio', {
      name: /Flow/i,
    });

    userEvent.click(switchToFlowThemeRadio);

    expect(storeRef.current.getState().userSlice.preferences.activeTheme).toEqual('flow');
    const newPersistedState1 = await readStorageState();
    expect(newPersistedState1.userState?.preferences.activeTheme).toEqual('flow');

    userEvent.click(switchToCoffeeThemeRadio);

    expect(storeRef.current.getState().userSlice.preferences.activeTheme).toEqual('coffee');
    const newPersistedState2 = await readStorageState();
    expect(newPersistedState2.userState?.preferences.activeTheme).toEqual('coffee');
  });

  it('Change of file icon theme should be reflected in global state and persisted storage', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    const vsCodeThemeId: AvailableFileIconTheme = 'vsCode';
    const materialDesignId: AvailableFileIconTheme = 'materialDesign';

    expect(storeRef.current.getState().userSlice.preferences.activeFileIconTheme).toEqual(
      vsCodeThemeId,
    );

    const openUserPreferencesButton = await screen.findByRole('button', {
      name: /Open User Preferences/i,
    });

    userEvent.click(openUserPreferencesButton);

    const fileIconsRadioGroup = await screen.findByRole('radiogroup', { name: /File Icons/i });
    const switchToVsCodeFileIconThemeRadio = await within(fileIconsRadioGroup).findByRole('radio', {
      name: /VS Code/i,
    });
    const switchToMDFileIconThemeRadio = await within(fileIconsRadioGroup).findByRole('radio', {
      name: /Material Design/i,
    });

    userEvent.click(switchToMDFileIconThemeRadio);

    expect(storeRef.current.getState().userSlice.preferences.activeFileIconTheme).toEqual(
      materialDesignId,
    );
    const newPersistedState1 = await readStorageState();
    expect(newPersistedState1.userState?.preferences.activeFileIconTheme).toEqual(materialDesignId);

    userEvent.click(switchToVsCodeFileIconThemeRadio);

    expect(storeRef.current.getState().userSlice.preferences.activeFileIconTheme).toEqual(
      vsCodeThemeId,
    );
    const newPersistedState2 = await readStorageState();
    expect(newPersistedState2.userState?.preferences.activeFileIconTheme).toEqual(vsCodeThemeId);
  });
});
