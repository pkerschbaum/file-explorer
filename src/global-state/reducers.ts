import { combineReducers } from '@reduxjs/toolkit';

import { reducer as explorersReducer } from '@app/global-state/slices/explorers.slice';
import { reducer as processesReducer } from '@app/global-state/slices/processes.slice';

const rootReducer = combineReducers({
  explorersSlice: explorersReducer,
  processesSlice: processesReducer,
});

export default rootReducer;
