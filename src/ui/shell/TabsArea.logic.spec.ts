import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { createStoreInstance } from '@app/global-state/store';
import { getDefaultExplorerCwd } from '@app/operations/app.operations';
import { createQueryClient } from '@app/ui/Globals';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';
import { renderApp } from '@app-test/utils/render-app';

describe('TabsArea [logic]', () => {
  it('Closing the currently active tab should focus the previous tab', async () => {
    await initializeFakePlatformModules();
    const cwd = await getDefaultExplorerCwd();
    const store = await createStoreInstance({
      preloadedState: {
        explorersSlice: {
          explorerPanels: {
            'panel-1': { cwd: URI.joinPath(URI.from(cwd), '..').toJSON() },
            'panel-2': { cwd },
            'panel-3': { cwd: URI.joinPath(URI.from(cwd), 'test-folder').toJSON() },
          },
          focusedExplorerPanelId: 'panel-3',
        },
      },
    });
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    const currentlySelectedTab = await screen.findByRole('tab', { name: /test-folder/i });
    expect(currentlySelectedTab).toHaveAttribute('aria-selected', 'true');
    const closeButton = await within(currentlySelectedTab).findByRole('button', {
      name: /Close Tab/i,
    });
    fireEvent.click(closeButton);

    await waitFor(async () => {
      const tabs = await screen.findAllByRole('tab');
      expect(tabs).toHaveLength(2);
    });

    const newSelectedTab = await screen.findByRole('tab', { name: /testdir/i });
    expect(newSelectedTab).toHaveAttribute('aria-selected', 'true');
  });
});
