import { CombinedState, configureStore, PreloadedState } from '@reduxjs/toolkit';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';
import { createSelectorHook, useDispatch as useReduxDispatch } from 'react-redux';

import { createLogger } from '@app/base/logger/logger';
import { check } from '@app/base/utils/assert.util';
import { numbers } from '@app/base/utils/numbers.util';
import { typedPath } from '@app/base/utils/types.util';
import loggerMiddleware from '@app/global-state/logger.middleware';
import { persistMiddleware } from '@app/global-state/persist-state.middleware';
import rootReducer from '@app/global-state/reducers';
import { ExplorersMap, generateExplorerId } from '@app/global-state/slices/explorers.slice';
import { getDefaultExplorerCwd } from '@app/operations/app.operations';

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

  if (Object.keys(explorerPanels).length < 1) {
    logger.debug(`no explorer present --> add default explorer panel`);
    const cwdOfNewExplorer = await getDefaultExplorerCwd();
    const explorerId = generateExplorerId();
    explorerPanels[explorerId] = { cwd: cwdOfNewExplorer };
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

export const useSelector = createSelectorHook<RootState>();
export const useDispatch = () => useReduxDispatch<AppDispatch>();
