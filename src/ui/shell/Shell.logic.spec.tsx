import { expect } from '@jest/globals';
import 'setimmediate';
import '@shopify/polyfills/idle-callback.jest';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

import { createStoreInstance } from '@app/global-state/store';
import { nativeHostRef, storeRef } from '@app/operations/global-modules';
import { readStorageState } from '@app/operations/storage-state.operations';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';

describe('Shell [logic]', () => {
  it('Click on button "Copy" should store selected resources in clipboard and "pasteShouldMove: false" in global-state', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    render(
      <Globals queryClient={queryClient} store={store}>
        <Shell />
      </Globals>,
    );

    const copyButton = await screen.findByRole('button', { name: /Copy/i });
    fireEvent.click(copyButton);

    const resourcesInClipboard = nativeHostRef.current.clipboard.readResources();
    expect(resourcesInClipboard).toHaveLength(1);

    expect(storeRef.current.getState().processesSlice.draftPasteState).not.toBeUndefined();
    expect(storeRef.current.getState().processesSlice.draftPasteState?.pasteShouldMove).toBe(false);
  });

  it('[UserPreferences] Change of theme should be reflected in global state and persisted storage', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    render(
      <Globals queryClient={queryClient} store={store}>
        <Shell />
      </Globals>,
    );

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
});
