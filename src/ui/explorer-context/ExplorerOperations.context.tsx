import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { uriHelper } from '@app/base/utils/uri-helper';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { changeDirectory, createFolder, pasteResources } from '@app/operations/explorer.operations';
import * as resourceOperations from '@app/operations/resource.operations';
import { KEYS } from '@app/ui/constants';
import {
  useExplorerId,
  useIsActiveExplorer,
  useKeyOfResourceSelectionGotStartedWith,
  useResourcesToShow,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
  useSetKeysOfSelectedResources,
} from '@app/ui/explorer-context';
import { Shortcut, useRegisterGlobalShortcuts } from '@app/ui/GlobalShortcutsContext';
import { createSelectableContext, EventHandler, useWindowEvent } from '@app/ui/utils/react.util';

type ExplorerOperationsContext = {
  copySelectedResources: () => void;
  cutSelectedResources: () => void;
  pasteResourcesIntoExplorer: () => Promise<void>;
  triggerRenameForSelectedResources: () => void;
  renameResource: (resourceToRename: ResourceForUI, newName: string) => Promise<void>;
  changeSelectionByKeyboard: (e: KeyboardEvent) => void;
  openSelectedResources: () => void;
  scheduleDeleteSelectedResources: () => void;
  createFolderInExplorer: (folderName: string) => Promise<void>;
  changeSelectionByClick: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    resource: ResourceForUI,
    idxOfFile: number,
  ) => void;
};

const selectableContext = createSelectableContext<ExplorerOperationsContext>('ExplorerOperations');
const useExplorerOperationsSelector = selectableContext.useContextSelector;
const OperationsContextProvider = selectableContext.Provider;

type ExplorerOperationsContextProviderProps = {
  children: React.ReactNode;
};

export const ExplorerOperationsContextProvider: React.FC<ExplorerOperationsContextProviderProps> =
  ({ children }) => {
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

    const pasteResourcesIntoExplorer = React.useCallback(
      () => pasteResources(explorerId),
      [explorerId],
    );

    const triggerRenameForSelectedResources = React.useCallback(() => {
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

    const changeSelectionByKeyboard = React.useCallback(
      (e: KeyboardEvent) => {
        e.preventDefault();

        if (resourcesToShow.length < 1) {
          return;
        }

        if (e.key === KEYS.ARROW_UP || e.key === KEYS.ARROW_DOWN) {
          const keysOfSelectedShownResources = selectedShownResources.map((resource) => [
            resource.key,
          ]);
          const selectedResourcesMetas = resourcesToShow
            .map((resource, idx) => ({
              resource,
              idx,
              isSelected: keysOfSelectedShownResources.some((keys) => keys.includes(resource.key)),
            }))
            .filter((resource) => resource.isSelected);
          const resourceSelectionGotStartedWith_idx = selectedResourcesMetas.find((srm) =>
            keyOfResourceSelectionGotStartedWith?.includes(srm.resource.key),
          )?.idx;

          if (
            selectedResourcesMetas.length === 0 ||
            resourceSelectionGotStartedWith_idx === undefined
          ) {
            // If no resource is selected, just select the first resource
            setKeysOfSelectedResources([[resourcesToShow[0].key]]);
            return;
          }

          // If at least one resource is selected, gather some infos essential for further processing
          const firstSelectedResource_idx = selectedResourcesMetas[0].idx;
          const lastSelectedResource_idx =
            selectedResourcesMetas[selectedResourcesMetas.length - 1].idx;
          const selectionWasStartedDownwards =
            resourceSelectionGotStartedWith_idx === firstSelectedResource_idx;

          if (!e.shiftKey) {
            if (e.key === KEYS.ARROW_UP && resourceSelectionGotStartedWith_idx > 0) {
              /*
               * UP without shift key is pressed
               * --> select the resource above the resource which got selected first (if resource above exists)
               */
              setKeysOfSelectedResources([
                [resourcesToShow[resourceSelectionGotStartedWith_idx - 1].key],
              ]);
            } else if (
              e.key === KEYS.ARROW_DOWN &&
              resourcesToShow.length > resourceSelectionGotStartedWith_idx + 1
            ) {
              /*
               * DOWN without shift key is pressed
               * --> select the resource below the resource which got selected first (if resource below exists)
               */
              setKeysOfSelectedResources([
                [resourcesToShow[resourceSelectionGotStartedWith_idx + 1].key],
              ]);
            }
          } else {
            if (e.key === KEYS.ARROW_UP) {
              if (selectedResourcesMetas.length > 1 && selectionWasStartedDownwards) {
                /*
                 * SHIFT+UP is pressed, multiple resources are selected, and the selection was started downwards.
                 * --> The user wants to remove the last resource from the selection.
                 */
                setKeysOfSelectedResources(
                  keysOfSelectedShownResources.filter(
                    (keys) =>
                      !keys.includes(
                        selectedResourcesMetas[selectedResourcesMetas.length - 1].resource.key,
                      ),
                  ),
                );
              } else if (firstSelectedResource_idx > 0) {
                /*
                 * SHIFT+UP is pressed and the selection was started upwards. Or, there is only one resource selected at the moment.
                 * --> The user wants to add the resource above all selected resources to the selection.
                 */
                setKeysOfSelectedResources([
                  [resourcesToShow[firstSelectedResource_idx - 1].key],
                  ...keysOfSelectedShownResources,
                ]);
              }
            } else if (e.key === KEYS.ARROW_DOWN) {
              if (selectedResourcesMetas.length > 1 && !selectionWasStartedDownwards) {
                /*
                 * SHIFT+DOWN is pressed, multiple resources are selected, and the selection was started upwards.
                 * --> The user wants to remove the first resource from the selection.
                 */
                setKeysOfSelectedResources(
                  keysOfSelectedShownResources.filter(
                    (keys) => !keys.includes(selectedResourcesMetas[0].resource.key),
                  ),
                );
              } else if (resourcesToShow.length > lastSelectedResource_idx + 1) {
                /*
                 * SHIFT+DOWN is pressed and the selection was started downwards. Or, there is only one resource selected at the moment.
                 * --> The user wants to add the resource after all selected resources to the selection.
                 */
                setKeysOfSelectedResources([
                  ...keysOfSelectedShownResources,
                  [resourcesToShow[lastSelectedResource_idx + 1].key],
                ]);
              }
            }
          }
        } else if (e.key === KEYS.PAGE_UP) {
          setKeysOfSelectedResources([[resourcesToShow[0].key]]);
        } else if (e.key === KEYS.PAGE_DOWN) {
          setKeysOfSelectedResources([[resourcesToShow[resourcesToShow.length - 1].key]]);
        } else if (e.key === KEYS.A) {
          setKeysOfSelectedResources(resourcesToShow.map((resource) => [resource.key]));
        } else {
          throw new Error(`key not implemented. e.key=${e.key}`);
        }
      },
      [
        keyOfResourceSelectionGotStartedWith,
        resourcesToShow,
        selectedShownResources,
        setKeysOfSelectedResources,
      ],
    );

    const openSelectedResources = React.useCallback(async () => {
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

    const scheduleDeleteSelectedResources = React.useCallback(() => {
      resourceOperations.scheduleMoveResourcesToTrash(
        selectedShownResources.map((resource) => resource.uri),
      );
    }, [selectedShownResources]);

    const createFolderInExplorer = React.useCallback(
      (folderName: string) => createFolder(explorerId, folderName),
      [explorerId],
    );

    const changeSelectionByClick = React.useCallback(
      (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        resource: ResourceForUI,
        idxOfResource: number,
      ) => {
        const resourceIsSelected = !!selectedShownResources.find(
          (selectedResource) => selectedResource.key === resource.key,
        );
        function selectResources(resources: ResourceForUI[]) {
          setKeysOfSelectedResources(resources.map((resource) => [resource.key]));
        }

        if (e.ctrlKey) {
          // toggle selection of resource which was clicked on
          if (resourceIsSelected) {
            selectResources(
              selectedShownResources.filter(
                (selectedResource) => selectedResource.key !== resource.key,
              ),
            );
          } else {
            selectResources([...selectedShownResources, resource]);
          }
        } else if (e.shiftKey) {
          // select range of resources
          if (keyOfResourceSelectionGotStartedWith === undefined) {
            return;
          }

          const idxSelectionGotStartedWith = resourcesToShow.findIndex((resource) =>
            keyOfResourceSelectionGotStartedWith.includes(resource.key),
          );
          let idxSelectFrom = idxSelectionGotStartedWith;
          let idxSelectTo = idxOfResource;
          if (idxSelectTo < idxSelectFrom) {
            // swap values
            const tmp = idxSelectFrom;
            idxSelectFrom = idxSelectTo;
            idxSelectTo = tmp;
          }

          const resourcesToSelect = resourcesToShow.filter(
            (_, idx) => idx >= idxSelectFrom && idx <= idxSelectTo,
          );
          selectResources(resourcesToSelect);
        } else {
          // no ctrl or shift key pressed --> just select the resource which was clicked on
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

    return (
      <OperationsContextProvider
        value={{
          copySelectedResources,
          cutSelectedResources,
          pasteResourcesIntoExplorer,
          triggerRenameForSelectedResources,
          renameResource,
          changeSelectionByKeyboard,
          openSelectedResources,
          scheduleDeleteSelectedResources,
          createFolderInExplorer,
          changeSelectionByClick,
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

export function useChangeSelectionByKeyboard() {
  return useExplorerOperationsSelector((actions) => actions.changeSelectionByKeyboard);
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

export function useChangeSelectionByClick() {
  return useExplorerOperationsSelector((actions) => actions.changeSelectionByClick);
}

export function useRegisterExplorerShortcuts(shortcuts: Shortcut[]) {
  const isActiveExplorer = useIsActiveExplorer();
  useRegisterGlobalShortcuts(!isActiveExplorer ? [] : shortcuts);
}

export function useRegisterExplorerAuxclickHandler(eventHandlers: EventHandler<'auxclick'>[]) {
  const isActiveExplorer = useIsActiveExplorer();
  useWindowEvent('auxclick', !isActiveExplorer ? [] : eventHandlers);
}
