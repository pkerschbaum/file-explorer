import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import type { ProgressCbArgs } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as uuid from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uuid';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { CustomError } from '@app/base/custom-error';
import { formatter } from '@app/base/utils/formatter.util';
import { objects } from '@app/base/utils/objects.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import {
  DeleteProcess,
  DELETE_PROCESS_STATUS,
  ResourceStatMap,
  ResourcesToTags,
  PROCESS_TYPE,
  Tag,
  ResourceStat,
  RESOURCE_TYPE,
} from '@app/domain/types';
import {
  getCachedResourcesOfDirectory,
  refreshResourcesOfDirectory,
  setCachedResourcesOfDirectory,
} from '@app/global-cache/resources';
import { mapProcess } from '@app/global-state/slices/processes.hooks';
import { actions } from '@app/global-state/slices/processes.slice';
import { actions as tagsSliceActions } from '@app/global-state/slices/tags.slice';
import { createLogger } from '@app/operations/create-logger';
import * as tagOperations from '@app/operations/tag.operations';

const logger = createLogger('resource.operations');

export function scheduleMoveResourcesToTrash(uris: UriComponents[]) {
  if (uris.length < 1) {
    return;
  }

  const deleteProcess: Omit<DeleteProcess, 'status'> = {
    type: PROCESS_TYPE.DELETE,
    id: uuid.generateUuid(),
    uris,
  };
  globalThis.modules.dispatch(actions.addDeleteProcess(deleteProcess));
}

export async function runDeleteProcess(deleteProcessId: string, options: { useTrash: boolean }) {
  const processes = globalThis.modules.store.getState().processesSlice.processes.map(mapProcess);
  const deleteProcess = processes.find((process) => process.id === deleteProcessId);
  if (!deleteProcess || deleteProcess.type !== PROCESS_TYPE.DELETE) {
    throw new Error(`could not find delete process, deleteProcessId=${deleteProcessId}`);
  }

  globalThis.modules.dispatch(
    actions.updateDeleteProcess({ id: deleteProcessId, status: DELETE_PROCESS_STATUS.RUNNING }),
  );

  // delete all resources (in parallel)
  try {
    await Promise.all(
      deleteProcess.uris.map(async (uri) => {
        let fileStat;
        try {
          fileStat = await globalThis.modules.fileSystem.resolve(URI.from(uri));
        } catch (err) {
          logger.warn(
            `could not resolve resource which should get deleted --> skipping deletion of the resource.`,
            { uri },
          );
          return;
        }

        try {
          if (options.useTrash) {
            await globalThis.modules.fileSystem.trash(uri, { recursive: fileStat.isDirectory });
          } else {
            await globalThis.modules.fileSystem.del(uri, { recursive: fileStat.isDirectory });
          }
        } catch (err) {
          logger.error(`could not delete resources`, err);
          throw err;
        }
      }),
    );

    globalThis.modules.dispatch(
      actions.updateDeleteProcess({ id: deleteProcessId, status: DELETE_PROCESS_STATUS.SUCCESS }),
    );
  } catch (err: unknown) {
    globalThis.modules.dispatch(
      actions.updateDeleteProcess({
        id: deleteProcessId,
        status: DELETE_PROCESS_STATUS.FAILURE,
        error: err instanceof Error ? err.message : `Unknown error occured`,
      }),
    );
  }

  // invalidate resources of all affected directories
  const distinctParents = uriHelper.getDistinctParents(deleteProcess.uris);
  await Promise.all(distinctParents.map((directory) => refreshResourcesOfDirectory({ directory })));
}

export function removeProcess(processId: string) {
  globalThis.modules.dispatch(actions.removeProcess({ id: processId }));
}

export async function openFiles(uris: UriComponents[]) {
  await globalThis.modules.nativeHost.shell.openPath(uris);
}

export function cutOrCopyResources(resources: UriComponents[], cut: boolean) {
  if (resources.length < 1) {
    return;
  }

  globalThis.modules.nativeHost.clipboard.writeResources(
    resources.map((resource) => URI.from(resource)),
  );
  globalThis.modules.dispatch(actions.cutOrCopyResources({ cut }));
}

export async function renameResource(resourceURI: UriComponents, uriToRenameTo: UriComponents) {
  const fileStatOfSourceResource = await globalThis.modules.fileSystem.resolve(
    URI.from(resourceURI),
    {
      resolveMetadata: true,
    },
  );
  await executeCopyOrMove({
    sourceResource: { uri: URI.from(resourceURI), fileStat: fileStatOfSourceResource },
    targetResource: { uri: URI.from(uriToRenameTo) },
    pasteShouldMove: true,
  });

  const distinctParents = uriHelper.getDistinctParents([resourceURI, uriToRenameTo]);
  await Promise.all(distinctParents.map((directory) => refreshResourcesOfDirectory({ directory })));
}

export async function resolveDeep(
  targetToResolve: UriComponents,
  targetStat: IFileStatWithMetadata,
) {
  const resourceStatMap: ResourceStatMap = {};
  await resolveDeepRecursive(targetToResolve, targetStat, resourceStatMap);
  return resourceStatMap;
}

async function resolveDeepRecursive(
  targetToResolve: UriComponents,
  targetStat: IFileStatWithMetadata,
  resultMap: ResourceStatMap,
) {
  if (!targetStat.isDirectory) {
    resultMap[uriHelper.getComparisonKey(targetToResolve)] = targetStat;
  } else if (targetStat.children && targetStat.children.length > 0) {
    // recursive resolve
    await Promise.all(
      targetStat.children.map(async (child) => {
        const childStat = await globalThis.modules.fileSystem.resolve(child.resource, {
          resolveMetadata: true,
        });
        return resolveDeepRecursive(child.resource, childStat, resultMap);
      }),
    );
  }
}

export function getTagsOfResource(
  resourcesToTags: ResourcesToTags,
  resource: { uri: UriComponents; ctime: number },
): Tag[] {
  const tagIdsOfResource = resourcesToTags[uriHelper.getComparisonKey(resource.uri)];

  if (
    tagIdsOfResource === undefined ||
    tagIdsOfResource.tags.length === 0 ||
    tagIdsOfResource.ctimeOfResource !== resource.ctime
  ) {
    return [];
  }

  const tags = tagOperations.getTags();
  const tagsOfResource = Object.entries(tags)
    .map(([id, otherValues]) => ({ ...otherValues, id }))
    .filter((tag) => tagIdsOfResource.tags.some((tagId) => tagId === tag.id));

  logger.debug(`got tags of resource from storage`, { resource, tagsOfResource });

  return tagsOfResource;
}

export async function addTagsToResources(resources: UriComponents[], tagIds: string[]) {
  logger.debug(`adding tags to resources...`, { resources, tagIds });

  const existingTagIds = Object.keys(tagOperations.getTags());
  const invalidTagIds = tagIds.filter(
    (tagId) => !existingTagIds.find((existing) => existing === tagId),
  );
  if (invalidTagIds.length > 0) {
    throw new CustomError(`at least one tag which should be added is not present in the storage`, {
      invalidTagIds,
    });
  }

  const resourcesToTagsMap = objects.deepCopyJson(
    globalThis.modules.store.getState().tagsSlice.resourcesToTags,
  );

  await Promise.all(
    resources.map(async (resource) => {
      const statOfResource = await globalThis.modules.fileSystem.resolve(URI.from(resource), {
        resolveMetadata: true,
      });

      let existingTagsOfResource = resourcesToTagsMap[uriHelper.getComparisonKey(resource)];
      if (
        existingTagsOfResource === undefined ||
        existingTagsOfResource.ctimeOfResource !== statOfResource.ctime
      ) {
        existingTagsOfResource = { ctimeOfResource: statOfResource.ctime, tags: [] };
        resourcesToTagsMap[uriHelper.getComparisonKey(resource)] = existingTagsOfResource;
      }
      existingTagsOfResource.tags.push(...tagIds);
    }),
  );

  globalThis.modules.dispatch(
    tagsSliceActions.storeResourcesToTags({ resourcesToTags: resourcesToTagsMap }),
  );

  logger.debug(`tags to resources added and stored in storage!`);
}

export function removeTagsFromResources(resources: UriComponents[], tagIds: string[]) {
  logger.debug(`removing tags from resources...`, { resources, tagIds });

  const resourcesToTagsMap = objects.deepCopyJson(
    globalThis.modules.store.getState().tagsSlice.resourcesToTags,
  );

  for (const resource of resources) {
    const existingTagsOfResource = resourcesToTagsMap[uriHelper.getComparisonKey(resource)];
    if (existingTagsOfResource !== undefined) {
      existingTagsOfResource.tags = existingTagsOfResource.tags.filter(
        (existingTagId) => !tagIds.some((tagIdToRemove) => tagIdToRemove === existingTagId),
      );
      resourcesToTagsMap[uriHelper.getComparisonKey(resource)] = existingTagsOfResource;
    }
  }

  globalThis.modules.dispatch(
    tagsSliceActions.storeResourcesToTags({ resourcesToTags: resourcesToTagsMap }),
  );

  logger.debug(`tags from resources removed!`);
}

export async function executeCopyOrMove({
  sourceResource,
  targetResource,
  pasteShouldMove,
  cancellationTokenSource,
  progressCb,
}: {
  sourceResource: { uri: URI; fileStat: IFileStatWithMetadata };
  targetResource: { uri: URI };
  pasteShouldMove: boolean;
  cancellationTokenSource?: CancellationTokenSource;
  progressCb?: (args: ProgressCbArgs) => void;
}) {
  // Move/Copy Resource
  const operation = pasteShouldMove
    ? globalThis.modules.fileSystem.move(sourceResource.uri, targetResource.uri, false, {
        token: cancellationTokenSource?.token,
        progressCb,
      })
    : globalThis.modules.fileSystem.copy(sourceResource.uri, targetResource.uri, false, {
        token: cancellationTokenSource?.token,
        progressCb,
      });

  try {
    await operation;

    // Also copy tags to destination
    const tagsOfSourceResource = getTagsOfResource(
      globalThis.modules.store.getState().tagsSlice.resourcesToTags,
      {
        uri: sourceResource.uri,
        ctime: sourceResource.fileStat.ctime,
      },
    ).map((t) => t.id);
    await addTagsToResources([targetResource.uri], tagsOfSourceResource);

    // If move operation was performed, remove tags from source URI
    if (pasteShouldMove) {
      removeTagsFromResources([sourceResource.uri], tagsOfSourceResource);
    }
  } catch (err: unknown) {
    /*
     * If an error occurs during copy/move, perform cleanup.
     * We can just permanently delete the target file URI (and, if it's a folder, its contents),
     * since "findValidPasteFileTarget" makes sure that the paste target URI is new, without conflict.
     */
    try {
      await globalThis.modules.fileSystem.del(targetResource.uri, {
        recursive: sourceResource.fileStat.isDirectory,
      });
    } catch {
      // ignore
    }

    if (objects.hasMessageProp(err) && err.message.includes('due to cancellation')) {
      // paste got cancelled --> don't let error bubble up
      return;
    } else {
      throw err;
    }
  } finally {
    // invalidate files of the target directory
    const distinctParents = uriHelper.getDistinctParents([sourceResource.uri, targetResource.uri]);
    void Promise.all(
      distinctParents.map((directory) => refreshResourcesOfDirectory({ directory })),
    );
  }
}

export function triggerPreloadContentsOfResource(resource: ResourceStat) {
  requestIdleCallback(() => void doPreloadContentsOfResource(resource));
}

async function doPreloadContentsOfResource(resource: ResourceStat) {
  const formattedResource = formatter.resourcePath(resource.uri);

  logger.debug(`preloading contents of resource...`, {
    resourceContentsGetPreloadedFor: formattedResource,
  });

  if (resource.resourceType !== RESOURCE_TYPE.DIRECTORY) {
    logger.debug(`resource is no directory --> skipping.`, {
      resourceContentsGetPreloadedFor: formattedResource,
    });
    return;
  }

  const uri = resource.uri;

  let cachedQueryData = getCachedResourcesOfDirectory(uri);
  if (cachedQueryData) {
    logger.debug(`some data is already cached --> skip preloading of resources of directory.`, {
      directory: formatter.resourcePath(uri),
    });
    return;
  }

  logger.debug(`fetching resources of directory...`, { directory: formattedResource });

  const fetchArgs = {
    directory: uri,
    resolveMetadata: false,
  };
  const statsWithMetadata = await globalThis.modules.fileSystem.resolve(
    URI.from(fetchArgs.directory),
    {
      resolveMetadata: fetchArgs.resolveMetadata,
    },
  );

  cachedQueryData = getCachedResourcesOfDirectory(fetchArgs.directory);
  if (cachedQueryData) {
    logger.debug(
      `in the meantime, some data for this query got loaded ` +
        `--> fetched resources will not be stored so that existing data is not altered.`,
      { directory: formattedResource },
    );
    return;
  } else {
    logger.debug(`fetched resources, caching them...`, { directory: formattedResource });
    setCachedResourcesOfDirectory(fetchArgs, statsWithMetadata.children ?? []);
    logger.debug(`fetched resources got cached.`, { directory: formattedResource });
  }
}
