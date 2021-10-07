import { URI } from 'code-oss-file-icon-theme/out/vs/base/common/uri';
import * as path from 'code-oss-file-icon-theme/out/vs/base/common/path';
import * as json from 'code-oss-file-icon-theme/out/vs/base/common/json';
import { ILanguageExtensionPoint } from 'code-oss-file-icon-theme/out/vs/editor/common/services/modeService';
import { ModesRegistry } from 'code-oss-file-icon-theme/out/vs/editor/common/modes/modesRegistry';

import { fileServiceIpcRenderer } from '@app/platform/file-service/electron-preload/file-service';

const EXTENSIONS_DIRECTORY_URI = URI.file(path.join(__dirname, 'static', 'extensions'));

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
      const packageJsonParsed = json.parse(packageJsonFileContent.value.toString());
      if (Array.isArray(packageJsonParsed?.contributes?.languages)) {
        const languages: ILanguageExtensionPoint[] = packageJsonParsed.contributes.languages;
        for (const language of languages) {
          ModesRegistry.registerLanguage(language);
        }
      }
    }),
  );
}

registerLanguagesOfExtensions().catch((e: unknown) => {
  // TODO replace "console" with logger
  console.error('error occured while registering languages of extensions', e);
});
