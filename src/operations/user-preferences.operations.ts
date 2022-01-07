import { AvailableFileIconTheme } from '@app/domain/constants';
import { actions } from '@app/global-state/slices/user.slice';
import { dispatchRef } from '@app/operations/global-modules';
import { AvailableTheme } from '@app/ui/components-library';

export function setActiveTheme(newActiveTheme: AvailableTheme) {
  dispatchRef.current(actions.setActiveTheme({ theme: newActiveTheme }));
}

export function setActiveFileIconTheme(newActiveFileIconTheme: AvailableFileIconTheme) {
  dispatchRef.current(actions.setActiveFileIconTheme({ fileIconTheme: newActiveFileIconTheme }));
}
