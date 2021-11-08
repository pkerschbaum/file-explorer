import { matchSorter } from 'match-sorter';
import * as React from 'react';

import { arrays } from '@app/base/utils/arrays.util';
import { check } from '@app/base/utils/assert.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { useEnrichResourcesWithTags } from '@app/global-state/slices/tags.hooks';
import type {
  ExplorerContextProviderProps,
  ExplorerState,
  ExplorerStateUpdateFunctions,
} from '@app/ui/explorer-context/ExplorerState.context';
import { useResourcesForUI } from '@app/ui/hooks/resources.hooks';
import { createSelectableContext, usePrevious } from '@app/ui/utils/react.util';

type ExplorerDerivedValuesContext = {
  explorerId: string;
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
  setKeysOfSelectedResources: ExplorerStateUpdateFunctions['setKeysOfSelectedResources'];
};

export const ExplorerDerivedValuesContextProvider: React.FC<ExplorerDerivedValuesContextProviderProps> =
  ({ explorerState, setKeysOfSelectedResources, explorerId, children }) => {
    const { resources, dataAvailable } = useResourcesForUI(explorerId);

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
            if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
              return -1;
            } else if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
              return 1;
            }
            return 0;
          })
          .stableSort((a, b) => {
            if (
              a.resourceType === RESOURCE_TYPE.DIRECTORY &&
              b.resourceType === RESOURCE_TYPE.FILE
            ) {
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
            // avoid "WORD STARTS WITH" ranking of match-sorter by replacing each blank with another character
            keys: [(resource) => resource.name.replace(' ', '_')],
            threshold: matchSorter.rankings.CONTAINS,
          })
          .getValue();
      }

      return result;
    }, [explorerState.filterInput, resourcesWithTags]);

    const selectedShownResources = React.useMemo(
      () =>
        resourcesToShow.filter((resource) =>
          explorerState.selection.keysOfSelectedResources.includes(resource.key),
        ),
      [resourcesToShow, explorerState.selection.keysOfSelectedResources],
    );

    // if no resource is selected, reset selection
    React.useEffect(() => {
      if (selectedShownResources.length === 0 && resourcesToShow.length > 0) {
        setKeysOfSelectedResources([resourcesToShow[0].key]);
      }
    }, [selectedShownResources.length, resourcesToShow, setKeysOfSelectedResources]);

    // every time the filter input changes, reset selection
    const prevFilterInput = usePrevious(explorerState.filterInput);
    const filterInputChanged = explorerState.filterInput !== prevFilterInput;
    React.useEffect(() => {
      if (filterInputChanged && resourcesToShow.length > 0) {
        setKeysOfSelectedResources([resourcesToShow[0].key]);
      }
    }, [resourcesToShow, filterInputChanged, setKeysOfSelectedResources]);

    return (
      <DerivedValuesContextProvider
        value={{
          explorerId,
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
