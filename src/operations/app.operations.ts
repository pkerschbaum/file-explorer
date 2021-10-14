import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';

import { uriHelper } from '@app/base/utils/uri-helper';
import { dispatchRef, fileSystemRef } from '@app/operations/global-modules';
import { actions, generateExplorerId } from '@app/global-state/slices/explorers.slice';

export async function addExplorerPanel() {
  const explorerId = generateExplorerId();
  const parsedUri = uriHelper.parseUri(Schemas.file, 'C:/data/TEMP');
  const stats = await fileSystemRef.current.resolve(parsedUri);
  if (!stats.isDirectory) {
    throw Error(
      `could not set intial directory, reason: uri is not a valid directory. uri: ${parsedUri.toString()}`,
    );
  }

  dispatchRef.current(actions.addExplorer({ explorerId, cwd: parsedUri.toJSON() }));
  dispatchRef.current(actions.changeFocusedExplorer({ explorerId }));
}

export function removeExplorerPanel(explorerId: string) {
  /*
   * If the explorer gets removed immediately, redux subscriptions (e.g. useSelectors) currently
   * listening on that explorer will throw errors. So first, mark explorer for deletion, so that
   * the explorer gets unmounted from the UI and thus, from the React Tree. This will stop all
   * subscriptions on that explorer.
   *
   * After that, remove the explorer.
   */
  dispatchRef.current(actions.markExplorerForRemoval({ explorerId }));
  setTimeout(() => {
    dispatchRef.current(actions.removeExplorer({ explorerId }));
  });
}

export function changeFocusedExplorer(newFocusedExplorerId: string) {
  dispatchRef.current(actions.changeFocusedExplorer({ explorerId: newFocusedExplorerId }));
}
