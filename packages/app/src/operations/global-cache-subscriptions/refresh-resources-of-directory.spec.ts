import type { Query } from 'react-query';
import invariant from 'tiny-invariant';

import type { IDisposable } from '#pkg/base/lifecycle';
import { network } from '#pkg/base/network';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import { RESOURCES_OF_DIRECTORY_KEY_PREFIX } from '#pkg/global-cache/query-keys';
import type { QueryCacheNotifyEvent } from '#pkg/operations/global-cache-subscriptions';
import { createRefreshResourcesOfDirectorySubscription } from '#pkg/operations/global-cache-subscriptions/refresh-resources-of-directory';
import type { PlatformFileSystem } from '#pkg/platform/file-system.types';

import { initializeFakePlatformModules } from '#pkg-test/utils/fake-platform-modules';

class DummyDisposable implements IDisposable {
  public isDisposed = false;
  public dispose(): void {
    if (this.isDisposed) {
      throw new Error(`was already disposed`);
    }
    this.isDisposed = true;
  }
}

function createFakeFileSystem() {
  const allCreatedDisposables: DummyDisposable[] = [];
  const fakeWatch = jest.fn(() => {
    const newDisposable = new DummyDisposable();
    allCreatedDisposables.push(newDisposable);
    return newDisposable;
  });
  const fakeOnResourceChanged = jest.fn(() => {
    const newDisposable = new DummyDisposable();
    allCreatedDisposables.push(newDisposable);
    return newDisposable;
  });

  const fakeFileSystem = {
    watch: fakeWatch,
    onResourceChanged: fakeOnResourceChanged,
  } as unknown as PlatformFileSystem;

  return {
    allCreatedDisposables,
    fakeWatch,
    fakeOnResourceChanged,
    fakeFileSystem,
  };
}

describe('refresh-resources-of-directory', () => {
  it('dispose() of subscription should dispose all aquired watch() and onDidFilesChange() disposables', async () => {
    await initializeFakePlatformModules();
    const { allCreatedDisposables, fakeWatch, fakeOnResourceChanged, fakeFileSystem } =
      createFakeFileSystem();
    globalThis.modules.fileSystem = fakeFileSystem;

    const refreshResourcesOfDirectorySubscription = createRefreshResourcesOfDirectorySubscription();

    invariant(
      refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent &&
        refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery &&
        refreshResourcesOfDirectorySubscription.dispose,
    );

    const fakeQuery: Pick<Query, 'queryKey'> = {
      queryKey: [
        RESOURCES_OF_DIRECTORY_KEY_PREFIX,
        {
          directoryId: uriHelper.getComparisonKey(
            uriHelper.parseUri(network.Schemas.file, `/home/testdir`),
          ),
        },
      ],
    };
    refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery(fakeQuery as Query);
    await workaround();

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnResourceChanged).toHaveBeenCalledTimes(1);
    expect(allCreatedDisposables).toHaveLength(2);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(false);
    }

    const fakeCacheNotifyEvent = {
      type: 'observerAdded',
      query: {
        queryKey: [
          RESOURCES_OF_DIRECTORY_KEY_PREFIX,
          {
            directoryId: uriHelper.getComparisonKey(
              uriHelper.parseUri(network.Schemas.file, `/home/testdir2`),
            ),
          },
        ],
      },
    } as QueryCacheNotifyEvent;
    refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent(
      fakeCacheNotifyEvent,
    );
    await workaround();

    expect(fakeWatch).toHaveBeenCalledTimes(2);
    expect(fakeOnResourceChanged).toHaveBeenCalledTimes(2);
    expect(allCreatedDisposables).toHaveLength(4);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(false);
    }

    refreshResourcesOfDirectorySubscription.dispose();
    await workaround();

    expect(fakeWatch).toHaveBeenCalledTimes(2);
    expect(fakeOnResourceChanged).toHaveBeenCalledTimes(2);
    expect(allCreatedDisposables).toHaveLength(4);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(true);
    }
  });

  it('no second watcher should get set up for already watched directories', async () => {
    await initializeFakePlatformModules();
    const { allCreatedDisposables, fakeWatch, fakeOnResourceChanged, fakeFileSystem } =
      createFakeFileSystem();
    globalThis.modules.fileSystem = fakeFileSystem;

    const refreshResourcesOfDirectorySubscription = createRefreshResourcesOfDirectorySubscription();

    invariant(
      refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent &&
        refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery &&
        refreshResourcesOfDirectorySubscription.dispose,
    );

    const fakeQuery1: Pick<Query, 'queryKey'> = {
      queryKey: [
        RESOURCES_OF_DIRECTORY_KEY_PREFIX,
        {
          directoryId: uriHelper.getComparisonKey(
            uriHelper.parseUri(network.Schemas.file, `/home/testdir`),
          ),
        },
      ],
    };
    refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery(fakeQuery1 as Query);
    await workaround();

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnResourceChanged).toHaveBeenCalledTimes(1);
    expect(allCreatedDisposables).toHaveLength(2);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(false);
    }

    const fakeQuery2: Pick<Query, 'queryKey'> = {
      queryKey: [
        RESOURCES_OF_DIRECTORY_KEY_PREFIX,
        {
          directoryId: uriHelper.getComparisonKey(
            uriHelper.parseUri(network.Schemas.file, `/home/testdir`),
          ),
        },
      ],
    };
    refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery(fakeQuery2 as Query);
    await workaround();

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnResourceChanged).toHaveBeenCalledTimes(1);
    expect(allCreatedDisposables).toHaveLength(2);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(false);
    }
  });

  it('when observer gets removed, the active file watcher should get released', async () => {
    await initializeFakePlatformModules();
    const { allCreatedDisposables, fakeWatch, fakeOnResourceChanged, fakeFileSystem } =
      createFakeFileSystem();
    globalThis.modules.fileSystem = fakeFileSystem;

    const refreshResourcesOfDirectorySubscription = createRefreshResourcesOfDirectorySubscription();

    invariant(
      refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent &&
        refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery &&
        refreshResourcesOfDirectorySubscription.dispose,
    );

    const fakeCacheNotifyEvent1 = {
      type: 'observerAdded',
      query: {
        queryKey: [
          RESOURCES_OF_DIRECTORY_KEY_PREFIX,
          {
            directoryId: uriHelper.getComparisonKey(
              uriHelper.parseUri(network.Schemas.file, `/home/testdir`),
            ),
          },
        ],
      },
    } as QueryCacheNotifyEvent;
    refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent(
      fakeCacheNotifyEvent1,
    );
    await workaround();

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnResourceChanged).toHaveBeenCalledTimes(1);
    expect(allCreatedDisposables).toHaveLength(2);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(false);
    }

    const fakeCacheNotifyEvent2 = {
      type: 'observerRemoved',
      query: {
        queryKey: [
          RESOURCES_OF_DIRECTORY_KEY_PREFIX,
          {
            directoryId: uriHelper.getComparisonKey(
              uriHelper.parseUri(network.Schemas.file, `/home/testdir`),
            ),
          },
        ],
        getObserversCount: () => 0,
      },
    } as QueryCacheNotifyEvent;
    refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent(
      fakeCacheNotifyEvent2,
    );
    await workaround();

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnResourceChanged).toHaveBeenCalledTimes(1);
    expect(allCreatedDisposables).toHaveLength(2);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(true);
    }
  });
});

/**
 * TODO remove me
 */
async function workaround() {
  for (let index = 0; index < 5; index++) {
    await Promise.resolve();
  }
}
