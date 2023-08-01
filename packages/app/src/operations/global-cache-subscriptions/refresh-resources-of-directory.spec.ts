import type { Query } from 'react-query';

import type { IDisposable } from '@app/base/lifecycle';
import { network } from '@app/base/network';
import { uriHelper } from '@app/base/utils/uri-helper';
import { RESOURCES_OF_DIRECTORY_KEY_PREFIX } from '@app/global-cache/query-keys';
import type { QueryCacheNotifyEvent } from '@app/operations/global-cache-subscriptions';
import { createRefreshResourcesOfDirectorySubscription } from '@app/operations/global-cache-subscriptions/refresh-resources-of-directory';
import type { PlatformFileSystem } from '@app/platform/file-system.types';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';

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
  const fakeOnDidFilesChange = jest.fn(() => {
    const newDisposable = new DummyDisposable();
    allCreatedDisposables.push(newDisposable);
    return newDisposable;
  });

  const fakeFileSystem = {
    watch: fakeWatch,
    onDidFilesChange: fakeOnDidFilesChange,
  } as unknown as PlatformFileSystem;

  return {
    allCreatedDisposables,
    fakeWatch,
    fakeOnDidFilesChange,
    fakeFileSystem,
  };
}

describe('refresh-resources-of-directory', () => {
  it('dispose() of subscription should dispose all aquired watch() and onDidFilesChange() disposables', async () => {
    await initializeFakePlatformModules();
    const { allCreatedDisposables, fakeWatch, fakeOnDidFilesChange, fakeFileSystem } =
      createFakeFileSystem();
    globalThis.modules.fileSystem = fakeFileSystem;

    const refreshResourcesOfDirectorySubscription = createRefreshResourcesOfDirectorySubscription();

    if (
      !refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent ||
      !refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery ||
      !refreshResourcesOfDirectorySubscription.dispose
    ) {
      throw new Error(`digestCacheNotifyEvent, digestExistingQuery and dispose must be defined`);
    }

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

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnDidFilesChange).toHaveBeenCalledTimes(1);
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

    expect(fakeWatch).toHaveBeenCalledTimes(2);
    expect(fakeOnDidFilesChange).toHaveBeenCalledTimes(2);
    expect(allCreatedDisposables).toHaveLength(4);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(false);
    }

    refreshResourcesOfDirectorySubscription.dispose();

    expect(fakeWatch).toHaveBeenCalledTimes(2);
    expect(fakeOnDidFilesChange).toHaveBeenCalledTimes(2);
    expect(allCreatedDisposables).toHaveLength(4);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(true);
    }
  });

  it('no second watcher should get set up for already watched directories', async () => {
    await initializeFakePlatformModules();
    const { allCreatedDisposables, fakeWatch, fakeOnDidFilesChange, fakeFileSystem } =
      createFakeFileSystem();
    globalThis.modules.fileSystem = fakeFileSystem;

    const refreshResourcesOfDirectorySubscription = createRefreshResourcesOfDirectorySubscription();

    if (
      !refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent ||
      !refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery ||
      !refreshResourcesOfDirectorySubscription.dispose
    ) {
      throw new Error(`digestCacheNotifyEvent, digestExistingQuery and dispose must be defined`);
    }

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

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnDidFilesChange).toHaveBeenCalledTimes(1);
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

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnDidFilesChange).toHaveBeenCalledTimes(1);
    expect(allCreatedDisposables).toHaveLength(2);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(false);
    }
  });

  it('when observer gets removed, the active file watcher should get released', async () => {
    await initializeFakePlatformModules();
    const { allCreatedDisposables, fakeWatch, fakeOnDidFilesChange, fakeFileSystem } =
      createFakeFileSystem();
    globalThis.modules.fileSystem = fakeFileSystem;

    const refreshResourcesOfDirectorySubscription = createRefreshResourcesOfDirectorySubscription();

    if (
      !refreshResourcesOfDirectorySubscription.subscription.digestCacheNotifyEvent ||
      !refreshResourcesOfDirectorySubscription.subscription.digestExistingQuery ||
      !refreshResourcesOfDirectorySubscription.dispose
    ) {
      throw new Error(`digestCacheNotifyEvent, digestExistingQuery and dispose must be defined`);
    }

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

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnDidFilesChange).toHaveBeenCalledTimes(1);
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

    expect(fakeWatch).toHaveBeenCalledTimes(1);
    expect(fakeOnDidFilesChange).toHaveBeenCalledTimes(1);
    expect(allCreatedDisposables).toHaveLength(2);
    for (const disposable of allCreatedDisposables) {
      expect(disposable.isDisposed).toBe(true);
    }
  });
});
