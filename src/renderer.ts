import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import { render } from '@app/ui/App';

async function rendererScriptEntryPoint() {
  await window.preload.initializationPromise;

  // add CSS styles for file icon theme
  // (derived from https://github.com/microsoft/vscode/blob/6f47f12c4d3f4f1b35c3ecb057abb62f9d3a4a49/src/vs/workbench/services/themes/browser/workbenchThemeService.ts#L725-L736)
  const elStyle = document.createElement('style');
  elStyle.type = 'text/css';
  elStyle.textContent = window.preload.fileIconTheme.iconThemeCssRules;
  document.head.appendChild(elStyle);

  // TODO remove me
  // test file service module
  const homefolder = URI.file('/home/pkerschbaum');
  const result = await window.preload.fileService.resolve(homefolder);
  console.dir(result);

  // render React application
  render();
}

void rendererScriptEntryPoint();
