import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { arrays } from '@app/base/utils/arrays.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { changeDirectory, createFolder, pasteResources } from '@app/operations/explorer.operations';
import * as resourceOperations from '@app/operations/resource.operations';
import {
  useExplorerId,
  useIsActiveExplorer,
  useKeyOfResourceSelectionGotStartedWith,
  useResourcesToShow,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
  useSetKeysOfSelectedResources,
} from '@app/ui/explorer-context';
import {
  ShortcutMap,
  useRegisterGlobalShortcuts,
  RegisterShortcutsResultMap,
} from '@app/ui/GlobalShortcutsContext';
import { createSelectableContext, EventHandler, useWindowEvent } from '@app/ui/utils/react.util';

type ExplorerOperationsContext = {
  copySelectedResources: () => void;
  cutSelectedResources: () => void;
  pasteResourcesIntoExplorer: () => Promise<void>;
  triggerRenameForSelectedResources: () => void;
  renameResource: (resourceToRename: ResourceForUI, newName: string) => Promise<void>;
  openSelectedResources: () => void;
  scheduleDeleteSelectedResources: () => void;
  createFolderInExplorer: (folderName: string) => Promise<void>;
  changeSelection: (idxOfResource: number, modifiers: { ctrl: boolean; shift: boolean }) => void;
  selectAll: () => void;
};

const selectableContext = createSelectableContext<ExplorerOperationsContext>('ExplorerOperations');
const useExplorerOperationsSelector = selectableContext.useContextSelector;
const OperationsContextProvider = selectableContext.Provider;

type ExplorerOperationsContextProviderProps = {
  children: React.ReactNode;
};

export const ExplorerOperationsContextProvider: React.FC<
  ExplorerOperationsContextProviderProps
> = ({ children }) => {
  const explorerId = useExplorerId();
  const resourcesToShow = useResourcesToShow();
  const setKeysOfSelectedResources = useSetKeysOfSelectedResources();
  const selectedShownResources = useSelectedShownResources();
  const keyOfResourceSelectionGotStartedWith = useKeyOfResourceSelectionGotStartedWith();
  const setKeyOfResourceToRename = useSetKeyOfResourceToRename();

  const { copySelectedResources, cutSelectedResources } = React.useMemo(() => {
    const urisOfResourcesToCutOrCopy = selectedShownResources.map((resource) => resource.uri);

    return {
      copySelectedResources: () =>
        resourceOperations.cutOrCopyResources(urisOfResourcesToCutOrCopy, false),
      cutSelectedResources: () =>
        resourceOperations.cutOrCopyResources(urisOfResourcesToCutOrCopy, true),
    };
  }, [selectedShownResources]);

  const pasteResourcesIntoExplorer: ExplorerOperationsContext['pasteResourcesIntoExplorer'] =
    React.useCallback(() => pasteResources(explorerId), [explorerId]);

  const triggerRenameForSelectedResources: ExplorerOperationsContext['triggerRenameForSelectedResources'] =
    React.useCallback(() => {
      setKeyOfResourceToRename((currentKeyOfResourceToRename) => {
        if (selectedShownResources.length !== 1) {
          return undefined;
        }
        if (selectedShownResources[0].key === currentKeyOfResourceToRename) {
          return undefined;
        } else {
          return selectedShownResources[0].key;
        }
      });
    }, [selectedShownResources, setKeyOfResourceToRename]);

  const renameResource: ExplorerOperationsContext['renameResource'] = React.useCallback(
    async (resourceToRename, newBaseName) => {
      const uriToRenameTo = URI.joinPath(URI.from(resourceToRename.uri), '..', newBaseName);
      setKeysOfSelectedResources((currentKeysOfSelectedResources) => {
        const oldKeyOfRenamedResource = uriHelper.getComparisonKey(resourceToRename.uri);
        const newKeyOfRenamedResource = uriHelper.getComparisonKey(uriToRenameTo);

        const newKeys = currentKeysOfSelectedResources.map((renameHistoryKeys) => {
          if (renameHistoryKeys.includes(oldKeyOfRenamedResource)) {
            return [...renameHistoryKeys, newKeyOfRenamedResource];
          }
          return renameHistoryKeys;
        });

        return newKeys;
      });
      await resourceOperations.renameResource(resourceToRename.uri, uriToRenameTo);
      setKeyOfResourceToRename(undefined);
    },
    [setKeyOfResourceToRename, setKeysOfSelectedResources],
  );

  const openSelectedResources: ExplorerOperationsContext['openSelectedResources'] =
    React.useCallback(async () => {
      if (
        selectedShownResources.length === 1 &&
        selectedShownResources[0].resourceType === RESOURCE_TYPE.DIRECTORY
      ) {
        await changeDirectory(explorerId, URI.from(selectedShownResources[0].uri));
      } else {
        await resourceOperations.openFiles(
          selectedShownResources
            .filter((selectedResource) => selectedResource.resourceType === RESOURCE_TYPE.FILE)
            .map((selectedResource) => selectedResource.uri),
        );
      }
    }, [explorerId, selectedShownResources]);

  const scheduleDeleteSelectedResources: ExplorerOperationsContext['scheduleDeleteSelectedResources'] =
    React.useCallback(() => {
      resourceOperations.scheduleMoveResourcesToTrash(
        selectedShownResources.map((resource) => resource.uri),
      );
    }, [selectedShownResources]);

  const createFolderInExplorer: ExplorerOperationsContext['createFolderInExplorer'] =
    React.useCallback((folderName) => createFolder(explorerId, folderName), [explorerId]);

  const changeSelection: ExplorerOperationsContext['changeSelection'] = React.useCallback(
    (idxOfResource, modifiers) => {
      if (idxOfResource < 0 || idxOfResource >= resourcesToShow.length) {
        return;
      }

      const resource = resourcesToShow[idxOfResource];
      const resourceIsSelected = !!selectedShownResources.find(
        (selectedResource) => selectedResource.key === resource.key,
      );
      function selectResources(resources: ResourceForUI[]) {
        setKeysOfSelectedResources(resources.map((resource) => [resource.key]));
      }

      if (modifiers.ctrl) {
        // toggle selection of resource
        if (resourceIsSelected) {
          selectResources(
            selectedShownResources.filter(
              (selectedResource) => selectedResource.key !== resource.key,
            ),
          );
        } else {
          selectResources([...selectedShownResources, resource]);
        }
      } else if (modifiers.shift) {
        // select range of resources
        if (keyOfResourceSelectionGotStartedWith === undefined) {
          return;
        }

        const idxSelectionGotStartedWith = resourcesToShow.findIndex((resource) =>
          keyOfResourceSelectionGotStartedWith.includes(resource.key),
        );
        let idxSelectFrom = idxSelectionGotStartedWith;
        let idxSelectTo = idxOfResource;
        let selectionDirection: 'DOWN' | 'UP' = 'DOWN';
        if (idxSelectTo < idxSelectFrom) {
          // swap values
          selectionDirection = 'UP';
          const tmp = idxSelectFrom;
          idxSelectFrom = idxSelectTo;
          idxSelectTo = tmp;
        }

        let resourcesToSelect = resourcesToShow.filter(
          (_, idx) => idx >= idxSelectFrom && idx <= idxSelectTo,
        );
        if (selectionDirection === 'UP') {
          resourcesToSelect = arrays.reverse(resourcesToSelect);
        }
        selectResources(resourcesToSelect);
      } else {
        // no ctrl or shift key pressed --> just select the resource
        selectResources([resource]);
      }
    },
    [
      keyOfResourceSelectionGotStartedWith,
      resourcesToShow,
      selectedShownResources,
      setKeysOfSelectedResources,
    ],
  );

  const selectAll: ExplorerOperationsContext['selectAll'] = React.useCallback(() => {
    setKeysOfSelectedResources(resourcesToShow.map((resource) => [resource.key]));
  }, [resourcesToShow, setKeysOfSelectedResources]);

  return (
    <OperationsContextProvider
      value={{
        copySelectedResources,
        cutSelectedResources,
        pasteResourcesIntoExplorer,
        triggerRenameForSelectedResources,
        renameResource,
        openSelectedResources,
        scheduleDeleteSelectedResources,
        createFolderInExplorer,
        changeSelection,
        selectAll,
      }}
    >
      {children}
    </OperationsContextProvider>
  );
};

export function useCopySelectedResources() {
  return useExplorerOperationsSelector((actions) => actions.copySelectedResources);
}

export function useCutSelectedResources() {
  return useExplorerOperationsSelector((actions) => actions.cutSelectedResources);
}

export function usePasteResourcesIntoExplorer() {
  return useExplorerOperationsSelector((actions) => actions.pasteResourcesIntoExplorer);
}

export function useTriggerRenameForSelectedResources() {
  return useExplorerOperationsSelector((actions) => actions.triggerRenameForSelectedResources);
}

export function useRenameResource() {
  return useExplorerOperationsSelector((actions) => actions.renameResource);
}

export function useOpenSelectedResources() {
  return useExplorerOperationsSelector((actions) => actions.openSelectedResources);
}

export function useScheduleDeleteSelectedResources() {
  return useExplorerOperationsSelector((actions) => actions.scheduleDeleteSelectedResources);
}

export function useCreateFolderInExplorer() {
  return useExplorerOperationsSelector((actions) => actions.createFolderInExplorer);
}

export function useChangeSelection() {
  return useExplorerOperationsSelector((actions) => actions.changeSelection);
}

export function useSelectAll() {
  return useExplorerOperationsSelector((actions) => actions.selectAll);
}

export function useRegisterExplorerShortcuts<ActualShortcutMap extends ShortcutMap>(
  shortcutMap: ActualShortcutMap,
): Partial<RegisterShortcutsResultMap<ActualShortcutMap>> {
  const isActiveExplorer = useIsActiveExplorer();
  return useRegisterGlobalShortcuts(!isActiveExplorer ? {} : shortcutMap);
}

export function useRegisterExplorerAuxclickHandler(eventHandlers: EventHandler<'auxclick'>[]) {
  const isActiveExplorer = useIsActiveExplorer();
  useWindowEvent('auxclick', !isActiveExplorer ? [] : eventHandlers);
}
