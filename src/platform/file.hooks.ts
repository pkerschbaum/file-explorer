import * as React from 'react';

import * as uuid from 'code-oss-file-service/out/vs/base/common/uuid';
import { URI, UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';
import type { ProgressCbArgs } from 'code-oss-file-service/out/vs/base/common/resources';
import { CancellationTokenSource } from 'code-oss-file-service/out/vs/base/common/cancellation';
import { IFileStatWithMetadata } from 'code-oss-file-service/out/vs/platform/files/common/files';

import { actions } from '@app/platform/store/file-provider/file-provider.slice';
import { useNexClipboard } from '@app/ui/NexClipboard.context';
import { useNexFileSystem } from '@app/ui/NexFileSystem.context';
import { useNexNativeHost } from '@app/ui/NexNativeHost.context';
import { useNexStorage } from '@app/ui/NexStorage.context';
import { useDispatch } from '@app/platform/store/store';
import {
  useFileProviderProcesses,
  useRefreshFiles,
} from '@app/platform/store/file-provider/file-provider.hooks';
import {
  DeleteProcess,
  DELETE_PROCESS_STATUS,
  FileStatMap,
  PROCESS_TYPE,
  Tag,
} from '@app/platform/file-types';
import { STORAGE_KEY } from '@app/platform/logic/storage';
import { getDistinctParents, NexFileSystem } from '@app/platform/logic/file-system';
import { createLogger } from '@app/base/logger/logger';
import { CustomError } from '@app/base/custom-error';
import * as tagHooks from '@app/platform/tag.hooks';
import { useRerenderOnEventFire } from '@app/ui/utils/react.util';
import { objects } from '@app/base/utils/objects.util';

const logger = createLogger('file.hooks');

export function useScheduleMoveFilesToTrash() {
  const dispatch = useDispatch();

  function scheduleMoveFilesToTrash(uris: UriComponents[]) {
    const deleteProcess: Omit<DeleteProcess, 'status'> = {
      type: PROCESS_TYPE.DELETE,
      id: uuid.generateUuid(),
      uris,
    };
    dispatch(actions.addDeleteProcess(deleteProcess));
  }

  return {
    scheduleMoveFilesToTrash,
  };
}

export function useRunDeleteProcess() {
  const dispatch = useDispatch();
  const processes = useFileProviderProcesses();

  const fileSystem = useNexFileSystem();

  const refreshFiles = useRefreshFiles();

  async function runDeleteProcess(deleteProcessId: string, options: { useTrash: boolean }) {
    const deleteProcess = processes.find((process) => process.id === deleteProcessId);
    if (!deleteProcess || deleteProcess.type !== PROCESS_TYPE.DELETE) {
      throw new Error(`could not find delete process, deleteProcessId=${deleteProcessId}`);
    }

    dispatch(
      actions.updateDeleteProcess({ id: deleteProcessId, status: DELETE_PROCESS_STATUS.RUNNING }),
    );

    // delete all files (in parallel)
    try {
      await Promise.all(
        deleteProcess.uris.map(async (uri) => {
          try {
            await fileSystem.del(URI.from(uri), { useTrash: options.useTrash, recursive: true });
          } catch (err) {
            logger.error(`could not delete files`, err);
            throw err;
          }
        }),
      );
    } catch (err: unknown) {
      dispatch(
        actions.updateDeleteProcess({
          id: deleteProcessId,
          status: DELETE_PROCESS_STATUS.FAILURE,
          error: err instanceof Error ? err.message : `Unknown error occured`,
        }),
      );
    }

    dispatch(
      actions.updateDeleteProcess({ id: deleteProcessId, status: DELETE_PROCESS_STATUS.SUCCESS }),
    );

    // invalidate files of all affected directories
    const distinctParents = getDistinctParents(deleteProcess.uris);
    await Promise.all(distinctParents.map((directory) => refreshFiles(directory)));
  }

  return {
    runDeleteProcess,
  };
}

export function useRemoveProcess() {
  const dispatch = useDispatch();

  function removeProcess(processId: string) {
    dispatch(actions.removeProcess({ id: processId }));
  }

  return {
    removeProcess,
  };
}

export function useOpenFile() {
  const nativeHost = useNexNativeHost();

  async function openFile(uri: UriComponents) {
    const executablePath = URI.from(uri).fsPath;
    await nativeHost.openPath(executablePath);
  }

  return {
    openFile,
  };
}

export function useCutOrCopyFiles() {
  const dispatch = useDispatch();

  const clipboard = useNexClipboard();

  function cutOrCopyFiles(files: UriComponents[], cut: boolean) {
    clipboard.writeResources(files.map((file) => URI.from(file)));
    dispatch(actions.cutOrCopyFiles({ cut }));
  }

  return {
    cutOrCopyFiles,
  };
}

export function useRenameFile() {
  const fileSystem = useNexFileSystem();

  const refreshFiles = useRefreshFiles();

  const { getTagsOfFile } = useGetTagsOfFile();
  const { addTags } = useAddTags();
  const { removeTags } = useRemoveTags();

  async function renameFile(sourceFileURI: UriComponents, newName: string) {
    const sourceFileStat = await fileSystem.resolve(URI.from(sourceFileURI), {
      resolveMetadata: true,
    });
    const targetFileURI = URI.joinPath(URI.from(sourceFileURI), '..', newName);
    await executeCopyOrMove({
      sourceFileURI: URI.from(sourceFileURI),
      sourceFileStat,
      targetFileURI,
      pasteShouldMove: true,
      fileTagActions: {
        getTagsOfFile,
        addTags,
        removeTags,
      },
      refreshFiles,
      fileSystem,
    });
    const distinctParents = getDistinctParents([sourceFileURI, targetFileURI]);
    await Promise.all(distinctParents.map((directory) => refreshFiles(directory)));
  }

  return {
    renameFile,
  };
}

export function useResolveDeep() {
  const fileSystem = useNexFileSystem();

  async function resolveDeep(targetToResolve: UriComponents, targetStat: IFileStatWithMetadata) {
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
          const childStat = await fileSystem.resolve(child.resource, { resolveMetadata: true });
          return resolveDeepRecursive(child.resource, childStat, resultMap);
        }),
      );
    }
  }

  return {
    resolveDeep,
  };
}

export function useGetTagsOfFile() {
  const storage = useNexStorage();

  const { getTags } = tagHooks.useGetTags();

  useRerenderOnEventFire(
    storage.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.RESOURCES_TO_TAGS, []),
  );

  const getTagsOfFile = React.useCallback(
    (file: { uri: UriComponents; ctime: number }): Tag[] => {
      const tagIdsOfFile = storage.get(STORAGE_KEY.RESOURCES_TO_TAGS)?.[
        URI.from(file.uri).toString()
      ];

      if (
        tagIdsOfFile === undefined ||
        tagIdsOfFile.tags.length === 0 ||
        tagIdsOfFile.ctimeOfFile !== file.ctime
      ) {
        return [];
      }

      const tags = getTags();
      const tagsOfFile = Object.entries(tags)
        .map(([id, otherValues]) => ({ ...otherValues, id }))
        .filter((tag) => tagIdsOfFile.tags.some((tagId) => tagId === tag.id));

      logger.debug(`got tags of file from storage`, { file, tagsOfFile });

      return tagsOfFile;
    },
    [storage, getTags],
  );

  return {
    getTagsOfFile,
  };
}

export function useAddTags() {
  const fileSystem = useNexFileSystem();
  const storage = useNexStorage();

  const { getTags } = tagHooks.useGetTags();

  useRerenderOnEventFire(
    storage.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.RESOURCES_TO_TAGS, []),
  );

  async function addTags(files: UriComponents[], tagIds: string[]) {
    logger.debug(`adding tags to files...`, { files, tagIds });

    const existingTagIds = Object.keys(getTags());
    const invalidTagIds = tagIds.filter(
      (tagId) => !existingTagIds.find((existing) => existing === tagId),
    );
    if (invalidTagIds.length > 0) {
      throw new CustomError(
        `at least one tag which should be added is not present in the storage`,
        { invalidTagIds },
      );
    }

    const fileToTagsMap = storage.get(STORAGE_KEY.RESOURCES_TO_TAGS) ?? {};

    await Promise.all(
      files.map(async (file) => {
        const fileStat = await fileSystem.resolve(URI.from(file), { resolveMetadata: true });

        let existingTagsOfFile = fileToTagsMap[URI.from(file).toString()];
        if (existingTagsOfFile === undefined || existingTagsOfFile.ctimeOfFile !== fileStat.ctime) {
          existingTagsOfFile = { ctimeOfFile: fileStat.ctime, tags: [] };
          fileToTagsMap[URI.from(file).toString()] = existingTagsOfFile;
        }
        existingTagsOfFile.tags.push(...tagIds);
      }),
    );

    storage.store(STORAGE_KEY.RESOURCES_TO_TAGS, fileToTagsMap);

    logger.debug(`tags to files added and stored in storage!`);
  }

  return {
    addTags,
  };
}

export function useRemoveTags() {
  const storage = useNexStorage();

  useRerenderOnEventFire(
    storage.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.RESOURCES_TO_TAGS, []),
  );

  function removeTags(files: UriComponents[], tagIds: string[]) {
    logger.debug(`removing tags from files...`, { files, tagIds });

    const fileToTagsMap = storage.get(STORAGE_KEY.RESOURCES_TO_TAGS);

    if (fileToTagsMap === undefined) {
      logger.debug(`tags from files removed (no tags were present at all)`);
      return;
    }

    for (const file of files) {
      const existingTagsOfFile = fileToTagsMap[URI.from(file).toString()];
      if (existingTagsOfFile !== undefined) {
        existingTagsOfFile.tags = existingTagsOfFile.tags.filter(
          (existingTagId) => !tagIds.some((tagIdToRemove) => tagIdToRemove === existingTagId),
        );
        fileToTagsMap[URI.from(file).toString()] = existingTagsOfFile;
      }
    }

    storage.store(STORAGE_KEY.RESOURCES_TO_TAGS, fileToTagsMap);

    logger.debug(`tags from files removed!`);
  }

  return {
    removeTags,
  };
}

export async function executeCopyOrMove({
  sourceFileURI,
  sourceFileStat,
  targetFileURI,
  pasteShouldMove,
  cancellationTokenSource,
  progressCb,
  fileTagActions,
  refreshFiles,
  fileSystem,
}: {
  sourceFileURI: URI;
  targetFileURI: URI;
  sourceFileStat: IFileStatWithMetadata;
  pasteShouldMove: boolean;
  cancellationTokenSource?: CancellationTokenSource;
  progressCb?: (args: ProgressCbArgs) => void;
  fileTagActions: {
    getTagsOfFile: ReturnType<typeof useGetTagsOfFile>['getTagsOfFile'];
    addTags: ReturnType<typeof useAddTags>['addTags'];
    removeTags: ReturnType<typeof useRemoveTags>['removeTags'];
  };
  refreshFiles: (directory: UriComponents) => Promise<void>;
  fileSystem: NexFileSystem;
}) {
  // Move/Copy File
  const operation = pasteShouldMove
    ? fileSystem.move(sourceFileURI, targetFileURI, false, {
        token: cancellationTokenSource?.token,
        progressCb,
      })
    : fileSystem.copy(sourceFileURI, targetFileURI, false, {
        token: cancellationTokenSource?.token,
        progressCb,
      });

  try {
    await operation;

    // Also copy tags to destination
    const tagsOfSourceFile = fileTagActions
      .getTagsOfFile({
        uri: sourceFileURI,
        ctime: sourceFileStat.ctime,
      })
      .map((t) => t.id);
    await fileTagActions.addTags([targetFileURI], tagsOfSourceFile);

    // If move operation was performed, remove tags from source URI
    if (pasteShouldMove) {
      fileTagActions.removeTags([sourceFileURI], tagsOfSourceFile);
    }
  } catch (err: unknown) {
    /*
     * If an error occurs during copy/move, perform cleanup.
     * We can just permanently delete the target file URI (and, if it's a folder, its contents),
     * since "findValidPasteFileTarget" makes sure that the paste target URI is new, without conflict.
     */
    try {
      await fileSystem.del(targetFileURI, { useTrash: false, recursive: true });
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
