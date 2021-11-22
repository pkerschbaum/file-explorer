import * as React from 'react';
import { Query, QueryCache } from 'react-query';

import { check } from '@app/base/utils/assert.util';
import { createPreloadParentDirAndSubdirsSubscription } from '@app/operations/global-cache-subscriptions/preload-parent-dir-and-subdirs';
import { createRefreshResourcesOfDirectorySubscription } from '@app/operations/global-cache-subscriptions/refresh-resources-of-directory';
import { queryClientRef } from '@app/operations/global-modules';

export type QueryCacheSubscription = {
  subscription: {
    digestCacheNotifyEvent?: (cacheNotifyEvent: QueryCacheNotifyEvent) => void;
    digestExistingQuery?: (query: Query) => void;
  };
  dispose?: () => void;
};

export type QueryCacheNotifyEvent = Parameters<
  Exclude<Parameters<QueryCache['subscribe']>[0], undefined>
>[0];

export function useGlobalCacheSubscriptions() {
  React.useEffect(() => {
    // instantiate subscriptions
    const refreshResourcesOfDirectorySubscription = createRefreshResourcesOfDirectorySubscription();
    const preloadParentDirAndSubdirsSubscription = createPreloadParentDirAndSubdirsSubscription();

    const allDigestExistingQueryFunctions = [
      refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery,
      preloadParentDirAndSubdirsSubscription.subscription.digestExistingQuery,
    ].filter(check.isNotNullish);
    const allDigestCacheNotifyEventFunctions = [
      refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent,
      preloadParentDirAndSubdirsSubscription.subscription.digestCacheNotifyEvent,
    ].filter(check.isNotNullish);
    const allDisposeFunctions = [
      refreshResourcesOfDirectorySubscription.dispose,
      preloadParentDirAndSubdirsSubscription.dispose,
    ].filter(check.isNotNullish);

    // run "digestExistingQuery" for all currently existing queries
    const allQueries = queryClientRef.current.getQueryCache().findAll();
    for (const query of allQueries) {
      for (const digestExistingQuery of allDigestExistingQueryFunctions) {
        digestExistingQuery(query);
      }
    }

    // setup a subscription on the QueryCache and run "digestCacheNotifyEvent" on every cache notify event
    const unsubscribeFromQueryCache = queryClientRef.current
      .getQueryCache()
      .subscribe((cacheNotifyEvent) => {
        for (const digestCacheNotifyEvent of allDigestCacheNotifyEventFunctions) {
          digestCacheNotifyEvent(cacheNotifyEvent);
        }
      });

    // return a cleanup function which will unsubscribe from the query cache and call "dispose" on all subscriptions
    return function cleanUp() {
      unsubscribeFromQueryCache();
      for (const dispose of allDisposeFunctions) {
        dispose();
      }
    };
  }, []);
}
