import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import '@app/platform/file-service/electron-browser/file-service';
import { render } from '@app/ui/App';

async function testReadDirectory() {
  const homefolder = URI.file('/home/pkerschbaum');
  const result = await window.fileService.resolve(homefolder);
  console.dir(result);
}

async function rendererScriptEntryPoint() {
  // add CSS styles for file icon theme
  // (derived from https://github.com/microsoft/vscode/blob/6f47f12c4d3f4f1b35c3ecb057abb62f9d3a4a49/src/vs/workbench/services/themes/browser/workbenchThemeService.ts#L725-L736)
  const elStyle = document.createElement('style');
  elStyle.type = 'text/css';
  elStyle.textContent = window.fileIconTheme.iconThemeCssRules;
  document.head.appendChild(elStyle);

  // render application
  render();

  // TODO remove me
  await testReadDirectory();
}

void rendererScriptEntryPoint();
