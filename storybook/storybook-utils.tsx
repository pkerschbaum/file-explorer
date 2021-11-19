import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { storyNameFromExport, toId } from '@storybook/csf';

import { ObjectLiteral } from '@app/base/utils/types.util';
import { loadCssRules } from '@app/platform/file-icon-theme';
import { FILE_ICON_THEME_PATH_FRAGMENT } from '@app/static-resources-renderer';
import { addIconThemeCssRulesToHead } from '@app/ui/file-icon-theme';

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
