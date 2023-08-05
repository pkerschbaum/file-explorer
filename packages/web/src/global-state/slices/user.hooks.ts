import { useSelector } from '#pkg/global-state/store';

export function useActiveTheme() {
  return useSelector((state) => state.userSlice.preferences.activeTheme);
}

export function useActiveFileIconTheme() {
  return useSelector((state) => state.userSlice.preferences.activeFileIconTheme);
}
