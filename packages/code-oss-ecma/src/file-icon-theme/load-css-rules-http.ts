import * as codeOSSFileIconTheme from '@pkerschbaum/code-oss-file-icon-theme';
import { ModesRegistry } from '@pkerschbaum/code-oss-file-icon-theme/out/vs/editor/common/modes/modesRegistry';
import type { ILanguageExtensionPoint } from '@pkerschbaum/code-oss-file-icon-theme/out/vs/editor/common/services/modeService';
import { check } from '@pkerschbaum/commons-ecma/util/assert';
import { jsonUtil } from '@pkerschbaum/commons-ecma/util/json';
import axios from 'axios';

import type { FileIconTheme } from '@file-explorer/domain/constants';

import type { IFileContent, IFileService } from '#pkg/files';
import { formatter } from '#pkg/formatter.util';
import { path } from '#pkg/path';
import { URI } from '#pkg/uri';

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

    const resourceJson: unknown = (
      await axios.request({
        method: 'GET',
        url: `.${relativeUrlToFetch}`,
      })
    ).data;

    return {
      value: {
        toString: () => jsonUtil.safeStringify(resourceJson),
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
    const allLanguages = languageExtensionPoints.flatMap((elem) => elem.languages);
    for (const language of allLanguages) {
      ModesRegistry.registerLanguage(language);
    }
  }

  const iconThemeCssRules = await codeOSSFileIconTheme.loadFileIconThemeCssRules({
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-icon-theme` here
    fileIconThemeUri: URI.from(
      URI.file(path.join('/', fileIconThemeRelativePath, fileIconThemePathFragment)),
    ),
    fileService: httpIconThemeFileService as IFileService,
  });

  /**
   * The icon-theme logic of the code-oss project constructs URLs in the CSS which use a resource scheme (e.g. "file://").
   * But we want to just use a relative path so that it works with web apps.
   * That's why we replace all occurences of such URLs by relative paths.
   */
  const cssRules = cssRulesPostProcessing(iconThemeCssRules);

  return cssRules;
}
