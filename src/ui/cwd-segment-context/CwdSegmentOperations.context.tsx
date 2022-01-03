import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { arrays } from '@app/base/utils/arrays.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { ResourceForUI } from '@app/domain/types';
import { REASON_FOR_SELECTION_CHANGE } from '@app/global-state/slices/explorers.slice';
import { createFolder, openResources, pasteResources } from '@app/operations/explorer.operations';
import * as resourceOperations from '@app/operations/resource.operations';
import {
  useIsActiveCwdSegment,
  useKeyOfResourceSelectionGotStartedWith,
  useResourcesToShow,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
  useSetKeysOfSelectedResources,
  useSetReasonForLastSelectionChange,
} from '@app/ui/cwd-segment-context';
import { useExplorerId, useIsActiveExplorer } from '@app/ui/explorer-context';
import {
  ShortcutMap,
  useRegisterGlobalShortcuts,
  RegisterShortcutsResultMap,
} from '@app/ui/GlobalShortcutsContext';
import { createSelectableContext, EventHandler, useWindowEvent } from '@app/ui/utils/react.util';

type CwdSegmentOperationsContext = {
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

const selectableContext =
  createSelectableContext<CwdSegmentOperationsContext>('CwdSegmentOperations');
const useCwdSegmentOperationsSelector = selectableContext.useContextSelector;
const OperationsContextProvider = selectableContext.Provider;

type CwdSegmentOperationsContextProviderProps = {
  children: React.ReactNode;
};

export const CwdSegmentOperationsContextProvider: React.FC<
  CwdSegmentOperationsContextProviderProps
> = ({ children }) => {
  const explorerId = useExplorerId();
  const resourcesToShow = useResourcesToShow();
  const setReasonForLastSelectionChange = useSetReasonForLastSelectionChange();
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

  const pasteResourcesIntoExplorer: CwdSegmentOperationsContext['pasteResourcesIntoExplorer'] =
    React.useCallback(() => pasteResources(explorerId), [explorerId]);

  const triggerRenameForSelectedResources: CwdSegmentOperationsContext['triggerRenameForSelectedResources'] =
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

  const renameResource: CwdSegmentOperationsContext['renameResource'] = React.useCallback(
    async (resourceToRename, newBaseName) => {
      const uriToRenameTo = URI.joinPath(URI.from(resourceToRename.uri), '..', newBaseName);
      setReasonForLastSelectionChange(REASON_FOR_SELECTION_CHANGE.USER_CHANGED_SELECTION);
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
    [setKeyOfResourceToRename, setKeysOfSelectedResources, setReasonForLastSelectionChange],
  );

  const openSelectedResources: CwdSegmentOperationsContext['openSelectedResources'] =
    React.useCallback(
      () => openResources(explorerId, selectedShownResources),
      [explorerId, selectedShownResources],
    );

  const scheduleDeleteSelectedResources: CwdSegmentOperationsContext['scheduleDeleteSelectedResources'] =
    React.useCallback(() => {
      resourceOperations.scheduleMoveResourcesToTrash(
        selectedShownResources.map((resource) => resource.uri),
      );
    }, [selectedShownResources]);

  const createFolderInExplorer: CwdSegmentOperationsContext['createFolderInExplorer'] =
    React.useCallback((folderName) => createFolder(explorerId, folderName), [explorerId]);

  const changeSelection: CwdSegmentOperationsContext['changeSelection'] = React.useCallback(
    (idxOfResource, modifiers) => {
      if (idxOfResource < 0 || idxOfResource >= resourcesToShow.length) {
        return;
      }

      const resource = resourcesToShow[idxOfResource];
      const resourceIsSelected = !!selectedShownResources.find(
        (selectedResource) => selectedResource.key === resource.key,
      );
      function selectResources(resources: ResourceForUI[]) {
        setReasonForLastSelectionChange(REASON_FOR_SELECTION_CHANGE.USER_CHANGED_SELECTION);
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
      setReasonForLastSelectionChange,
    ],
  );

  const selectAll: CwdSegmentOperationsContext['selectAll'] = React.useCallback(() => {
    setReasonForLastSelectionChange(REASON_FOR_SELECTION_CHANGE.USER_CHANGED_SELECTION);
    setKeysOfSelectedResources(resourcesToShow.map((resource) => [resource.key]));
  }, [resourcesToShow, setKeysOfSelectedResources, setReasonForLastSelectionChange]);

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
  return useCwdSegmentOperationsSelector((actions) => actions.copySelectedResources);
}

export function useCutSelectedResources() {
  return useCwdSegmentOperationsSelector((actions) => actions.cutSelectedResources);
}

export function usePasteResourcesIntoExplorer() {
  return useCwdSegmentOperationsSelector((actions) => actions.pasteResourcesIntoExplorer);
}

export function useTriggerRenameForSelectedResources() {
  return useCwdSegmentOperationsSelector((actions) => actions.triggerRenameForSelectedResources);
}

export function useRenameResource() {
  return useCwdSegmentOperationsSelector((actions) => actions.renameResource);
}

export function useOpenSelectedResources() {
  return useCwdSegmentOperationsSelector((actions) => actions.openSelectedResources);
}

export function useScheduleDeleteSelectedResources() {
  return useCwdSegmentOperationsSelector((actions) => actions.scheduleDeleteSelectedResources);
}

export function useCreateFolderInExplorer() {
  return useCwdSegmentOperationsSelector((actions) => actions.createFolderInExplorer);
}

export function useChangeSelection() {
  return useCwdSegmentOperationsSelector((actions) => actions.changeSelection);
}

export function useSelectAll() {
  return useCwdSegmentOperationsSelector((actions) => actions.selectAll);
}

export function useRegisterCwdSegmentShortcuts<ActualShortcutMap extends ShortcutMap>(
  shortcutMap: ActualShortcutMap,
): Partial<RegisterShortcutsResultMap<ActualShortcutMap>> {
  const isActiveExplorer = useIsActiveExplorer();
  const isActiveCwdSegment = useIsActiveCwdSegment();
  return useRegisterGlobalShortcuts(isActiveExplorer && isActiveCwdSegment ? shortcutMap : {});
}

export function useRegisterCwdSegmentAuxclickHandler(eventHandlers: EventHandler<'auxclick'>[]) {
  const isActiveExplorer = useIsActiveExplorer();
  const isActiveCwdSegment = useIsActiveCwdSegment();
  useWindowEvent('auxclick', isActiveExplorer && isActiveCwdSegment ? eventHandlers : []);
}
