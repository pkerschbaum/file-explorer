import { formatter as formatter2 } from '@file-explorer/code-oss-ecma/formatter.util';
import type { ResourceForUI } from '@file-explorer/code-oss-ecma/types';
import type { UriComponents } from '@file-explorer/code-oss-ecma/uri';
import { check } from '@file-explorer/commons-ecma/util/assert.util';
import { CustomError } from '@file-explorer/commons-ecma/util/custom-error';
import { objects } from '@file-explorer/commons-ecma/util/objects.util';

import type { CwdSegment } from '#pkg/global-state/slices/explorers.slice';
import {
  actions,
  computeCwdSegmentsFromUri,
  generateExplorerId,
} from '#pkg/global-state/slices/explorers.slice';

export async function addExplorerPanel(cwdSegmentsToClone?: CwdSegment[]) {
  let cwdSegmentsOfNewExplorer;
  if (cwdSegmentsToClone) {
    cwdSegmentsOfNewExplorer = objects.deepCopyJson(cwdSegmentsToClone);
  } else {
    const defaultExplorerCwd = await getDefaultExplorerCwd();
    const stats = await globalThis.modules.fileSystem.resolve(defaultExplorerCwd);
    if (!stats.isDirectory) {
      throw new CustomError(
        `could not set directory for explorer panel! reason: uri is not a valid directory.`,
        { uri: formatter2.resourcePath(defaultExplorerCwd) },
      );
    }
    cwdSegmentsOfNewExplorer = computeCwdSegmentsFromUri(await getDefaultExplorerCwd());
  }

  const explorerId = generateExplorerId();

  globalThis.modules.dispatch(
    actions.addExplorer({ explorerId, cwdSegments: cwdSegmentsOfNewExplorer }),
  );
  globalThis.modules.dispatch(actions.changeFocusedExplorer({ explorerId }));
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
  globalThis.modules.dispatch(actions.markExplorerForRemoval({ explorerId }));
  if (check.isNonEmptyString(explorerIdToSwitchTo)) {
    globalThis.modules.dispatch(
      actions.changeFocusedExplorer({ explorerId: explorerIdToSwitchTo }),
    );
  }
  setTimeout(() => {
    globalThis.modules.dispatch(actions.removeExplorer({ explorerId }));
  });
}

export function changeFocusedExplorer(newFocusedExplorerId: string) {
  globalThis.modules.dispatch(actions.changeFocusedExplorer({ explorerId: newFocusedExplorerId }));
}

export async function windowMinimize(): Promise<void> {
  return await globalThis.modules.nativeHost.window.minimize();
}

export async function windowToggleMaximized(): Promise<void> {
  return await globalThis.modules.nativeHost.window.toggleMaximized();
}

export async function windowClose(): Promise<void> {
  return await globalThis.modules.nativeHost.window.close();
}

export async function getDefaultExplorerCwd(): Promise<UriComponents> {
  return await globalThis.modules.nativeHost.app.getPath({ name: 'home' });
}

export function isResourceQualifiedForThumbnail(resource: ResourceForUI) {
  return globalThis.modules.nativeHost.app.isResourceQualifiedForThumbnail(resource);
}

export function getThumbnailURLForResource(resource: ResourceForUI, height: number) {
  return globalThis.modules.nativeHost.app.getThumbnailURLForResource(resource, height);
}

export function isResourceQualifiedForNativeIcon(resource: ResourceForUI) {
  return globalThis.modules.nativeHost.app.isResourceQualifiedForNativeIcon(resource);
}

export function getNativeIconURLForResource(resource: ResourceForUI) {
  return globalThis.modules.nativeHost.app.getNativeIconURLForResource(resource);
}
