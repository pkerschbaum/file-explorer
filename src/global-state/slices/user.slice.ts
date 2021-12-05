import { createAction, createReducer } from '@reduxjs/toolkit';

import { AvailableFileIconTheme } from '@app/constants';
import { AvailableTheme, defaultTheme } from '@app/ui/components-library';

export type UserState = {
  preferences: {
    activeTheme: AvailableTheme;
    activeFileIconTheme: AvailableFileIconTheme;
  };
};

type SetActiveThemePayload = {
  theme: AvailableTheme;
};

type SetActiveFileIconThemePayload = {
  fileIconTheme: AvailableFileIconTheme;
};

export const actions = {
  setActiveTheme: createAction<SetActiveThemePayload>('ACTIVE_THEME_SET'),
  setActiveFileIconTheme: createAction<SetActiveFileIconThemePayload>('ACTIVE_FILE_ICON_THEME_SET'),
};

const INITIAL_STATE: UserState = {
  preferences: {
    activeTheme: defaultTheme,
    activeFileIconTheme: 'vsCode',
  },
};

export const reducer = createReducer(INITIAL_STATE, (builder) =>
  builder
    .addCase(actions.setActiveTheme, (state, action) => {
      state.preferences.activeTheme = action.payload.theme;
    })
    .addCase(actions.setActiveFileIconTheme, (state, action) => {
      state.preferences.activeFileIconTheme = action.payload.fileIconTheme;
    }),
);
