import { combineReducers } from '@reduxjs/toolkit';

import { reducer as explorersReducer } from '@app/global-state/slices/explorers.slice';
import { reducer as processesReducer } from '@app/global-state/slices/processes.slice';
import { reducer as tagsReducer } from '@app/global-state/slices/tags.slice';
import { reducer as userReducer } from '@app/global-state/slices/user.slice';

export const rootReducer = combineReducers({
  explorersSlice: explorersReducer,
  processesSlice: processesReducer,
  tagsSlice: tagsReducer,
  userSlice: userReducer,
});
