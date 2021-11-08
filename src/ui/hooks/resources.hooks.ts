import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as React from 'react';

import { createLogger } from '@app/base/logger/logger';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { config } from '@app/config';
import { Resource, ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { useResourceIconClasses } from '@app/global-cache/resource-icons';
import {
  useResources,
  getCachedResourcesOfDirectory,
  setCachedResourcesOfDirectory,
} from '@app/global-cache/resources';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { fileSystemRef } from '@app/operations/global-modules';
import { fetchResources } from '@app/platform/file-system';

const logger = createLogger('resources.hooks');

type ResourcesLoadingResult =
  | {
      dataAvailable: false;
      resources: ResourceForUI[];
    }
  | {
      dataAvailable: true;
      resources: ResourceForUI[];
    };
export const useResourcesForUI = (explorerId: string): ResourcesLoadingResult => {
  const cwd = useCwd(explorerId);
  const { data: resourcesQueryWithMetadataData, isFetching: resourcesQueryWithMetadataIsFetching } =
    useResources({ directory: cwd, resolveMetadata: true });
  const { data: filesQueryWithoutMetadataData } = useResources(
    { directory: cwd, resolveMetadata: false },
    { enabled: resourcesQueryWithMetadataData === undefined },
  );

  React.useEffect(
    function preloadChildrenOfParentAndAllSubDirectories() {
      if (resourcesQueryWithMetadataData === undefined || resourcesQueryWithMetadataIsFetching) {
        return;
      }

      const doPreloadContents = async () => {
        const parentDirectoryUri = URI.joinPath(URI.from(cwd), '..');
        const subDirectoriesUris = resourcesQueryWithMetadataData
          .filter((resource) => resource.resourceType === RESOURCE_TYPE.DIRECTORY)
          .map((resource) => resource.uri);
        const allDirectoriesUris = [parentDirectoryUri, ...subDirectoriesUris];

        await Promise.all(
          allDirectoriesUris
            .filter((uri) => {
              const cachedQueryData = getCachedResourcesOfDirectory({ directory: uri });
              if (cachedQueryData) {
                logger.debug(
                  `some data is already cached --> skip preloading of children of directory`,
                  { directory: formatter.resourcePath(uri) },
                );
                return false;
              }
              return true;
            })
            .map(async (uri) => {
              logger.debug(`start preloading of children of directory`, {
                directory: formatter.resourcePath(uri),
              });

              const fetchArgs = {
                directory: uri,
                resolveMetadata: false,
              };
              const contents = await fetchResources(fileSystemRef.current, fetchArgs);

              const cachedQueryData = getCachedResourcesOfDirectory(fetchArgs);
              if (cachedQueryData) {
                // in the meantime, some data for this query got loaded --> don't alter that data
                return;
              }

              setCachedResourcesOfDirectory(fetchArgs, contents);
            }),
        );
      };

      let preloadingIsNotNeccessaryAnymore = false;
      requestIdleCallback(() => {
        if (preloadingIsNotNeccessaryAnymore) {
          logger.debug(`skipped preloading children of parent and sub directories`, {
            uriContentsGetPreloadedFor: formatter.resourcePath(cwd),
          });
        }

        logger.debug(`preloading children of parent and sub directorie...`, {
          uriContentsGetPreloadedFor: formatter.resourcePath(cwd),
        });
        void doPreloadContents();
      });

      return () => {
        preloadingIsNotNeccessaryAnymore = true;
      };
    },
    [resourcesQueryWithMetadataData, resourcesQueryWithMetadataIsFetching, cwd],
  );

  let dataAvailable: boolean;
  let resourcesToUse: Resource[];
  if (resourcesQueryWithMetadataData !== undefined) {
    dataAvailable = true;
    resourcesToUse = resourcesQueryWithMetadataData;
  } else if (filesQueryWithoutMetadataData !== undefined) {
    dataAvailable = true;
    resourcesToUse = filesQueryWithoutMetadataData;
  } else {
    // files queries do not have any (possibly cached) data yet
    dataAvailable = false;
    resourcesToUse = [];
  }

  const resourcesForUI = React.useMemo(
    () =>
      resourcesToUse.map((resources) => {
        const { resourceName, extension } = uriHelper.extractNameAndExtension(resources.uri);

        const resourceForUI: ResourceForUI = {
          ...resources,
          extension,
          name: resourceName,
          tags: [],
        };
        return resourceForUI;
      }),
    [resourcesToUse],
  );

  return { dataAvailable, resources: resourcesForUI };
};

export function useThemeResourceIconClasses(resource: ResourceForUI) {
  let uri: UriComponents | undefined = resource.uri;
  if (
    !config.featureFlags.specificIconsForDirectories &&
    resource.resourceType === RESOURCE_TYPE.DIRECTORY
  ) {
    /**
     * if no specific icons for directories should be used, and the resource is a directory, don't query a resource icon via URI,
     * only by fileKind
     */
    uri = undefined;
  }

  const iconClasses = useResourceIconClasses({
    uri,
    resourceKind: mapResourceTypeToFileKind(resource.resourceType),
  });

  return iconClasses?.join(' ');
}

function mapResourceTypeToFileKind(resourceType: RESOURCE_TYPE) {
  if (resourceType === RESOURCE_TYPE.FILE) {
    return FileKind.FILE;
  } else if (resourceType === RESOURCE_TYPE.DIRECTORY) {
    return FileKind.FOLDER;
  } else {
    logger.warn(`could not map RESOURCE_TYPE to FileKind, fallback to FileKind.FILE`, {
      resourceType,
    });
    return FileKind.FILE;
  }
}
