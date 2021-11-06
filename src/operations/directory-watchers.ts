import {
  DisposableStore,
  IDisposable,
} from '@pkerschbaum/code-oss-file-service/out/vs/base/common/lifecycle';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { createLogger } from '@app/base/logger/logger';
import { uriHelper } from '@app/base/utils/uri-helper';
import { refreshDirectoryContent } from '@app/global-cache/files';
import { DirectoryContentKey, DIRECTORY_CONTENT_KEY_PREFIX } from '@app/global-cache/query-keys';
import { fileSystemRef, queryClientRef } from '@app/operations/global-modules';

const logger = createLogger('directory-watchers');

export function useDirectoryWatchers() {
  React.useEffect(() => {
    const directoryWatchers = new Map<string, IDisposable>();
    const unsubscribeFromQueryCache = queryClientRef.current
      .getQueryCache()
      .subscribe((cacheNotifyEvent) => {
        if (
          cacheNotifyEvent?.type === 'observerAdded' &&
          Array.isArray(cacheNotifyEvent.query.queryKey) &&
          cacheNotifyEvent.query.queryKey.length > 0 &&
          cacheNotifyEvent.query.queryKey[0] === DIRECTORY_CONTENT_KEY_PREFIX
        ) {
          const queryKey = cacheNotifyEvent.query.queryKey as DirectoryContentKey;
          logger.group('DIRECTORY_CONTENT_QUERY_WITH_OBSERVER_ADDED');

          logger.debug(
            'directory content query with observer added --> create directory watcher if none is present...',
            { queryKey },
          );

          const directoryUri = URI.parse(queryKey[1].directoryId);

          if (directoryWatchers.get(uriHelper.getComparisonKey(directoryUri)) !== undefined) {
            logger.debug('directory watcher already present', { queryKey });
          } else {
            logger.debug('no directory watcher present --> creating watcher...', { queryKey });
            const watcherDisposable = fileSystemRef.current.watch(directoryUri);
            const didFilesChangeDisposable = fileSystemRef.current.onDidFilesChange((e) => {
              if (e.affects(directoryUri)) {
                void refreshDirectoryContent({ directory: directoryUri }, { active: true });
              }
            });
            const disposables = new DisposableStore();
            disposables.add(watcherDisposable);
            disposables.add(didFilesChangeDisposable);
            directoryWatchers.set(uriHelper.getComparisonKey(directoryUri), disposables);

            logger.debug('directory watcher created!', { queryKey });
          }

          logger.groupEnd();
        }
        if (
          cacheNotifyEvent?.type === 'observerRemoved' &&
          cacheNotifyEvent.query.getObserversCount() === 0 &&
          Array.isArray(cacheNotifyEvent.query.queryKey) &&
          cacheNotifyEvent.query.queryKey.length > 0 &&
          cacheNotifyEvent.query.queryKey[0] === DIRECTORY_CONTENT_KEY_PREFIX
        ) {
          const queryKey = cacheNotifyEvent.query.queryKey as DirectoryContentKey;
          logger.group('LAST_OBSERVER_OF_DIRECTORY_CONTENT_REMOVED');

          logger.debug(
            'all observers of a particular directory-content query got removed --> disposing watcher...',
            { queryKey },
          );

          const directoryUri = URI.parse(queryKey[1].directoryId);
          const activeWatcher = directoryWatchers.get(uriHelper.getComparisonKey(directoryUri));
          if (!activeWatcher) {
            logger.debug('no directory watcher was present', { queryKey });
          } else {
            activeWatcher.dispose();
            directoryWatchers.delete(uriHelper.getComparisonKey(directoryUri));
            logger.debug('directory watcher removed!', { queryKey });
          }

          logger.groupEnd();
        }
      });

    return function cleanUp() {
      unsubscribeFromQueryCache();
      for (const disposable of directoryWatchers.values()) {
        disposable.dispose();
      }
    };
  }, []);
}
