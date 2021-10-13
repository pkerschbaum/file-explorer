import { Schemas } from 'code-oss-file-service/out/vs/base/common/network';

import { useNexFileSystem } from '@app/ui/NexFileSystem.context';
import { useDispatch } from '@app/global-state/store';
import { actions, generateExplorerId } from '@app/global-state/file-provider/file-provider.slice';
import { uriHelper } from '@app/base/utils/uri-helper';

export function useAddExplorerPanel() {
  const dispatch = useDispatch();

  const fileSystem = useNexFileSystem();

  async function addExplorerPanel() {
    const explorerId = generateExplorerId();
    const parsedUri = uriHelper.parseUri(Schemas.file, 'C:/data/TEMP');
    const stats = await fileSystem.resolve(parsedUri);
    if (!stats.isDirectory) {
      throw Error(
        `could not set intial directory, reason: uri is not a valid directory. uri: ${parsedUri.toString()}`,
      );
    }

    dispatch(actions.addExplorer({ explorerId, cwd: parsedUri.toJSON() }));
    dispatch(actions.changeFocusedExplorer({ explorerId }));
  }

  return {
    addExplorerPanel,
  };
}

export function useRemoveExplorerPanel() {
  const dispatch = useDispatch();

  function removeExplorerPanel(explorerId: string) {
    /*
     * If the explorer gets removed immediately, redux subscriptions (e.g. useSelectors) currently
     * listening on that explorer will throw errors. So first, mark explorer for deletion, so that
     * the explorer gets unmounted from the UI and thus, from the React Tree. This will stop all
     * subscriptions on that explorer.
     *
     * After that, remove the explorer.
     */
    dispatch(actions.markExplorerForRemoval({ explorerId }));
    setTimeout(() => {
      dispatch(actions.removeExplorer({ explorerId }));
    });
  }

  return {
    removeExplorerPanel,
  };
}

export function useChangeFocusedExplorer() {
  const dispatch = useDispatch();

  function changeFocusedExplorer(newFocusedExplorerId: string) {
    dispatch(actions.changeFocusedExplorer({ explorerId: newFocusedExplorerId }));
  }

  return {
    changeFocusedExplorer,
  };
}
