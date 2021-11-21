import { actions } from '@app/global-state/slices/user.slice';
import { dispatchRef } from '@app/operations/global-modules';
import { AvailableTheme } from '@app/ui/ThemeProvider';

export function setActiveTheme(newActiveTheme: AvailableTheme) {
  dispatchRef.current(actions.setActiveTheme({ theme: newActiveTheme }));
}
