import { combineReducers } from '@reduxjs/toolkit';

import { reducer as fileProviderReducer } from '@app/platform/store/file-provider/file-provider.slice';

const rootReducer = combineReducers({ fileProvider: fileProviderReducer });

export default rootReducer;
