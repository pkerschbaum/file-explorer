import express from 'express';
import cors from 'cors';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import {
  registerLanguagesOfExtensions,
  loadFileIconTheme,
} from '@pkerschbaum/code-oss-file-icon-theme';

import { FILE_ICON_PATH_FRAGMENT } from '@app/static-resources-renderer';
import { createLogger } from '@app/base/logger/logger';
import { FILE_ICON_THEME_PATH_REPLACE_REGEX } from '@app/platform/file-icon-theme';
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
const FILE_ICON_THEME_URI = URI.file(
  path.join(__dirname, '..', 'src', 'static', 'icon-theme', FILE_ICON_PATH_FRAGMENT),
);

const logger = createLogger('file-icon-theme-server');

async function entrypoint() {
  await registerLanguagesOfExtensions(EXTENSIONS_DIRECTORY_URI);
  const iconTheme = await loadFileIconTheme(FILE_ICON_THEME_URI);

  /**
   * The icon-theme logic of the code-oss project constructs URLs in the CSS which use the special resource scheme "vscode-file:".
   * But we want to just use a relative path so that it works with this storybook setup.
   * That's why we replace all occurences of such URLs by relative paths.
   */
  const cssRules = iconTheme.iconThemeCssRules.replace(
    FILE_ICON_THEME_PATH_REPLACE_REGEX,
    './icon-theme/',
  );

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get(`/${CSS_RULES_SLUG}`, (_1, res) => {
    const response: CssRulesHttp.Response = { cssRules };
    res.json(response);
  });

  app.post(`/${ICON_CLASSES_SLUG}`, (req, res) => {
    const iconClassesString = iconTheme.getIconClasses(
      URI.parse(req.body.uriStringified),
      req.body.fileKind,
    );
    const response: IconClassesHttp.Response = { iconClassesString };
    res.json(response);
  });

  app.listen(PORT, () => {
    logger.info(`file-icon-theme-server listening at http://localhost:${PORT}`, { PORT });
  });
}

void entrypoint();
