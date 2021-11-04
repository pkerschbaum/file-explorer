/* eslint-disable no-console */
import * as json from '@pkerschbaum/code-oss-file-icon-theme/out/vs/base/common/json';
import { ILanguageExtensionPoint } from '@pkerschbaum/code-oss-file-icon-theme/out/vs/editor/common/services/modeService';
import { VSBuffer } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/buffer';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import path from 'path';

import { bootstrapModule as bootstrapFileServiceModule } from '@app/platform/electron-preload/file-service';
import { LanguageExtensionPointJsonEntry } from '@app/platform/file-icon-theme';

const CODE_OSS_FILE_ICON_THEME_LANGUAGES_PATH = URI.file(
  path.resolve(
    __dirname,
    '..',
    'node_modules',
    '@pkerschbaum',
    'code-oss-file-icon-theme',
    'static',
    'language-extensions',
  ),
);
const LANGUAGE_EXTENSION_POINTS_PATH = URI.file(
  path.join(__dirname, '..', 'src', 'static', 'icon-theme', 'language-extension-points.json'),
);

async function compileLanguageExtensionsIntoJsonFile() {
  const { fileService } = bootstrapFileServiceModule();

  const extensionDirStat = await fileService.resolve(CODE_OSS_FILE_ICON_THEME_LANGUAGES_PATH);
  if (!extensionDirStat.children) {
    return;
  }

  const extensions = extensionDirStat.children.filter((child) => child.isDirectory);

  const packagesWithExtensionPoint: LanguageExtensionPointJsonEntry[] = [];
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
        throw new Error(`could not parse json! parseErrors=${JSON.stringify(parseErrors)}`);
      }

      if (!Array.isArray(packageJsonParsed?.contributes?.languages)) {
        return;
      }

      const languages: ILanguageExtensionPoint[] = packageJsonParsed.contributes.languages;
      packagesWithExtensionPoint.push({ packageName: packageJsonParsed.name, languages });
    }),
  );

  packagesWithExtensionPoint.sort((a, b) => a.packageName.localeCompare(b.packageName));

  await fileService.writeFile(
    LANGUAGE_EXTENSION_POINTS_PATH,
    VSBuffer.fromString(JSON.stringify(packagesWithExtensionPoint)),
  );
}

void compileLanguageExtensionsIntoJsonFile().catch((e) => console.error(e));
