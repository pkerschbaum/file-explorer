import { useSelector } from '@app/global-state/store';

export function useActiveTheme() {
  return useSelector((state) => state.userSlice.preferences.activeTheme);
}

export function useActiveFileIconTheme() {
  return useSelector((state) => state.userSlice.preferences.activeFileIconTheme);
}
