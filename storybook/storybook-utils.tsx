import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { storyNameFromExport, toId } from '@storybook/csf';
import * as React from 'react';

import { ObjectLiteral } from '@app/base/utils/types.util';
import { RootStore } from '@app/global-state/store';
import {
  queryClientRef,
  storeRef,
  dispatchRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
} from '@app/operations/global-modules';
import { loadCssRules } from '@app/platform/file-icon-theme';
import { createFakeFileSystem } from '@app/platform/file-system.fake';
import { createFakeNativeHost } from '@app/platform/native-host.fake';
import { createFakePersistentStorage } from '@app/platform/persistent-storage.fake';
import { FILE_ICON_THEME_PATH_FRAGMENT } from '@app/static-resources-renderer';
import { addIconThemeCssRulesToHead } from '@app/ui/file-icon-theme';
import { createQueryClient, Globals } from '@app/ui/Globals';

/**
 * https://stackoverflow.com/a/42791996/1700319
 */
export function varToString(varObj: ObjectLiteral): string {
  return Object.keys(varObj)[0];
}

export function deriveIdFromMetadataAndExportName(
  metadata: { title: string },
  nameOfStoryBinding: string,
): string {
  return toId(metadata.title, storyNameFromExport(nameOfStoryBinding));
}

const FILE_ICON_THEME_RELATIVE_PATH = './icon-theme/';
const FILE_ICON_THEME_PATH_REPLACE_REGEX = /file:\/\/\//g;
export async function loadCssRulesAndAddToStyleTag() {
  const iconThemeCssRules = await loadCssRules({
    fileIconThemeRelativePath: FILE_ICON_THEME_RELATIVE_PATH,
    fileIconThemePathFragment: FILE_ICON_THEME_PATH_FRAGMENT,
    cssRulesPostProcessing: (rawIconThemeCssRules, fileIconThemePathFragment) =>
      rawIconThemeCssRules.replace(
        FILE_ICON_THEME_PATH_REPLACE_REGEX,
        path.join(FILE_ICON_THEME_RELATIVE_PATH, fileIconThemePathFragment, '/'),
      ),
  });
  addIconThemeCssRulesToHead(iconThemeCssRules);
}

export async function initializeFakePlatformModules() {
  fileSystemRef.current = await createFakeFileSystem();
  nativeHostRef.current = createFakeNativeHost();
  persistentStorageRef.current = createFakePersistentStorage();
}

export const GlobalDefaultWrapper: React.FC<{ store: RootStore }> = ({ store, children }) => {
  const queryClient = createQueryClient();
  queryClientRef.current = queryClient;
  storeRef.current = store;
  dispatchRef.current = store.dispatch;

  return (
    <Globals queryClient={queryClient} store={store}>
      {children}
    </Globals>
  );
};
