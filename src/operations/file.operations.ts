import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import type { ProgressCbArgs } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as uuid from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uuid';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { CustomError } from '@app/base/custom-error';
import { createLogger } from '@app/base/logger/logger';
import { objects } from '@app/base/utils/objects.util';
import {
  DeleteProcess,
  DELETE_PROCESS_STATUS,
  FileStatMap,
  FileToTags,
  PROCESS_TYPE,
  Tag,
} from '@app/domain/types';
import { refreshFiles } from '@app/global-cache/files';
import {
  actions as persistedSliceActions,
  STORAGE_KEY,
} from '@app/global-state/slices/persisted.slice';
import { mapProcess } from '@app/global-state/slices/processes.hooks';
import { actions } from '@app/global-state/slices/processes.slice';
import {
  dispatchRef,
  fileSystemRef,
  nativeHostRef,
  storeRef,
} from '@app/operations/global-modules';
import * as tagOperations from '@app/operations/tag.operations';
import { getDistinctParents } from '@app/platform/file-system';

const logger = createLogger('file.hooks');

export function scheduleMoveFilesToTrash(uris: UriComponents[]) {
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

  // invalidate files of all affected directories
  const distinctParents = getDistinctParents(deleteProcess.uris);
  await Promise.all(distinctParents.map((directory) => refreshFiles(directory)));
}

export function removeProcess(processId: string) {
  dispatchRef.current(actions.removeProcess({ id: processId }));
}

export async function openFiles(uris: UriComponents[]) {
  await nativeHostRef.current.openPath(uris);
}

export function cutOrCopyFiles(files: UriComponents[], cut: boolean) {
  if (files.length < 1) {
    return;
  }

  nativeHostRef.current.clipboard.writeResources(files.map((file) => URI.from(file)));
  dispatchRef.current(actions.cutOrCopyFiles({ cut }));
}

export async function renameFile(sourceFileURI: UriComponents, newName: string) {
  const sourceFileStat = await fileSystemRef.current.resolve(URI.from(sourceFileURI), {
    resolveMetadata: true,
  });
  const targetFileURI = URI.joinPath(URI.from(sourceFileURI), '..', newName);
  await executeCopyOrMove({
    sourceFileURI: URI.from(sourceFileURI),
    sourceFileStat,
    targetFileURI,
    pasteShouldMove: true,
    refreshFiles,
  });
  const distinctParents = getDistinctParents([sourceFileURI, targetFileURI]);
  await Promise.all(distinctParents.map((directory) => refreshFiles(directory)));
}

export async function resolveDeep(
  targetToResolve: UriComponents,
  targetStat: IFileStatWithMetadata,
) {
  const fileStatMap: FileStatMap = {};
  await resolveDeepRecursive(targetToResolve, targetStat, fileStatMap);
  return fileStatMap;
}

async function resolveDeepRecursive(
  targetToResolve: UriComponents,
  targetStat: IFileStatWithMetadata,
  resultMap: FileStatMap,
) {
  if (!targetStat.isDirectory) {
    resultMap[URI.from(targetToResolve).toString()] = targetStat;
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

export function getTagsOfFile(
  resourcesToTags: FileToTags,
  file: { uri: UriComponents; ctime: number },
): Tag[] {
  const tagIdsOfFile = resourcesToTags[URI.from(file.uri).toString()];

  if (
    tagIdsOfFile === undefined ||
    tagIdsOfFile.tags.length === 0 ||
    tagIdsOfFile.ctimeOfFile !== file.ctime
  ) {
    return [];
  }

  const tags = tagOperations.getTags();
  const tagsOfFile = Object.entries(tags)
    .map(([id, otherValues]) => ({ ...otherValues, id }))
    .filter((tag) => tagIdsOfFile.tags.some((tagId) => tagId === tag.id));

  logger.debug(`got tags of file from storage`, { file, tagsOfFile });

  return tagsOfFile;
}

export async function addTags(files: UriComponents[], tagIds: string[]) {
  logger.debug(`adding tags to files...`, { files, tagIds });

  const existingTagIds = Object.keys(tagOperations.getTags());
  const invalidTagIds = tagIds.filter(
    (tagId) => !existingTagIds.find((existing) => existing === tagId),
  );
  if (invalidTagIds.length > 0) {
    throw new CustomError(`at least one tag which should be added is not present in the storage`, {
      invalidTagIds,
    });
  }

  const fileToTagsMap = objects.deepCopyJson(
    storeRef.current.getState().persistedSlice.resourcesToTags,
  );

  await Promise.all(
    files.map(async (file) => {
      const fileStat = await fileSystemRef.current.resolve(URI.from(file), {
        resolveMetadata: true,
      });

      let existingTagsOfFile = fileToTagsMap[URI.from(file).toString()];
      if (existingTagsOfFile === undefined || existingTagsOfFile.ctimeOfFile !== fileStat.ctime) {
        existingTagsOfFile = { ctimeOfFile: fileStat.ctime, tags: [] };
        fileToTagsMap[URI.from(file).toString()] = existingTagsOfFile;
      }
      existingTagsOfFile.tags.push(...tagIds);
    }),
  );

  dispatchRef.current(
    persistedSliceActions.storeValue({ key: STORAGE_KEY.RESOURCES_TO_TAGS, value: fileToTagsMap }),
  );

  logger.debug(`tags to files added and stored in storage!`);
}

export function removeTags(files: UriComponents[], tagIds: string[]) {
  logger.debug(`removing tags from files...`, { files, tagIds });

  const fileToTagsMap = objects.deepCopyJson(
    storeRef.current.getState().persistedSlice.resourcesToTags,
  );

  for (const file of files) {
    const existingTagsOfFile = fileToTagsMap[URI.from(file).toString()];
    if (existingTagsOfFile !== undefined) {
      existingTagsOfFile.tags = existingTagsOfFile.tags.filter(
        (existingTagId) => !tagIds.some((tagIdToRemove) => tagIdToRemove === existingTagId),
      );
      fileToTagsMap[URI.from(file).toString()] = existingTagsOfFile;
    }
  }

  dispatchRef.current(
    persistedSliceActions.storeValue({ key: STORAGE_KEY.RESOURCES_TO_TAGS, value: fileToTagsMap }),
  );

  logger.debug(`tags from files removed!`);
}

export async function executeCopyOrMove({
  sourceFileURI,
  sourceFileStat,
  targetFileURI,
  pasteShouldMove,
  cancellationTokenSource,
  progressCb,
  refreshFiles,
}: {
  sourceFileURI: URI;
  targetFileURI: URI;
  sourceFileStat: IFileStatWithMetadata;
  pasteShouldMove: boolean;
  cancellationTokenSource?: CancellationTokenSource;
  progressCb?: (args: ProgressCbArgs) => void;
  refreshFiles: (directory: UriComponents) => Promise<void>;
}) {
  // Move/Copy File
  const operation = pasteShouldMove
    ? fileSystemRef.current.move(sourceFileURI, targetFileURI, false, {
        token: cancellationTokenSource?.token,
        progressCb,
      })
    : fileSystemRef.current.copy(sourceFileURI, targetFileURI, false, {
        token: cancellationTokenSource?.token,
        progressCb,
      });

  try {
    await operation;

    // Also copy tags to destination
    const tagsOfSourceFile = getTagsOfFile(
      storeRef.current.getState().persistedSlice.resourcesToTags,
      {
        uri: sourceFileURI,
        ctime: sourceFileStat.ctime,
      },
    ).map((t) => t.id);
    await addTags([targetFileURI], tagsOfSourceFile);

    // If move operation was performed, remove tags from source URI
    if (pasteShouldMove) {
      removeTags([sourceFileURI], tagsOfSourceFile);
    }
  } catch (err: unknown) {
    /*
     * If an error occurs during copy/move, perform cleanup.
     * We can just permanently delete the target file URI (and, if it's a folder, its contents),
     * since "findValidPasteFileTarget" makes sure that the paste target URI is new, without conflict.
     */
    try {
      await fileSystemRef.current.del(targetFileURI, { useTrash: false, recursive: true });
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
    const distinctParents = getDistinctParents([sourceFileURI, targetFileURI]);
    void Promise.all(distinctParents.map((directory) => refreshFiles(directory)));
  }
}
