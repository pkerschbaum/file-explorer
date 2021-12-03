import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { TagsState } from '@app/global-state/slices/tags.slice';
import { UserState } from '@app/global-state/slices/user.slice';

export type PlatformPersistentStorage = {
  write: (entireValue: Record<string, unknown>) => Promise<void>;
  read: () => Promise<Record<string, unknown>>;
};

export type StorageState = {
  activeExplorerPanels?: Array<{ id: string; cwd: UriComponents }>;
  focusedExplorerPanelId?: string;
  tagsState?: TagsState;
  userState?: UserState;
};
