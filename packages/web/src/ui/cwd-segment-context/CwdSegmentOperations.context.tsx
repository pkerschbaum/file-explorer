import * as React from 'react';

import type { ResourceForUI } from '@file-explorer/code-oss-ecma/types';
import { URI } from '@file-explorer/code-oss-ecma/uri';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';
import { arrays } from '@file-explorer/commons-ecma/util/arrays.util';
import { errorsUtil } from '@file-explorer/commons-ecma/util/errors.util';

import { REASON_FOR_SELECTION_CHANGE } from '#pkg/global-state/slices/explorers.slice';
import { createFolder, openResources, pasteResources } from '#pkg/operations/explorer.operations';
import * as resourceOperations from '#pkg/operations/resource.operations';
import { APP_MESSAGE_SEVERITY, usePushAppMessage } from '#pkg/ui/AppMessagesContext';
import {
  useIsActiveCwdSegment,
  useKeyOfResourceSelectionGotStartedWith,
  useResourcesToShow,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
  useSetKeysOfSelectedResources,
  useSetReasonForLastSelectionChange,
} from '#pkg/ui/cwd-segment-context';
import { useExplorerId, useIsActiveExplorer } from '#pkg/ui/explorer-context';
import type { ShortcutMap, RegisterShortcutsResultMap } from '#pkg/ui/GlobalShortcutsContext';
import { useRegisterGlobalShortcuts } from '#pkg/ui/GlobalShortcutsContext';
import type { EventHandler } from '#pkg/ui/utils/react.util';
import { createContext, useLatestValueRef, useWindowEvent } from '#pkg/ui/utils/react.util';

type CwdSegmentOperationsContext = {
  copySelectedResources: () => void;
  cutSelectedResources: () => void;
  pasteResourcesIntoExplorer: () => Promise<void>;
  triggerRenameForSelectedResources: () => void;
  renameResource: (resourceToRename: ResourceForUI, newName: string) => Promise<void>;
  openSelectedResources: () => void;
  scheduleDeleteSelectedResources: () => void;
  createFolderInExplorer: (folderName: string) => Promise<void>;
  changeSelection: (args: {
    idxOfResource: number;
    modifiers: { ctrl: boolean; shift: boolean };
    reasonForSelectionChange: REASON_FOR_SELECTION_CHANGE;
  }) => void;
  selectAll: () => void;
};

const selectableContext =
  createContext<React.MutableRefObject<CwdSegmentOperationsContext>>('CwdSegmentOperations');
const useCwdSegmentOperationsValue = selectableContext.useContextValue;
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
  const pushAppMessage = usePushAppMessage();

  const urisOfSelectedShownResources = React.useMemo(
    () => selectedShownResources.map((resource) => resource.uri),
    [selectedShownResources],
  );

  const copySelectedResources: CwdSegmentOperationsContext['copySelectedResources'] = () =>
    resourceOperations.cutOrCopyResources(urisOfSelectedShownResources, false);
  const cutSelectedResources: CwdSegmentOperationsContext['cutSelectedResources'] = () =>
    resourceOperations.cutOrCopyResources(urisOfSelectedShownResources, true);

  const pasteResourcesIntoExplorer: CwdSegmentOperationsContext['pasteResourcesIntoExplorer'] =
    () => pasteResources(explorerId);

  const triggerRenameForSelectedResources: CwdSegmentOperationsContext['triggerRenameForSelectedResources'] =
    () =>
      setKeyOfResourceToRename((currentKeyOfResourceToRename) => {
        if (selectedShownResources.length !== 1) {
          return undefined;
        }
        return selectedShownResources[0].key === currentKeyOfResourceToRename
          ? undefined
          : selectedShownResources[0].key;
      });

  const renameResource: CwdSegmentOperationsContext['renameResource'] = async (
    resourceToRename,
    newBaseName,
  ) => {
    try {
      const uriToRenameTo = URI.joinPath(resourceToRename.uri, '..', newBaseName);
      setReasonForLastSelectionChange(
        REASON_FOR_SELECTION_CHANGE.USER_CHANGED_SELECTION_VIA_KEYBOARD,
      );
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
    } catch (error) {
      const errorMessage = errorsUtil.computeVerboseMessageFromError(error) ?? 'Unknown error';

      pushAppMessage({
        severity: APP_MESSAGE_SEVERITY.ERROR,
        label: `Error occured when trying to rename`,
        detail: errorMessage,
        retryAction: {
          label: 'Retry',
          onPress: () => renameResource(resourceToRename, newBaseName),
        },
      });
    }
  };

  const openSelectedResources: CwdSegmentOperationsContext['openSelectedResources'] = async () => {
    try {
      await openResources(explorerId, selectedShownResources);
    } catch (error) {
      const errorMessage = errorsUtil.computeVerboseMessageFromError(error) ?? 'Unknown error';

      pushAppMessage({
        severity: APP_MESSAGE_SEVERITY.ERROR,
        label: `Error occured when trying to open the selected resources`,
        detail: errorMessage,
        retryAction: {
          label: 'Retry',
          onPress: () => openSelectedResources(),
        },
      });
    }
  };

  const scheduleDeleteSelectedResources: CwdSegmentOperationsContext['scheduleDeleteSelectedResources'] =
    () => resourceOperations.scheduleMoveResourcesToTrash(urisOfSelectedShownResources);

  const createFolderInExplorer: CwdSegmentOperationsContext['createFolderInExplorer'] = async (
    folderName,
  ) => {
    try {
      const createdFolderUri = await createFolder(explorerId, folderName);
      setKeysOfSelectedResources([[uriHelper.getComparisonKey(createdFolderUri)]]);
      setReasonForLastSelectionChange(REASON_FOR_SELECTION_CHANGE.NEW_FOLDER_WAS_CREATED);
    } catch (error) {
      const errorMessage = errorsUtil.computeVerboseMessageFromError(error) ?? 'Unknown error';

      pushAppMessage({
        severity: APP_MESSAGE_SEVERITY.ERROR,
        label: `Error occured while creating folder with name "${folderName}"`,
        detail: errorMessage,
        retryAction: {
          label: 'Retry',
          onPress: () => createFolderInExplorer(folderName),
        },
      });
    }
  };

  const changeSelection: CwdSegmentOperationsContext['changeSelection'] = ({
    idxOfResource,
    modifiers,
    reasonForSelectionChange,
  }) => {
    if (idxOfResource < 0 || idxOfResource >= resourcesToShow.length) {
      return;
    }

    const resource = resourcesToShow[idxOfResource];
    const resourceIsSelected = selectedShownResources.some(
      (selectedResource) => selectedResource.key === resource.key,
    );
    function selectResources(resources: ResourceForUI[]) {
      setReasonForLastSelectionChange(reasonForSelectionChange);
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
  };

  const selectAll: CwdSegmentOperationsContext['selectAll'] = () => {
    setReasonForLastSelectionChange(REASON_FOR_SELECTION_CHANGE.RESET);
    setKeysOfSelectedResources(resourcesToShow.map((resource) => [resource.key]));
  };

  const latestOperationsRef = useLatestValueRef({
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
  });

  return (
    <OperationsContextProvider value={latestOperationsRef}>{children}</OperationsContextProvider>
  );
};

export function useCopySelectedResources(): CwdSegmentOperationsContext['copySelectedResources'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.copySelectedResources(...params);
}

export function useCutSelectedResources(): CwdSegmentOperationsContext['cutSelectedResources'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.cutSelectedResources(...params);
}

export function usePasteResourcesIntoExplorer(): CwdSegmentOperationsContext['pasteResourcesIntoExplorer'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.pasteResourcesIntoExplorer(...params);
}

export function useTriggerRenameForSelectedResources(): CwdSegmentOperationsContext['triggerRenameForSelectedResources'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.triggerRenameForSelectedResources(...params);
}

export function useRenameResource(): CwdSegmentOperationsContext['renameResource'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.renameResource(...params);
}

export function useOpenSelectedResources(): CwdSegmentOperationsContext['openSelectedResources'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.openSelectedResources(...params);
}

export function useScheduleDeleteSelectedResources(): CwdSegmentOperationsContext['scheduleDeleteSelectedResources'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.scheduleDeleteSelectedResources(...params);
}

export function useCreateFolderInExplorer(): CwdSegmentOperationsContext['createFolderInExplorer'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.createFolderInExplorer(...params);
}

export function useChangeSelection(): CwdSegmentOperationsContext['changeSelection'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.changeSelection(...params);
}

export function useSelectAll(): CwdSegmentOperationsContext['selectAll'] {
  const operationsRef = useCwdSegmentOperationsValue();
  return (...params) => operationsRef.current.selectAll(...params);
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
