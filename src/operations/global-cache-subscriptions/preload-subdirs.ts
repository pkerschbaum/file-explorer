import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { formatter } from '@app/base/utils/formatter.util';
import { ResourceStat, RESOURCE_TYPE } from '@app/domain/types';
import {
  isResourcesOfDirectoryQueryKey,
  RESOURCES_OF_DIRECTORY_KEY_PREFIX,
} from '@app/global-cache/query-keys';
import {
  getCachedResourcesOfDirectory,
  setCachedResourcesOfDirectory,
} from '@app/global-cache/resources';
import { createLogger } from '@app/operations/create-logger';
import type {
  QueryCacheNotifyEvent,
  QueryCacheSubscription,
} from '@app/operations/global-cache-subscriptions/setup-subscriptions';
import { fileSystemRef } from '@app/operations/global-modules';

const logger = createLogger('preload-subdirs');

export function createPreloadSubdirsSubscription(): QueryCacheSubscription {
  const subscription = {
    digestCacheNotifyEvent,
  };

  return { subscription };
}

function digestCacheNotifyEvent(cacheNotifyEvent: QueryCacheNotifyEvent) {
  if (
    cacheNotifyEvent?.type === 'queryUpdated' &&
    isResourcesOfDirectoryQueryKey(cacheNotifyEvent.query.queryKey) &&
    cacheNotifyEvent.query.queryKey[1].resolveMetadata &&
    cacheNotifyEvent.query.getObserversCount() > 0 &&
    cacheNotifyEvent.query.state.status === 'success'
  ) {
    const queryKey = cacheNotifyEvent.query.queryKey;
    const directoryUri = URI.parse(queryKey[1].directoryId);
    const queryData: ResourceStat[] = cacheNotifyEvent.query.state.data;
    logger.group('RESOURCES_OF_DIRECTORY_QUERY_WITH_OBSERVERS_WAS_UPDATED');

    logger.debug(
      `data for a ${RESOURCES_OF_DIRECTORY_KEY_PREFIX} query with at least one observer was updated ` +
        `--> preload contents of sub directories...`,
      { queryKey },
    );

    requestIdleCallback(() => {
      logger.debug(`preloading resources of sub directories...`, {
        uriContentsGetPreloadedFor: formatter.resourcePath(directoryUri),
      });
      void doPreloadResources(queryData);
    });

    logger.groupEnd();
  }
}

async function doPreloadResources(childrenOfDirectory: ResourceStat[]) {
  const subDirectoriesUris = childrenOfDirectory
    .filter((resource) => resource.resourceType === RESOURCE_TYPE.DIRECTORY)
    .map((resource) => resource.uri);

  const allDirectoriesWithoutAlreadyCachedData = subDirectoriesUris.filter((uri) => {
    const cachedQueryData = getCachedResourcesOfDirectory(uri);
    if (cachedQueryData) {
      logger.debug(`some data is already cached --> skip preloading of resources of directory.`, {
        directory: formatter.resourcePath(uri),
      });
      return false;
    }
    return true;
  });

  await Promise.all(
    allDirectoriesWithoutAlreadyCachedData.map(async (uri) => {
      const formattedDirectory = formatter.resourcePath(uri);
      logger.debug(`fetching resources of directory...`, { directory: formattedDirectory });

      const fetchArgs = {
        directory: uri,
        resolveMetadata: false,
      };
      const statsWithMetadata = await fileSystemRef.current.resolve(URI.from(fetchArgs.directory), {
        resolveMetadata: fetchArgs.resolveMetadata,
      });

      const cachedQueryData = getCachedResourcesOfDirectory(fetchArgs.directory);
      if (cachedQueryData) {
        logger.debug(
          `in the meantime, some data for this query got loaded ` +
            `--> fetched resources will not be stored so that existing data is not altered.`,
          { directory: formattedDirectory },
        );
        return;
      } else {
        logger.debug(`fetched resources, caching them...`, { directory: formattedDirectory });
        setCachedResourcesOfDirectory(fetchArgs, statsWithMetadata.children ?? []);
        logger.debug(`fetched resources got cached.`, { directory: formattedDirectory });
      }
    }),
  );
}
