import * as React from 'react';

import { arrays } from '@app/base/utils/arrays.util';
import { check } from '@app/base/utils/assert.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { useSegmentUri } from '@app/global-state/slices/explorers.hooks';
import { REASON_FOR_SELECTION_CHANGE } from '@app/global-state/slices/explorers.slice';
import { isResourceQualifiedForThumbnail } from '@app/operations/app.operations';
import {
  useActiveResourcesView,
  useFilterInput,
  useKeysOfSelectedResources,
  useSegmentIdx,
  useSetActiveResourcesView,
  useSetKeysOfSelectedResources,
  useSetReasonForLastSelectionChange,
} from '@app/ui/cwd-segment-context';
import { useExplorerId } from '@app/ui/explorer-context';
import { useEnrichResourcesWithTags, useResourcesForUI } from '@app/ui/hooks/resources.hooks';
import { createSelectableContext, usePrevious } from '@app/ui/utils/react.util';

const USE_GALLERY_VIEW_PERCENTAGE = 0.75;

type CwdSegmentDerivedValuesContext = {
  dataAvailable: boolean;
  resourcesToShow: ResourceForUI[];
  selectedShownResources: ResourceForUI[];
};

const selectableContext =
  createSelectableContext<CwdSegmentDerivedValuesContext>('CwdSegmentDerivedValues');
const useCwdSegmentDerivedValuesSelector = selectableContext.useContextSelector;
const DerivedValuesContextProvider = selectableContext.Provider;

type CwdSegmentDerivedValuesContextProviderProps = {
  children: React.ReactNode;
};

export const CwdSegmentDerivedValuesContextProvider: React.FC<
  CwdSegmentDerivedValuesContextProviderProps
> = ({ children }) => {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();

  const uri = useSegmentUri(explorerId, segmentIdx);
  const filterInput = useFilterInput();
  const keysOfSelectedResources = useKeysOfSelectedResources();
  const activeResourcesView = useActiveResourcesView();
  const setReasonForLastSelectionChange = useSetReasonForLastSelectionChange();
  const setKeysOfSelectedResources = useSetKeysOfSelectedResources();
  const setActiveResourcesView = useSetActiveResourcesView();

  const { resources, dataAvailable } = useResourcesForUI(uri);

  const resourcesWithTags = useEnrichResourcesWithTags(resources);

  /*
   * Compute resources to show:
   * - if no filter input is given, just sort the resources.
   *   Directories first and files second. Each section sorted by name.
   * - otherwise, let "match-sorter" do its job for filtering and sorting.
   */
  const resourcesToShow: ResourceForUI[] = React.useMemo(() => {
    let result;

    if (check.isEmptyString(filterInput)) {
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
        .matchSort(filterInput, {
          keys: [(resource) => resource.basename],
        })
        .getValue();
    }

    return result;
  }, [filterInput, resourcesWithTags]);

  const { selectedShownResources, didApplySelectionFallback } = React.useMemo(() => {
    const result: ResourceForUI[] = [];
    let didApplySelectionFallback = false;

    for (const renameHistoryKeys of keysOfSelectedResources) {
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
  }, [keysOfSelectedResources, resourcesToShow]);

  /*
   * If selection fallback was applied  (i.e. "keysOfSelectedResources" did not match any currently
   * shown files but there was at least one file which could be selected), we need to update the
   * "keysOfSelectedResources" state accordingly.
   */
  React.useEffect(() => {
    if (didApplySelectionFallback) {
      setReasonForLastSelectionChange(REASON_FOR_SELECTION_CHANGE.RESET);
      setKeysOfSelectedResources(selectedShownResources.map((resource) => [resource.key]));
    }
  }, [
    didApplySelectionFallback,
    selectedShownResources,
    setKeysOfSelectedResources,
    setReasonForLastSelectionChange,
  ]);

  // every time the filter input changes, reset selection
  const prevFilterInput = usePrevious(filterInput);
  const filterInputChanged = filterInput !== prevFilterInput;
  React.useEffect(() => {
    if (filterInputChanged && resourcesToShow.length > 0) {
      setReasonForLastSelectionChange(REASON_FOR_SELECTION_CHANGE.RESET);
      setKeysOfSelectedResources([[resourcesToShow[0].key]]);
    }
  }, [
    filterInputChanged,
    resourcesToShow,
    setKeysOfSelectedResources,
    setReasonForLastSelectionChange,
  ]);

  // once we got resources loaded, determine and set the resource view mode which should be initially used
  React.useEffect(() => {
    if (activeResourcesView !== undefined) {
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
  }, [dataAvailable, activeResourcesView, resources, setActiveResourcesView]);

  return (
    <DerivedValuesContextProvider
      value={{
        dataAvailable,
        resourcesToShow,
        selectedShownResources,
      }}
    >
      {children}
    </DerivedValuesContextProvider>
  );
};

export function useDataAvailable() {
  return useCwdSegmentDerivedValuesSelector((explorerValues) => explorerValues.dataAvailable);
}

export function useResourcesToShow() {
  return useCwdSegmentDerivedValuesSelector((explorerValues) => explorerValues.resourcesToShow);
}

export function useSelectedShownResources() {
  return useCwdSegmentDerivedValuesSelector(
    (explorerValues) => explorerValues.selectedShownResources,
  );
}

export function useIsResourceSelected(resourceKey: string) {
  return useCwdSegmentDerivedValuesSelector((explorerValues) => {
    const isResourceSelected = !!explorerValues.selectedShownResources.find(
      (selectedResource) => selectedResource.key === resourceKey,
    );
    return isResourceSelected;
  });
}
