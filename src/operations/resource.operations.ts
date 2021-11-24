import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import type { ProgressCbArgs } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as uuid from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uuid';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { CustomError } from '@app/base/custom-error';
import { objects } from '@app/base/utils/objects.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import {
  DeleteProcess,
  DELETE_PROCESS_STATUS,
  ResourceStatMap,
  ResourcesToTags,
  PROCESS_TYPE,
  Tag,
} from '@app/domain/types';
import { refreshResourcesOfDirectory } from '@app/global-cache/resources';
import { mapProcess } from '@app/global-state/slices/processes.hooks';
import { actions } from '@app/global-state/slices/processes.slice';
import { actions as tagsSliceActions } from '@app/global-state/slices/tags.slice';
import { createLogger } from '@app/operations/create-logger';
import {
  dispatchRef,
  fileSystemRef,
  nativeHostRef,
  storeRef,
} from '@app/operations/global-modules';
import * as tagOperations from '@app/operations/tag.operations';
import { getDistinctParents } from '@app/platform/file-system';

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
  dispatchRef.current(actions.addDeleteProcess(deleteProcess));
}

export async function runDeleteProcess(deleteProcessId: string, options: { useTrash: boolean }) {
  const processes = storeRef.current.getState().processesSlice.processes.map(mapProcess);
  const deleteProcess = processes.find((process) => process.id === deleteProcessId);
  if (!deleteProcess || deleteProcess.type !== PROCESS_TYPE.DELETE) {
    throw new Error(`could not find delete process, deleteProcessId=${deleteProcessId}`);
  }

  dispatchRef.current(
    actions.updateDeleteProcess({ id: deleteProcessId, status: DELETE_PROCESS_STATUS.RUNNING }),
  );

  // delete all files (in parallel)
  try {
    await Promise.all(
      deleteProcess.uris.map(async (uri) => {
        try {
          await fileSystemRef.current.del(URI.from(uri), {
            useTrash: options.useTrash,
            recursive: true,
          });
        } catch (err) {
          logger.error(`could not delete files`, err);
          throw err;
        }
      }),
    );
  } catch (err: unknown) {
    dispatchRef.current(
      actions.updateDeleteProcess({
        id: deleteProcessId,
        status: DELETE_PROCESS_STATUS.FAILURE,
        error: err instanceof Error ? err.message : `Unknown error occured`,
      }),
    );
  }

  dispatchRef.current(
    actions.updateDeleteProcess({ id: deleteProcessId, status: DELETE_PROCESS_STATUS.SUCCESS }),
  );

  // invalidate resources of all affected directories
  const distinctParents = getDistinctParents(deleteProcess.uris);
  await Promise.all(distinctParents.map((directory) => refreshResourcesOfDirectory({ directory })));
}

export function removeProcess(processId: string) {
  dispatchRef.current(actions.removeProcess({ id: processId }));
}

export async function openFiles(uris: UriComponents[]) {
  await nativeHostRef.current.shell.openPath(uris);
}

export function cutOrCopyResources(resources: UriComponents[], cut: boolean) {
  if (resources.length < 1) {
    return;
  }

  nativeHostRef.current.clipboard.writeResources(resources.map((resource) => URI.from(resource)));
  dispatchRef.current(actions.cutOrCopyResources({ cut }));
}

export async function renameResource(resourceURI: UriComponents, uriToRenameTo: UriComponents) {
  const fileStatOfSourceResource = await fileSystemRef.current.resolve(URI.from(resourceURI), {
    resolveMetadata: true,
  });
  await executeCopyOrMove({
    sourceResource: { uri: URI.from(resourceURI), fileStat: fileStatOfSourceResource },
    targetResource: { uri: URI.from(uriToRenameTo) },
    pasteShouldMove: true,
  });

  const distinctParents = getDistinctParents([resourceURI, uriToRenameTo]);
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
        const childStat = await fileSystemRef.current.resolve(child.resource, {
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
    storeRef.current.getState().tagsSlice.resourcesToTags,
  );

  await Promise.all(
    resources.map(async (resource) => {
      const statOfResource = await fileSystemRef.current.resolve(URI.from(resource), {
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

  dispatchRef.current(
    tagsSliceActions.storeResourcesToTags({ resourcesToTags: resourcesToTagsMap }),
  );

  logger.debug(`tags to resources added and stored in storage!`);
}

export function removeTagsFromResources(resources: UriComponents[], tagIds: string[]) {
  logger.debug(`removing tags from resources...`, { resources, tagIds });

  const resourcesToTagsMap = objects.deepCopyJson(
    storeRef.current.getState().tagsSlice.resourcesToTags,
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

  dispatchRef.current(
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
    ? fileSystemRef.current.move(sourceResource.uri, targetResource.uri, false, {
        token: cancellationTokenSource?.token,
        progressCb,
      })
    : fileSystemRef.current.copy(sourceResource.uri, targetResource.uri, false, {
        token: cancellationTokenSource?.token,
        progressCb,
      });

  try {
    await operation;

    // Also copy tags to destination
    const tagsOfSourceResource = getTagsOfResource(
      storeRef.current.getState().tagsSlice.resourcesToTags,
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
      await fileSystemRef.current.del(targetResource.uri, { useTrash: false, recursive: true });
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
    const distinctParents = getDistinctParents([sourceResource.uri, targetResource.uri]);
    void Promise.all(
      distinctParents.map((directory) => refreshResourcesOfDirectory({ directory })),
    );
  }
}
