import { contextBridge } from 'electron';
import { URI } from 'code-oss-file-icon-theme/out/vs/base/common/uri';
import * as json from 'code-oss-file-icon-theme/out/vs/base/common/json';
import { ILanguageExtensionPoint } from 'code-oss-file-icon-theme/out/vs/editor/common/services/modeService';
import { ModesRegistry } from 'code-oss-file-icon-theme/out/vs/editor/common/modes/modesRegistry';
import { FileIconThemeData } from 'code-oss-file-icon-theme/out/vs/workbench/services/themes/browser/fileIconThemeData';
import {
  IThemeExtensionPoint,
  ExtensionData,
} from 'code-oss-file-icon-theme/out/vs/workbench/services/themes/common/workbenchThemeService';
import { IFileService } from 'code-oss-file-icon-theme/out/vs/platform/files/common/files';

import {
  EXTENSIONS_DIRECTORY_URI,
  FILE_ICON_PATH_FRAGMENT,
  FILE_ICON_THEME_PATH_REPLACE_REGEX,
  FILE_ICON_THEME_RELATIVE_PATH,
  FILE_ICON_THEME_URI,
} from '@app/static-resources';
import {
  CONTEXT_BRIDGE_KEY,
  FileIconThemeIpcRenderer,
} from '@app/platform/file-icon-theme/common/file-icon-theme';
import { fileServiceIpcRenderer } from '@app/platform/file-service/electron-preload/file-service';

async function registerLanguagesOfExtensions() {
  const extensionDirStat = await fileServiceIpcRenderer.resolve(EXTENSIONS_DIRECTORY_URI);
  if (!extensionDirStat.children) {
    return;
  }

  const extensions = extensionDirStat.children.filter((child) => child.isDirectory);

  await Promise.all(
    extensions.map(async (extension) => {
      const filesOfExtension = await fileServiceIpcRenderer.resolve(extension.resource);
      const packageJsons = filesOfExtension.children?.filter(
        (child) => child.name === 'package.json',
      );
      if (!packageJsons || packageJsons.length !== 1) {
        return;
      }

      const packageJsonStat = packageJsons[0];
      const packageJsonFileContent = await fileServiceIpcRenderer.readFile(
        packageJsonStat.resource,
      );

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

async function loadFileIconTheme() {
  const packageJsonStat = await fileServiceIpcRenderer.readFile(
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

  let cssRules = await fileIconTheme.ensureLoaded(fileServiceIpcRenderer as IFileService);
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

export async function bootstrapModule() {
  await registerLanguagesOfExtensions();
  const iconThemeCssRules = await loadFileIconTheme();

  const fileIconThemeIpcRenderer: FileIconThemeIpcRenderer = {
    iconThemeCssRules,
  };
  contextBridge.exposeInMainWorld(CONTEXT_BRIDGE_KEY, fileIconThemeIpcRenderer);
}
