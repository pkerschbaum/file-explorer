import { configureStore } from '@reduxjs/toolkit';
import { createSelectorHook, useDispatch as useReduxDispatch } from 'react-redux';

import { numbers } from '@app/base/utils/numbers.util';
import loggerMiddleware from '@app/platform/store/logger.middleware';
import rootReducer from '@app/platform/store/reducers';

/*
 * @reduxjs/toolkit does not allow to specifiy ignoredPaths for the serializable- and immutablechecks.
 * This is troublesome if an array with unknown size is part of the ignored path. So just create a
 * huge bunch of ignored paths.
 * Those middlewares are only enabled in development anyway... (https://redux-toolkit.js.org/api/getDefaultMiddleware)
 */
const ignoredPaths = numbers
  .sequence({ fromInclusive: 0, toInclusive: 999 })
  .map((num) => `fileProvider.processes.${num}.cancellationTokenSource`);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    loggerMiddleware,
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

export type RootState = ReturnType<typeof rootReducer>;
export type RootStore = typeof store;
export type AppDispatch = RootStore['dispatch'];

export const useSelector = createSelectorHook<RootState>();
export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const dispatch = store.dispatch;
