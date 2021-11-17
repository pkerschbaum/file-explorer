import { CombinedState, configureStore, PreloadedState } from '@reduxjs/toolkit';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';
import { createSelectorHook, useDispatch as useReduxDispatch } from 'react-redux';

import { numbers } from '@app/base/utils/numbers.util';
import { typedPath } from '@app/base/utils/types.util';
import loggerMiddleware from '@app/global-state/logger.middleware';
import { persistMiddleware } from '@app/global-state/persist-state.middleware';
import rootReducer from '@app/global-state/reducers';

export type RootState = ReturnType<typeof rootReducer>;

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
export function createStoreInstance(creationParams?: { preloadedState: PreloadedRootState }) {
  return configureStore({
    preloadedState: creationParams?.preloadedState,
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

export type RootStore = ReturnType<typeof createStoreInstance>;
export type AppDispatch = RootStore['dispatch'];

export const useSelector = createSelectorHook<RootState>();
export const useDispatch = () => useReduxDispatch<AppDispatch>();
