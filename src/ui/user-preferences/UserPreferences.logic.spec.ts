import { expect } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react';

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

    expect(storeRef.current.getState().userSlice.preferences.activeTheme).toEqual('coffee');

    const openUserPreferencesButton = await screen.findByRole('button', {
      name: /Open User Preferences/i,
    });

    fireEvent.click(openUserPreferencesButton);

    const switchToCoffeeThemeButton = await screen.findByRole('button', { name: /Coffee/i });
    const switchToFlowThemeButton = await screen.findByRole('button', { name: /Flow/i });

    fireEvent.click(switchToFlowThemeButton);

    expect(storeRef.current.getState().userSlice.preferences.activeTheme).toEqual('flow');
    const newPersistedState1 = await readStorageState();
    expect(newPersistedState1.userState?.preferences.activeTheme).toEqual('flow');

    fireEvent.click(switchToCoffeeThemeButton);

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
    const materialDesignId: AvailableFileIconTheme = 'vsCode';

    expect(storeRef.current.getState().userSlice.preferences.activeFileIconTheme).toEqual(
      vsCodeThemeId,
    );

    const openUserPreferencesButton = await screen.findByRole('button', {
      name: /Open User Preferences/i,
    });

    fireEvent.click(openUserPreferencesButton);

    const switchToVsCodeFileIconThemeButton = await screen.findByRole('button', {
      name: /VS Code/i,
    });
    const switchToMDFileIconThemeButton = await screen.findByRole('button', {
      name: /Material Design/i,
    });

    fireEvent.click(switchToMDFileIconThemeButton);

    expect(storeRef.current.getState().userSlice.preferences.activeFileIconTheme).toEqual(
      materialDesignId,
    );
    const newPersistedState1 = await readStorageState();
    expect(newPersistedState1.userState?.preferences.activeFileIconTheme).toEqual(materialDesignId);

    fireEvent.click(switchToVsCodeFileIconThemeButton);

    expect(storeRef.current.getState().userSlice.preferences.activeFileIconTheme).toEqual(
      vsCodeThemeId,
    );
    const newPersistedState2 = await readStorageState();
    expect(newPersistedState2.userState?.preferences.activeFileIconTheme).toEqual(vsCodeThemeId);
  });
});
