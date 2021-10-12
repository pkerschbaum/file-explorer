import { URI } from 'code-oss-file-icon-theme/out/vs/base/common/uri';
import * as json from 'code-oss-file-icon-theme/out/vs/base/common/json';
import { ILanguageExtensionPoint } from 'code-oss-file-icon-theme/out/vs/editor/common/services/modeService';
import { ModesRegistry } from 'code-oss-file-icon-theme/out/vs/editor/common/modes/modesRegistry';
import { ModeServiceImpl } from 'code-oss-file-icon-theme/out/vs/editor/common/services/modeServiceImpl';
import { getIconClasses as getIconClassesOriginal } from 'code-oss-file-icon-theme/out/vs/editor/common/services/getIconClasses';
import { FileIconThemeData } from 'code-oss-file-icon-theme/out/vs/workbench/services/themes/browser/fileIconThemeData';
import {
  IThemeExtensionPoint,
  ExtensionData,
} from 'code-oss-file-icon-theme/out/vs/workbench/services/themes/common/workbenchThemeService';
import { IFileService, FileKind } from 'code-oss-file-service/out/vs/platform/files/common/files';

import {
  EXTENSIONS_DIRECTORY_URI,
  FILE_ICON_PATH_FRAGMENT,
  FILE_ICON_THEME_PATH_REPLACE_REGEX,
  FILE_ICON_THEME_RELATIVE_PATH,
  FILE_ICON_THEME_URI,
} from '@app/static-resources';

export type FileIconTheme = {
  iconThemeCssRules: string;
  getIconClasses: (resource: URI | undefined, fileKind?: FileKind) => string[];
};

async function registerLanguagesOfExtensions(fileService: IFileService) {
  const extensionDirStat = await fileService.resolve(EXTENSIONS_DIRECTORY_URI);
  if (!extensionDirStat.children) {
    return;
  }

  const extensions = extensionDirStat.children.filter((child) => child.isDirectory);

  await Promise.all(
    extensions.map(async (extension) => {
      const filesOfExtension = await fileService.resolve(extension.resource);
      const packageJsons = filesOfExtension.children?.filter(
        (child) => child.name === 'package.json',
      );
      if (!packageJsons || packageJsons.length !== 1) {
        return;
      }

      const packageJsonStat = packageJsons[0];
      const packageJsonFileContent = await fileService.readFile(packageJsonStat.resource);

      const parseErrors: json.ParseError[] = [];
      const packageJsonParsed = json.parse(packageJsonFileContent.value.toString(), parseErrors);
      if (parseErrors.length > 0) {
        // TODO throw custom error
        throw new Error(`could not parse json`);
      }

      if (Array.isArray(packageJsonParsed?.contributes?.languages)) {
        const languages: ILanguageExtensionPoint[] = packageJsonParsed.contributes.languages;
        for (const language of languages) {
          ModesRegistry.registerLanguage(language);
        }
      }
    }),
  );
}

async function loadFileIconTheme(fileService: IFileService) {
  const packageJsonStat = await fileService.readFile(
    URI.joinPath(FILE_ICON_THEME_URI, 'package.json'),
  );

  const parseErrors: json.ParseError[] = [];
  const packageJsonParsed = json.parse(packageJsonStat.value.toString(), parseErrors);
  if (parseErrors.length > 0) {
    // TODO throw custom error
    throw new Error(`could not parse json`);
  }
  if (!Array.isArray(packageJsonParsed?.contributes?.iconThemes)) {
    // TODO throw custom error
    throw new Error(`package.json content does not specify a icon theme`);
  }

  const iconThemeExtensionPoint: IThemeExtensionPoint = packageJsonParsed.contributes.iconThemes[0];
  const iconThemeLocation = URI.joinPath(FILE_ICON_THEME_URI, iconThemeExtensionPoint.path);
  const iconThemeExtensionData: ExtensionData = {
    extensionId: FILE_ICON_PATH_FRAGMENT,
    extensionPublisher: packageJsonParsed.publisher,
    extensionName: packageJsonParsed.name,
    extensionIsBuiltin: false,
  };
  const fileIconTheme = FileIconThemeData.fromExtensionTheme(
    iconThemeExtensionPoint,
    iconThemeLocation,
    iconThemeExtensionData,
  );

  let cssRules = await fileIconTheme.ensureLoaded(fileService as any);
  if (!cssRules) {
    // TODO throw custom error
    throw new Error(`loading the file icon theme did not result in any css rules`);
  }

  /**
   * The icon-theme logic of the code-oss project constructs URLs in the CSS which use the special resource scheme "vscode-file:".
   * But we want to just use a relative path so that it works with this electron-forge setup.
   * That's why we replace all occurences of such URLs by relative paths.
   */
  cssRules = cssRules.replace(FILE_ICON_THEME_PATH_REPLACE_REGEX, FILE_ICON_THEME_RELATIVE_PATH);

  return cssRules;
}

const modeService = new ModeServiceImpl();

export async function bootstrapModule(fileService: IFileService): Promise<FileIconTheme> {
  await registerLanguagesOfExtensions(fileService);
  const iconThemeCssRules = await loadFileIconTheme(fileService);

  const result: FileIconTheme = {
    iconThemeCssRules,
    getIconClasses: (resource, fileKind) => {
      return getIconClassesOriginal(undefined, modeService, resource, fileKind);
    },
  };

  return result;
}
