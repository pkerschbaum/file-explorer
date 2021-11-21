import { createAction, createReducer } from '@reduxjs/toolkit';

import { AvailableTheme, defaultTheme } from '@app/ui/ThemeProvider';

export type UserState = {
  preferences: {
    activeTheme: AvailableTheme;
  };
};

type SetActiveThemePayload = {
  theme: AvailableTheme;
};

export const actions = {
  setActiveTheme: createAction<SetActiveThemePayload>('ACTIVE_THEME_SET'),
};

const INITIAL_STATE: UserState = {
  preferences: {
    activeTheme: defaultTheme,
  },
};

export const reducer = createReducer(INITIAL_STATE, (builder) =>
  builder.addCase(actions.setActiveTheme, (state, action) => {
    state.preferences.activeTheme = action.payload.theme;
  }),
);
