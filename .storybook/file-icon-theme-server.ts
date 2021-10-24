import express from 'express';
import cors from 'cors';

// set process type to "renderer" to allow reading from  src/static-resources-renderer.ts
import 'electron';
(process as any).type = 'renderer';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import {
  getIconClasses,
  loadFileIconThemeCssRules,
  registerLanguagesOfExtensions,
} from '@pkerschbaum/code-oss-file-icon-theme';

import { createLogger } from '@app/base/logger/logger';
import { FILE_ICON_THEME_PATH_REPLACE_REGEX } from '@app/platform/electron-preload/file-icon-theme';
import {
  CssRulesHttp,
  CSS_RULES_SLUG,
  IconClassesHttp,
  ICON_CLASSES_SLUG,
  PORT,
} from '@app/platform/file-icon-theme.fake';

const EXTENSIONS_DIRECTORY_URI = URI.file(
  path.join(
    __dirname,
    '..',
    'node_modules',
    '@pkerschbaum',
    'code-oss-file-icon-theme',
    'static',
    'language-extensions',
  ),
);
const FILE_ICON_THEME_BASE_URI = URI.file(
  path.join(__dirname, '..', 'src', 'static', 'icon-theme'),
);

const logger = createLogger('file-icon-theme-server');

async function entrypoint() {
  await registerLanguagesOfExtensions(EXTENSIONS_DIRECTORY_URI);

  const app = express();
  app.use(cors());
  app.use(express.json());

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.get(`/${CSS_RULES_SLUG}`, async (req, res) => {
    try {
      const iconThemeCssRules = await loadFileIconThemeCssRules(
        URI.joinPath(FILE_ICON_THEME_BASE_URI, req.query.fileIconThemePathFragment as string),
      );

      /**
       * The icon-theme logic of the code-oss project constructs URLs in the CSS which use the special resource scheme "vscode-file:".
       * But we want to just use a relative path so that it works with this storybook setup.
       * That's why we replace all occurences of such URLs by relative paths.
       */
      const cssRules = iconThemeCssRules.replace(
        FILE_ICON_THEME_PATH_REPLACE_REGEX,
        './icon-theme/',
      );

      const response: CssRulesHttp.Response = { cssRules };
      res.json(response);
    } catch {
      res.status(500).send();
    }
  });

  app.post(`/${ICON_CLASSES_SLUG}`, (req, res) => {
    const iconClassesString = getIconClasses(URI.parse(req.body.uriStringified), req.body.fileKind);
    const response: IconClassesHttp.Response = { iconClassesString };
    res.json(response);
  });

  app.listen(PORT, () => {
    logger.info(`file-icon-theme-server listening at http://localhost:${PORT}`, { PORT });
  });
}

void entrypoint();
