export function addLaunchOptionsPlugin(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) {
  on('before:browser:launch', (browser, launchOptions) => {
    /**
     * Maximize chromium-based browsers
     */
    if (browser.isHeaded && browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push('--start-maximized');
    }

    /**
     * Set prefers-reduced-motion media query (required for stability of visual regression tests)
     * https://dev.to/ecosia/clicking-stuff-in-e2e-tests-smooth-scrolling-electron-flags-and-cypress-2a1c
     */
    if (browser.family === 'firefox') {
      launchOptions.preferences['ui.prefersReducedMotion'] = 1;
    } else if (browser.family === 'chromium') {
      launchOptions.args.push('--force-prefers-reduced-motion');
    }

    return launchOptions;
  });

  return config;
}
