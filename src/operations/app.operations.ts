import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI } from '@app/domain/types';
import { actions, generateExplorerId } from '@app/global-state/slices/explorers.slice';
import { dispatchRef, fileSystemRef, nativeHostRef } from '@app/operations/global-modules';

export async function addExplorerPanel(cwdToUse?: UriComponents) {
  let cwdOfNewExplorer;
  if (cwdToUse) {
    cwdOfNewExplorer = URI.from(cwdToUse);
  } else {
    cwdOfNewExplorer = URI.from(await getDefaultExplorerCwd());
  }

  const explorerId = generateExplorerId();
  const stats = await fileSystemRef.current.resolve(cwdOfNewExplorer);
  if (!stats.isDirectory) {
    throw Error(
      `could not set directory for explorer panel, reason: uri is not a valid directory. uri: ${formatter.resourcePath(
        cwdOfNewExplorer,
      )}`,
    );
  }

  dispatchRef.current(actions.addExplorer({ explorerId, cwd: cwdOfNewExplorer.toJSON() }));
  dispatchRef.current(actions.changeFocusedExplorer({ explorerId }));
}

export function removeExplorerPanel(explorerId: string, explorerIdToSwitchTo?: string) {
  /*
   * If the explorer gets removed immediately, redux subscriptions (e.g. useSelectors) currently
   * listening on that explorer will throw errors. So first, mark explorer for deletion, so that
   * the explorer gets unmounted from the UI and thus, from the React Tree. This will stop all
   * subscriptions on that explorer.
   *
   * After that, remove the explorer.
   */
  dispatchRef.current(actions.markExplorerForRemoval({ explorerId }));
  if (check.isNonEmptyString(explorerIdToSwitchTo)) {
    dispatchRef.current(actions.changeFocusedExplorer({ explorerId: explorerIdToSwitchTo }));
  }
  setTimeout(() => {
    dispatchRef.current(actions.removeExplorer({ explorerId }));
  });
}

export function changeFocusedExplorer(newFocusedExplorerId: string) {
  dispatchRef.current(actions.changeFocusedExplorer({ explorerId: newFocusedExplorerId }));
}

export async function windowMinimize(): Promise<void> {
  return await nativeHostRef.current.window.minimize();
}

export async function windowToggleMaximized(): Promise<void> {
  return await nativeHostRef.current.window.toggleMaximized();
}

export async function windowClose(): Promise<void> {
  return await nativeHostRef.current.window.close();
}

export async function getDefaultExplorerCwd(): Promise<UriComponents> {
  return await nativeHostRef.current.app.getPath({ name: 'desktop' });
}

export function getNativeIconURLForResource(resource: ResourceForUI) {
  return nativeHostRef.current.app.getNativeIconURLForResource(resource);
}

export function startNativeFileDnD(uri: UriComponents) {
  return nativeHostRef.current.webContents.startNativeFileDnD(uri);
}
