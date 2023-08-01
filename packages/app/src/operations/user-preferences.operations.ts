import type { AvailableFileIconTheme } from '#pkg/domain/constants';
import { actions } from '#pkg/global-state/slices/user.slice';
import type { AvailableTheme } from '#pkg/ui/components-library';

export function setActiveTheme(newActiveTheme: AvailableTheme) {
  globalThis.modules.dispatch(actions.setActiveTheme({ theme: newActiveTheme }));
}

export function setActiveFileIconTheme(newActiveFileIconTheme: AvailableFileIconTheme) {
  globalThis.modules.dispatch(
    actions.setActiveFileIconTheme({ fileIconTheme: newActiveFileIconTheme }),
  );
}
