import { check } from '@pkerschbaum/commons-ecma/util/assert';
import { numbers } from '@pkerschbaum/commons-ecma/util/numbers';
import type { CombinedState, PreloadedState } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';

import { typedPath } from '@file-explorer/commons-ecma/util/types.util';

import { loggerMiddleware } from '#pkg/global-state/logger.middleware';
import { persistMiddleware } from '#pkg/global-state/persist-state.middleware';
import { rootReducer } from '#pkg/global-state/reducers';
import type { CwdSegment, ExplorersMap } from '#pkg/global-state/slices/explorers.slice';
import {
  computeCwdSegmentsFromUri,
  generateExplorerId,
} from '#pkg/global-state/slices/explorers.slice';
import type { TagsState } from '#pkg/global-state/slices/tags.slice';
import type { UserState } from '#pkg/global-state/slices/user.slice';
import { getDefaultExplorerCwd } from '#pkg/operations/app.operations';
import { createLogger } from '#pkg/operations/create-logger';

export type RootState = ReturnType<typeof rootReducer>;

const logger = createLogger('store.ts');

/*
 * @reduxjs/toolkit does not allow to specifiy ignoredPaths for the serializable- and immutablechecks.
 * This is troublesome if an array with unknown size is part of the ignored path. So just create a
 * huge bunch of ignored paths.
 * Those middlewares are only enabled in development anyway... (https://redux-toolkit.js.org/api/getDefaultMiddleware)
 */
const ignoredPaths = numbers
  .sequence({ fromInclusive: 0, toInclusive: 999 })
  .map((num) =>
    typedPath<RootState>()('processesSlice', 'processes', num, 'cancellationTokenSource'),
  );

export type PreloadedRootState = PreloadedState<CombinedState<NoInfer<RootState>>>;
export async function createStoreInstance(creationParams?: {
  preloadedState?: PreloadedRootState;
}) {
  const explorerPanels: ExplorersMap =
    (creationParams?.preloadedState?.explorersSlice?.explorerPanels as ExplorersMap | undefined) ??
    {};
  let focusedExplorerPanelId =
    creationParams?.preloadedState?.explorersSlice?.focusedExplorerPanelId;

  if (Object.keys(explorerPanels).length === 0) {
    logger.debug(`no explorer present --> add default explorer panel`);
    const cwdOfNewExplorer = await getDefaultExplorerCwd();
    const explorerId = generateExplorerId();
    explorerPanels[explorerId] = {
      cwdSegments: computeCwdSegmentsFromUri(cwdOfNewExplorer),
      version: 1,
    };
  }

  if (
    check.isNullishOrEmptyString(focusedExplorerPanelId) ||
    explorerPanels[focusedExplorerPanelId] === undefined
  ) {
    logger.debug(
      `no focusedExplorerPanelId is present or it refers to an invalid explorer id --> just focus first explorer`,
    );
    focusedExplorerPanelId = Object.keys(explorerPanels)[0];
  }

  const finalPreloadedState: PreloadedRootState = {
    ...creationParams?.preloadedState,
    explorersSlice: {
      ...creationParams?.preloadedState?.explorersSlice,
      explorerPanels,
      focusedExplorerPanelId,
    },
  };

  return configureStore({
    preloadedState: finalPreloadedState,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      loggerMiddleware,
      persistMiddleware,
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActionPaths: ['payload.cancellationTokenSource'],
          ignoredPaths,
        },
        immutableCheck: {
          ignoredPaths,
        },
      }),
    ],
  });
}

export type RootStore = Awaited<ReturnType<typeof createStoreInstance>>;
export type AppDispatch = RootStore['dispatch'];

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch: () => AppDispatch = useReduxDispatch;

export type StorageState = {
  activeExplorerPanels?: Array<{ id: string; cwdSegments: CwdSegment[] }>;
  focusedExplorerPanelId?: string;
  tagsState?: TagsState;
  userState?: UserState;
};
