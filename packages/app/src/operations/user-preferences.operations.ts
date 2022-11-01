import { AvailableFileIconTheme } from '@app/domain/constants';
import { actions } from '@app/global-state/slices/user.slice';
import { AvailableTheme } from '@app/ui/components-library';

export function setActiveTheme(newActiveTheme: AvailableTheme) {
  globalThis.modules.dispatch(actions.setActiveTheme({ theme: newActiveTheme }));
}

export function setActiveFileIconTheme(newActiveFileIconTheme: AvailableFileIconTheme) {
  globalThis.modules.dispatch(
    actions.setActiveFileIconTheme({ fileIconTheme: newActiveFileIconTheme }),
  );
}
