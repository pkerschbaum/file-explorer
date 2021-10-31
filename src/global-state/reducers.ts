import { combineReducers } from '@reduxjs/toolkit';

import { reducer as explorersReducer } from '@app/global-state/slices/explorers.slice';
import { reducer as processesReducer } from '@app/global-state/slices/processes.slice';
import { reducer as tagsReducer } from '@app/global-state/slices/tags.slice';

const rootReducer = combineReducers({
  explorersSlice: explorersReducer,
  processesSlice: processesReducer,
  tagsSlice: tagsReducer,
});

export default rootReducer;
