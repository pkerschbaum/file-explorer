import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { CustomError } from '@app/base/custom-error';
import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { objects } from '@app/base/utils/objects.util';
import { ResourceForUI } from '@app/domain/types';
import {
  actions,
  computeCwdSegmentsStackFromUri,
  CwdSegment,
  generateExplorerId,
} from '@app/global-state/slices/explorers.slice';
import { dispatchRef, fileSystemRef, nativeHostRef } from '@app/operations/global-modules';

export async function addExplorerPanel(cwdSegmentsToClone?: CwdSegment[]) {
  let cwdSegmentsOfNewExplorer;
  if (cwdSegmentsToClone) {
    cwdSegmentsOfNewExplorer = objects.deepCopyJson(cwdSegmentsToClone);
  } else {
    const defaultExplorerCwd = URI.from(await getDefaultExplorerCwd());
    const stats = await fileSystemRef.current.resolve(defaultExplorerCwd);
    if (!stats.isDirectory) {
      throw new CustomError(
        `could not set directory for explorer panel! reason: uri is not a valid directory.`,
        { uri: formatter.resourcePath(defaultExplorerCwd) },
      );
    }
    cwdSegmentsOfNewExplorer = computeCwdSegmentsStackFromUri(await getDefaultExplorerCwd());
  }

  const explorerId = generateExplorerId();

  dispatchRef.current(actions.addExplorer({ explorerId, cwdSegments: cwdSegmentsOfNewExplorer }));
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
  return await nativeHostRef.current.app.getPath({ name: 'home' });
}

export function isResourceQualifiedForThumbnail(resource: ResourceForUI) {
  return nativeHostRef.current.app.isResourceQualifiedForThumbnail(resource);
}

export function getThumbnailURLForResource(resource: ResourceForUI, height: number) {
  return nativeHostRef.current.app.getThumbnailURLForResource(resource, height);
}

export function isResourceQualifiedForNativeIcon(resource: ResourceForUI) {
  return nativeHostRef.current.app.isResourceQualifiedForNativeIcon(resource);
}

export function getNativeIconURLForResource(resource: ResourceForUI) {
  return nativeHostRef.current.app.getNativeIconURLForResource(resource);
}

export function startNativeFileDnD(uri: UriComponents) {
  return nativeHostRef.current.webContents.startNativeFileDnD(uri);
}
