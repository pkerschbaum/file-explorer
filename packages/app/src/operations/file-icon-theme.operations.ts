import { ModesRegistry } from '@pkerschbaum/code-oss-file-icon-theme/out/vs/editor/common/modes/modesRegistry';
import type { ILanguageExtensionPoint } from '@pkerschbaum/code-oss-file-icon-theme/out/vs/editor/common/services/modeService';
import axios from 'axios';

import type { IFileContent, IFileService } from '@app/base/files';
import { path } from '@app/base/path';
import { URI } from '@app/base/uri';
import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { json } from '@app/base/utils/json.util';
import type { FileIconTheme } from '@app/domain/constants';
import { loadFileIconThemeCssRules } from '@app/platform/browser/file-icon-theme';

export type LanguageExtensionPointJsonEntry = {
  packageName: string;
  languages: ILanguageExtensionPoint[];
};

const httpIconThemeFileService: { readFile: IFileService['readFile'] } = {
  readFile: async (resource) => {
    const relativeUrlToFetch = /(\/icon-theme\/.+)/.exec(resource.path)?.[1];
    if (check.isNullishOrEmptyString(relativeUrlToFetch)) {
      throw new Error(
        `could not extract relative url to fetch! resource=${formatter.resourcePath(resource)}`,
      );
    }

    const resourceJson = (
      await axios.request({
        method: 'GET',
        url: `.${relativeUrlToFetch}`,
      })
    ).data;

    return {
      value: {
        toString: () => json.safeStringify(resourceJson),
      },
    } as IFileContent;
  },
};

let didInitializeLanguageExtensionPoints = false;
export async function loadCssRules({
  fileIconThemeRelativePath,
  fileIconThemePathFragment,
  cssRulesPostProcessing,
}: {
  fileIconThemeRelativePath: string;
  fileIconThemePathFragment: FileIconTheme['fsPathFragment'];
  cssRulesPostProcessing: (rawIconThemeCssRules: string) => string;
}): Promise<string> {
  if (!didInitializeLanguageExtensionPoints) {
    didInitializeLanguageExtensionPoints = true;
    const languageExtensionPoints = (
      await axios.request<LanguageExtensionPointJsonEntry[]>({
        method: 'GET',
        url: path.join(fileIconThemeRelativePath, 'language-extension-points.json'),
      })
    ).data;
    const allLanguages = languageExtensionPoints.map((elem) => elem.languages).flat();
    for (const language of allLanguages) {
      ModesRegistry.registerLanguage(language);
    }
  }

  const iconThemeCssRules = await loadFileIconThemeCssRules({
    fileIconThemeUri: URI.file(
      path.join('/', fileIconThemeRelativePath, fileIconThemePathFragment),
    ),
    fileService: httpIconThemeFileService as IFileService,
  });

  /**
   * The icon-theme logic of the code-oss project constructs URLs in the CSS which use a resource scheme (e.g. "file://").
   * But we want to just use a relative path so that it works with the electron-forge setup.
   * That's why we replace all occurences of such URLs by relative paths.
   */
  const cssRules = cssRulesPostProcessing(iconThemeCssRules);

  return cssRules;
}
