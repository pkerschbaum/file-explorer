import * as React from 'react';

import { arrays } from '@app/base/utils/arrays.util';
import { check } from '@app/base/utils/assert.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { isResourceQualifiedForThumbnail } from '@app/operations/app.operations';
import { useSetActiveResourcesView } from '@app/ui/explorer-context';
import {
  ExplorerContextProviderProps,
  ExplorerState,
  useSetKeysOfSelectedResources,
} from '@app/ui/explorer-context/ExplorerState.context';
import { useEnrichResourcesWithTags, useResourcesForUI } from '@app/ui/hooks/resources.hooks';
import { createSelectableContext, usePrevious } from '@app/ui/utils/react.util';

const USE_GALLERY_VIEW_PERCENTAGE = 0.75;

type ExplorerDerivedValuesContext = {
  explorerId: string;
  isActiveExplorer: boolean;
  dataAvailable: boolean;
  resourcesToShow: ResourceForUI[];
  selectedShownResources: ResourceForUI[];
};

const selectableContext =
  createSelectableContext<ExplorerDerivedValuesContext>('ExplorerDerivedValues');
const useExplorerDerivedValuesSelector = selectableContext.useContextSelector;
const DerivedValuesContextProvider = selectableContext.Provider;

type ExplorerDerivedValuesContextProviderProps = ExplorerContextProviderProps & {
  explorerState: ExplorerState;
};

export const ExplorerDerivedValuesContextProvider: React.FC<
  ExplorerDerivedValuesContextProviderProps
> = ({ explorerState, explorerId, isActiveExplorer, children }) => {
  const setKeysOfSelectedResources = useSetKeysOfSelectedResources();
  const setActiveResourcesView = useSetActiveResourcesView();

  const { resources, dataAvailable } = useResourcesForUI(explorerId);

  React.useEffect(
    function setInitialResourcesViewAfterResourcesGotLoaded() {
      if (explorerState.activeResourcesView !== undefined) {
        return;
      }

      if (!dataAvailable) {
        return;
      }

      const files = resources.filter((resource) => resource.resourceType === RESOURCE_TYPE.FILE);
      const filesQualifiedForThumbnails = files.filter((file) =>
        isResourceQualifiedForThumbnail(file),
      );

      /**
       * If enough files can get thumbnails, boot into "gallery" view.
       * The user can toggle the view afterwards
       */
      if (
        files.length > 0 &&
        filesQualifiedForThumbnails.length / files.length >= USE_GALLERY_VIEW_PERCENTAGE
      ) {
        setActiveResourcesView('gallery');
      } else {
        setActiveResourcesView('table');
      }
    },
    [dataAvailable, explorerState.activeResourcesView, resources, setActiveResourcesView],
  );

  const resourcesWithTags = useEnrichResourcesWithTags(resources);

  /*
   * Compute resources to show:
   * - if no filter input is given, just sort the resources.
   *   Directories first and files second. Each section sorted by name.
   * - otherwise, let "match-sorter" do its job for filtering and sorting.
   */
  const resourcesToShow: ResourceForUI[] = React.useMemo(() => {
    let result;

    if (check.isEmptyString(explorerState.filterInput)) {
      result = arrays
        .wrap(resourcesWithTags)
        .stableSort((a, b) => {
          if (a.basename.toLocaleLowerCase() < b.basename.toLocaleLowerCase()) {
            return -1;
          } else if (a.basename.toLocaleLowerCase() > b.basename.toLocaleLowerCase()) {
            return 1;
          }
          return 0;
        })
        .stableSort((a, b) => {
          if (a.resourceType === RESOURCE_TYPE.DIRECTORY && b.resourceType === RESOURCE_TYPE.FILE) {
            return -1;
          } else if (
            a.resourceType === RESOURCE_TYPE.FILE &&
            b.resourceType === RESOURCE_TYPE.DIRECTORY
          ) {
            return 1;
          }
          return 0;
        })
        .getValue();
    } else {
      result = arrays
        .wrap(resourcesWithTags)
        .matchSort(explorerState.filterInput, {
          keys: [(resource) => resource.basename],
        })
        .getValue();
    }

    return result;
  }, [explorerState.filterInput, resourcesWithTags]);

  const { selectedShownResources, didApplySelectionFallback } = React.useMemo(() => {
    const result: ResourceForUI[] = [];
    let didApplySelectionFallback = false;

    for (const renameHistoryKeys of explorerState.selection.keysOfSelectedResources) {
      for (const key of arrays.reverse(renameHistoryKeys)) {
        const resource = resourcesToShow.find((r) => r.key === key);
        if (resource) {
          result.push(resource);
          break;
        }
      }
    }

    // if no resource is selected, but at least one resource will be shown, fallback to just selecting the first resource
    if (result.length === 0 && resourcesToShow.length > 0) {
      result.push(resourcesToShow[0]);
      didApplySelectionFallback = true;
    }

    return { selectedShownResources: result, didApplySelectionFallback };
  }, [explorerState.selection.keysOfSelectedResources, resourcesToShow]);

  /*
   * If selection fallback was applied  (i.e. "keysOfSelectedResources" did not match any currently
   * shown files but there was at least one file which could be selected), we need to update the
   * "keysOfSelectedResources" state accordingly.
   */
  React.useEffect(() => {
    if (didApplySelectionFallback) {
      setKeysOfSelectedResources(selectedShownResources.map((resource) => [resource.key]));
    }
  }, [selectedShownResources, didApplySelectionFallback, setKeysOfSelectedResources]);

  // every time the filter input changes, reset selection
  const prevFilterInput = usePrevious(explorerState.filterInput);
  const filterInputChanged = explorerState.filterInput !== prevFilterInput;
  React.useEffect(() => {
    if (filterInputChanged && resourcesToShow.length > 0) {
      setKeysOfSelectedResources([[resourcesToShow[0].key]]);
    }
  }, [resourcesToShow, filterInputChanged, setKeysOfSelectedResources]);

  return (
    <DerivedValuesContextProvider
      value={{
        explorerId,
        isActiveExplorer,
        dataAvailable,
        resourcesToShow,
        selectedShownResources,
      }}
    >
      {children}
    </DerivedValuesContextProvider>
  );
};

export function useExplorerId() {
  return useExplorerDerivedValuesSelector((explorerValues) => explorerValues.explorerId);
}

export function useIsActiveExplorer() {
  return useExplorerDerivedValuesSelector((explorerValues) => explorerValues.isActiveExplorer);
}

export function useResourcesToShow() {
  return useExplorerDerivedValuesSelector((explorerValues) => explorerValues.resourcesToShow);
}

export function useDataAvailable() {
  return useExplorerDerivedValuesSelector((explorerValues) => explorerValues.dataAvailable);
}

export function useSelectedShownResources() {
  return useExplorerDerivedValuesSelector(
    (explorerValues) => explorerValues.selectedShownResources,
  );
}
