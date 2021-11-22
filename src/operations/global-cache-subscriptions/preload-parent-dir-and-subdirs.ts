import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { createLogger } from '@app/base/logger/logger';
import { formatter } from '@app/base/utils/formatter.util';
import { Resource, RESOURCE_TYPE } from '@app/domain/types';
import {
  isResourcesOfDirectoryQueryKey,
  RESOURCES_OF_DIRECTORY_KEY_PREFIX,
} from '@app/global-cache/query-keys';
import {
  getCachedResourcesOfDirectory,
  setCachedResourcesOfDirectory,
} from '@app/global-cache/resources';
import type {
  QueryCacheNotifyEvent,
  QueryCacheSubscription,
} from '@app/operations/global-cache-subscriptions/setup-subscriptions';
import { fileSystemRef } from '@app/operations/global-modules';
import { fetchResources } from '@app/platform/file-system';

const logger = createLogger('preload-parent-dir-and-subdirs');

export function createPreloadParentDirAndSubdirsSubscription(): QueryCacheSubscription {
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
    const queryData: Resource[] = cacheNotifyEvent.query.state.data;
    logger.group('RESOURCES_OF_DIRECTORY_QUERY_WITH_OBSERVERS_WAS_UPDATED');

    logger.debug(
      `data for a ${RESOURCES_OF_DIRECTORY_KEY_PREFIX} query with at least one observer was updated ` +
        `--> preload contents of parent directory and sub directories...`,
      { queryKey },
    );

    requestIdleCallback(() => {
      logger.debug(`preloading resources of parent and sub directories...`, {
        uriContentsGetPreloadedFor: formatter.resourcePath(directoryUri),
      });
      void doPreloadResources(directoryUri, queryData);
    });

    logger.groupEnd();
  }
}

async function doPreloadResources(directoryUri: URI, childrenOfDirectory: Resource[]) {
  const parentDirectoryUri = URI.joinPath(directoryUri, '..');
  const subDirectoriesUris = childrenOfDirectory
    .filter((resource) => resource.resourceType === RESOURCE_TYPE.DIRECTORY)
    .map((resource) => resource.uri);

  let allDirectoriesUris;
  if (resources.isEqual(directoryUri, parentDirectoryUri)) {
    logger.debug(
      `no parent directory could be determined present --> only preload sub directories...`,
      {
        uriContentsGetPreloadedFor: formatter.resourcePath(directoryUri),
        computedParentDirectoryUri: formatter.resourcePath(parentDirectoryUri),
      },
    );
    allDirectoriesUris = subDirectoriesUris;
  } else {
    allDirectoriesUris = [parentDirectoryUri, ...subDirectoriesUris];
  }

  const allDirectoriesWithoutAlreadyCachedData = allDirectoriesUris.filter((uri) => {
    const cachedQueryData = getCachedResourcesOfDirectory({ directory: uri });
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
      const contents = await fetchResources(fileSystemRef.current, fetchArgs);

      const cachedQueryData = getCachedResourcesOfDirectory(fetchArgs);
      if (cachedQueryData) {
        logger.debug(
          `in the meantime, some data for this query got loaded ` +
            `--> fetched resources will not be stored so that existing data is not altered.`,
          { directory: formattedDirectory },
        );
        return;
      } else {
        logger.debug(`fetched resources, caching them...`, { directory: formattedDirectory });
        setCachedResourcesOfDirectory(fetchArgs, contents);
        logger.debug(`fetched resources got cached.`, { directory: formattedDirectory });
      }
    }),
  );
}
