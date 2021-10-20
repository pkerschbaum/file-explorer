/**
 * add CSS styles for file icon theme
 * (derived from https://github.com/microsoft/vscode/blob/6f47f12c4d3f4f1b35c3ecb057abb62f9d3a4a49/src/vs/workbench/services/themes/browser/workbenchThemeService.ts#L725-L736)
 */
export function addIconThemeCssRulesToHead(cssRules: string) {
  const elStyle = document.createElement('style');
  elStyle.type = 'text/css';
  elStyle.textContent = cssRules;
  elStyle.dataset.iconTheme = 'active';
  document.head.appendChild(elStyle);
}
