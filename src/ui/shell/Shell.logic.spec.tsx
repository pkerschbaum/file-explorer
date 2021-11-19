import { expect } from '@jest/globals';
import 'setimmediate';
import '@shopify/polyfills/idle-callback.jest';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import { createStoreInstance } from '@app/global-state/store';
import { nativeHostRef, storeRef } from '@app/operations/global-modules';
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

    await waitFor(() => screen.getByRole('button', { name: /Copy/i }));
    fireEvent.click(screen.getByRole('button', { name: /Copy/i }));

    const resourcesInClipboard = nativeHostRef.current.clipboard.readResources();
    expect(resourcesInClipboard).toHaveLength(1);

    expect(storeRef.current.getState().processesSlice.draftPasteState).not.toBeUndefined();
    expect(storeRef.current.getState().processesSlice.draftPasteState?.pasteShouldMove).toBe(false);
  });
});
