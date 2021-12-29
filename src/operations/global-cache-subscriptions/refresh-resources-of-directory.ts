import {
  DisposableStore,
  IDisposable,
} from '@pkerschbaum/code-oss-file-service/out/vs/base/common/lifecycle';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { Query } from 'react-query';

import { functions } from '@app/base/utils/functions.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import {
  isResourcesOfDirectoryQueryKey,
  ResourcesOfDirectoryKey,
  RESOURCES_OF_DIRECTORY_KEY_PREFIX,
} from '@app/global-cache/query-keys';
import { refreshResourcesOfDirectory } from '@app/global-cache/resources';
import { createLogger } from '@app/operations/create-logger';
import type {
  QueryCacheNotifyEvent,
  QueryCacheSubscription,
} from '@app/operations/global-cache-subscriptions/setup-subscriptions';
import { fileSystemRef } from '@app/operations/global-modules';

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

      addDirectoryWatcherIfNonePresent(queryKey, directoryWatchers);

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
      addDirectoryWatcherIfNonePresent(query.queryKey, directoryWatchers);
    }
  };

function addDirectoryWatcherIfNonePresent(
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
    const watcherDisposable = fileSystemRef.current.watch(directoryUri);
    const [throttledRefreshResourcesOfDirectory] = functions.throttle(
      refreshResourcesOfDirectory,
      200,
    );
    const didFilesChangeDisposable = fileSystemRef.current.onDidFilesChange((e) => {
      logger.debug(
        'did receive onDidFilesChange event --> checking if refreshing resources of directory is necessary...',
        { queryKey, fileChangesEvent: JSON.parse(JSON.stringify(e)) as {} },
      );
      if (e.affects(directoryUri)) {
        logger.debug('refreshing of resources is necessary, trigger refresh...', { queryKey });
        throttledRefreshResourcesOfDirectory({ directory: directoryUri }, { active: true });
      } else {
        logger.debug('refreshing of resources is not necessary, skipping.', { queryKey });
      }
    });
    const disposables = new DisposableStore();
    disposables.add(watcherDisposable);
    disposables.add(didFilesChangeDisposable);
    directoryWatchers.set(comparisonKey, disposables);

    logger.debug('directory watcher created!', { queryKey });
  }
}
