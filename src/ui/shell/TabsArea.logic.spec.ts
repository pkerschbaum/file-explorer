import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { computeCwdSegmentsFromUri } from '@app/global-state/slices/explorers.slice';
import { createStoreInstance } from '@app/global-state/store';
import { getDefaultExplorerCwd } from '@app/operations/app.operations';
import { createQueryClient } from '@app/ui/Globals';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';
import { renderApp } from '@app-test/utils/render-app';

describe('TabsArea [logic]', () => {
  it('Closing the currently focused tab should focus the previous tab', async () => {
    await initializeFakePlatformModules();
    const cwd = await getDefaultExplorerCwd();
    const store = await createStoreInstance({
      preloadedState: {
        explorersSlice: {
          explorerPanels: {
            'panel-1': {
              cwdSegments: computeCwdSegmentsFromUri(URI.joinPath(URI.from(cwd), '..').toJSON()),
            },
            'panel-2': { cwdSegments: computeCwdSegmentsFromUri(cwd) },
            'panel-3': {
              cwdSegments: computeCwdSegmentsFromUri(
                URI.joinPath(URI.from(cwd), 'test-folder').toJSON(),
              ),
            },
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
    userEvent.click(closeButton);

    await waitFor(async () => {
      const tabs = await screen.findAllByRole('tab');
      expect(tabs).toHaveLength(2);
    });

    const newSelectedTab = await screen.findByRole('tab', { name: /testdir/i });
    expect(newSelectedTab).toHaveAttribute('aria-selected', 'true');
  });

  it('Closing an unfocused tab should not change which tab is currently focused', async () => {
    await initializeFakePlatformModules();
    const cwd = await getDefaultExplorerCwd();
    const store = await createStoreInstance({
      preloadedState: {
        explorersSlice: {
          explorerPanels: {
            'panel-1': {
              cwdSegments: computeCwdSegmentsFromUri(URI.joinPath(URI.from(cwd), '..').toJSON()),
            },
            'panel-2': { cwdSegments: computeCwdSegmentsFromUri(cwd) },
            'panel-3': {
              cwdSegments: computeCwdSegmentsFromUri(
                URI.joinPath(URI.from(cwd), 'test-folder').toJSON(),
              ),
            },
          },
          focusedExplorerPanelId: 'panel-3',
        },
      },
    });
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    const currentlySelectedTab = await screen.findByRole('tab', { name: /test-folder/i });
    expect(currentlySelectedTab).toHaveAttribute('aria-selected', 'true');
    const nonFocusedTab = await screen.findByRole('tab', { name: /testdir/i });
    expect(nonFocusedTab).toHaveAttribute('aria-selected', 'false');

    const closeButton = await within(nonFocusedTab).findByRole('button', {
      name: /Close Tab/i,
    });
    userEvent.click(closeButton);

    await waitFor(async () => {
      const tabs = await screen.findAllByRole('tab');
      expect(tabs).toHaveLength(2);
    });

    const stillSelectedTab = await screen.findByRole('tab', { name: /test-folder/i });
    expect(stillSelectedTab).toHaveAttribute('aria-selected', 'true');
  });
});
