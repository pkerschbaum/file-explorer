import type { Query } from 'react-query';

import { DisposableStore, IDisposable } from '#pkg/base/lifecycle';
import { URI } from '#pkg/base/uri';
import { functions } from '#pkg/base/utils/functions.util';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import type { ResourcesOfDirectoryKey } from '#pkg/global-cache/query-keys';
import {
  isResourcesOfDirectoryQueryKey,
  RESOURCES_OF_DIRECTORY_KEY_PREFIX,
} from '#pkg/global-cache/query-keys';
import { refreshResourcesOfDirectory } from '#pkg/global-cache/resources';
import { createLogger } from '#pkg/operations/create-logger';
import type {
  QueryCacheNotifyEvent,
  QueryCacheSubscription,
} from '#pkg/operations/global-cache-subscriptions/setup-subscriptions';

const logger = createLogger('refresh-resources-of-directory');

export function createRefreshResourcesOfDirectorySubscription(): QueryCacheSubscription {
  const directoryWatchers = new Map<string, IDisposable>();

  const digestCacheNotifyEvent = createDigestCacheNotifyEvent(directoryWatchers);
  const digestExistingQuery = createDigestExistingQuery(directoryWatchers);

  const subscription = {
    digestCacheNotifyEvent,
    digestExistingQuery,
  };

  function dispose() {
    for (const disposable of directoryWatchers.values()) {
      disposable.dispose();
    }
    directoryWatchers.clear();
  }

  return {
    subscription,
    dispose,
  };
}

const createDigestCacheNotifyEvent =
  (directoryWatchers: Map<string, IDisposable>) => (cacheNotifyEvent: QueryCacheNotifyEvent) => {
    if (
      cacheNotifyEvent?.type === 'observerAdded' &&
      isResourcesOfDirectoryQueryKey(cacheNotifyEvent.query.queryKey)
    ) {
      const queryKey = cacheNotifyEvent.query.queryKey;
      logger.group('OBSERVER_FOR_RESOURCES_OF_DIRECTORY_QUERY_WAS_ADDED');

      addDirectoryWatcherIfNonePresent(queryKey, directoryWatchers).catch((error) => {
        logger.error(`could not add directory watcher`, error);
      });

      logger.groupEnd();
    }

    if (
      cacheNotifyEvent?.type === 'observerRemoved' &&
      isResourcesOfDirectoryQueryKey(cacheNotifyEvent.query.queryKey) &&
      cacheNotifyEvent.query.getObserversCount() === 0
    ) {
      const queryKey = cacheNotifyEvent.query.queryKey;
      logger.group('LAST_OBSERVER_OF_RESOURCES_OF_DIRECTORY_QUERY_REMOVED');

      logger.debug(
        `all observers of a particular ${RESOURCES_OF_DIRECTORY_KEY_PREFIX} query got removed --> disposing watcher...`,
        { queryKey },
      );

      const directoryUri = URI.parse(queryKey[1].directoryId);
      const comparisonKey = uriHelper.getComparisonKey(directoryUri);

      const activeWatcher = directoryWatchers.get(comparisonKey);
      if (!activeWatcher) {
        logger.debug('no directory watcher was present for the given directory', { queryKey });
      } else {
        activeWatcher.dispose();
        directoryWatchers.delete(comparisonKey);
        logger.debug('directory watcher removed!', { queryKey });
      }

      logger.groupEnd();
    }
  };

const createDigestExistingQuery =
  (directoryWatchers: Map<string, IDisposable>) => (query: Query) => {
    if (isResourcesOfDirectoryQueryKey(query.queryKey)) {
      addDirectoryWatcherIfNonePresent(query.queryKey, directoryWatchers).catch((error) => {
        logger.error(`could not add directory watcher`, error);
      });
    }
  };

async function addDirectoryWatcherIfNonePresent(
  queryKey: ResourcesOfDirectoryKey,
  directoryWatchers: Map<string, IDisposable>,
) {
  logger.debug(
    `observer for ${RESOURCES_OF_DIRECTORY_KEY_PREFIX} query added --> create directory watcher if none is present...`,
    { queryKey },
  );

  const directoryUri = URI.parse(queryKey[1].directoryId);
  const comparisonKey = uriHelper.getComparisonKey(directoryUri);

  if (directoryWatchers.get(comparisonKey) !== undefined) {
    logger.debug('directory watcher for the given directory is already present', { queryKey });
  } else {
    logger.debug('no directory watcher present --> creating (throttled) watcher...', { queryKey });
    const watcherDisposable = await globalThis.modules.fileSystem.watch(directoryUri);
    const [throttledRefreshResourcesOfDirectory] = functions.throttle(
      refreshResourcesOfDirectory,
      200,
    );
    const onResourceChangedDisposable = await globalThis.modules.fileSystem.onResourceChanged(
      directoryUri,
      () => {
        logger.debug('refreshing of resources is necessary, trigger refresh...', { queryKey });
        throttledRefreshResourcesOfDirectory({ directory: directoryUri }, { active: true });
      },
    );
    const disposables = new DisposableStore();
    disposables.add(watcherDisposable);
    disposables.add(onResourceChangedDisposable);
    directoryWatchers.set(comparisonKey, disposables);

    logger.debug('directory watcher created!', { queryKey });
  }
}
