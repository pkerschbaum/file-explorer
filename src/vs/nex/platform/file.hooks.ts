import * as React from 'react';
import { shell } from 'electron';

import * as uuid from 'vs/base/common/uuid';
import { URI, UriComponents } from 'vs/base/common/uri';
import { IFileStatWithMetadata } from 'vs/platform/files/common/files';

import { actions } from 'vs/nex/platform/store/file-provider/file-provider.slice';
import { useNexFileSystem } from 'vs/nex/NexFileSystem.provider';
import { useNexClipboard } from 'vs/nex/NexClipboard.provider';
import { useNexStorage } from 'vs/nex/NexStorage.provider';
import { useDispatch } from 'vs/nex/platform/store/store';
import {
	useFileProviderProcesses,
	useInvalidateFiles,
} from 'vs/nex/platform/store/file-provider/file-provider.hooks';
import { DeleteProcess, FileStatMap, PROCESS_STATUS, Tag } from 'vs/nex/platform/file-types';
import { STORAGE_KEY } from 'vs/nex/platform/logic/storage';
import { getDistinctParents } from 'vs/nex/platform/logic/file-system';
import { createLogger } from 'vs/nex/base/logger/logger';
import { CustomError } from 'vs/nex/base/custom-error';
import { useTagsActions } from 'vs/nex/platform/tag.hooks';
import { useRerenderOnEventFire } from 'vs/nex/platform/store/util/hooks.util';

const logger = createLogger('file.hooks');

export function useFileActions() {
	const dispatch = useDispatch();
	const processes = useFileProviderProcesses();

	const fileSystem = useNexFileSystem();
	const clipboard = useNexClipboard();
	const storage = useNexStorage();

	const invalidateFiles = useInvalidateFiles();
	const tagsActions = useTagsActions();

	useRerenderOnEventFire(
		storage.onDataChanged,
		React.useCallback((storageKey) => storageKey === STORAGE_KEY.RESOURCES_TO_TAGS, []),
	);

	async function openFile(uri: UriComponents) {
		const executablePath = URI.from(uri).fsPath;

		const success = await shell.openPath(executablePath);
		if (!success) {
			logger.error(`electron shell openItem did not succeed`, undefined, { uri });
		}
	}

	function scheduleMoveFilesToTrash(uris: UriComponents[]) {
		const deleteProcess: Omit<DeleteProcess, 'status'> = {
			type: 'delete',
			id: uuid.generateUuid(),
			uris,
		};
		dispatch(actions.addDeleteProcess(deleteProcess));
	}

	async function runDeleteProcess(deleteProcessId: string) {
		const deleteProcess = processes.find((process) => process.id === deleteProcessId);
		if (!deleteProcess || deleteProcess.type !== 'delete') {
			throw new Error(`coult not find delete process, deleteProcessId=${deleteProcessId}`);
		}

		dispatch(actions.updateDeleteProcess({ id: deleteProcessId, status: PROCESS_STATUS.RUNNING }));

		// move all files to trash (in parallel)
		await Promise.all(
			deleteProcess.uris.map(async (uri) => {
				try {
					await fileSystem.del(URI.from(uri), { useTrash: true, recursive: true });
				} catch (err) {
					logger.error(`could not move file to trash`, err);
					throw err;
				}
			}),
		);

		dispatch(actions.updateDeleteProcess({ id: deleteProcessId, status: PROCESS_STATUS.SUCCESS }));

		// invalidate files of all affected directories
		const distinctParents = getDistinctParents(deleteProcess.uris);
		await Promise.all(distinctParents.map((directory) => invalidateFiles(directory)));
	}

	async function cutOrCopyFiles(files: UriComponents[], cut: boolean) {
		await clipboard.writeResources(files.map((file) => URI.from(file)));
		dispatch(actions.cutOrCopyFiles({ cut }));
	}

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

	function getTagsOfFile(file: { uri: UriComponents; ctime: number }): Tag[] {
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

		const tags = tagsActions.getTags();
		const tagsOfFile = Object.entries(tags)
			.map(([id, otherValues]) => ({ ...otherValues, id }))
			.filter((tag) => tagIdsOfFile.tags.some((tagId) => tagId === tag.id));

		logger.debug(`got tags of file from storage`, { file, tagsOfFile });

		return tagsOfFile;
	}

	async function addTags(files: UriComponents[], tagIds: string[]) {
		logger.debug(`adding tags to files...`, { files, tagIds });

		const existingTagIds = Object.keys(tagsActions.getTags());
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
					fileToTagsMap[URI.from(file).toString()] = { ctimeOfFile: fileStat.ctime, tags: [] };
				}
				fileToTagsMap[URI.from(file).toString()]!.tags.push(...tagIds);
			}),
		);

		storage.store(STORAGE_KEY.RESOURCES_TO_TAGS, fileToTagsMap);

		logger.debug(`tags to files added and stored in storage!`);
	}

	function removeTags(files: UriComponents[], tagIds: string[]) {
		logger.debug(`removing tags from files...`, { files, tagIds });

		const fileToTagsMap = storage.get(STORAGE_KEY.RESOURCES_TO_TAGS);

		if (fileToTagsMap === undefined) {
			logger.debug(`tags from files removed (no tags were present at all)`);
			return;
		}

		for (const file of files) {
			const existingTagsOfFile = fileToTagsMap[URI.from(file).toString()]?.tags;
			if (existingTagsOfFile !== undefined) {
				fileToTagsMap[URI.from(file).toString()]!.tags = existingTagsOfFile.filter(
					(existingTagId) => !tagIds.some((tagIdToRemove) => tagIdToRemove === existingTagId),
				);
			}
		}

		storage.store(STORAGE_KEY.RESOURCES_TO_TAGS, fileToTagsMap);

		logger.debug(`tags from files removed!`);
	}

	return {
		scheduleMoveFilesToTrash,
		runDeleteProcess,
		openFile,
		cutOrCopyFiles,
		resolveDeep,
		addTags,
		getTagsOfFile,
		removeTags,
	};
}
