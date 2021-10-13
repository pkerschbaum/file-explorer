import { combineReducers } from '@reduxjs/toolkit';

import { reducer as fileProviderReducer } from '@app/global-state/file-provider/file-provider.slice';

const rootReducer = combineReducers({ fileProvider: fileProviderReducer });

export default rootReducer;
