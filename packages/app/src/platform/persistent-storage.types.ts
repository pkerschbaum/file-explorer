import type { CwdSegment } from '@app/global-state/slices/explorers.slice';
import type { TagsState } from '@app/global-state/slices/tags.slice';
import type { UserState } from '@app/global-state/slices/user.slice';

export type PlatformPersistentStorage = {
  write: (entireValue: StorageState) => Promise<void>;
  read: () => Promise<StorageState>;
};

export type StorageState = {
  activeExplorerPanels?: Array<{ id: string; cwdSegments: CwdSegment[] }>;
  focusedExplorerPanelId?: string;
  tagsState?: TagsState;
  userState?: UserState;
};
