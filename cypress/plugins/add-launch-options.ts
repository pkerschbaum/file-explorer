const width = 2560;
const height = 1600;

export function addLaunchOptionsPlugin(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) {
  on('before:browser:launch', (browser, launchOptions) => {
    /**
     * For screenshots, we use headless Chrome.
     * We force it into a specific resolution and device-scale-factor so that we always get screenshots
     * of the same resolution and pixel-density.
     * "--force-device-scale-factor=2" will produce screenshots with high density.
     * See https://www.cypress.io/blog/2021/03/01/generate-high-resolution-videos-and-screenshots/.
     */
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push(`--window-size=${width},${height}`);
      launchOptions.args.push('--force-device-scale-factor=2');
    }

    /**
     * Maximize chromium-based browsers
     */
    if (browser.isHeaded && browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push('--start-maximized');
    }

    return launchOptions;
  });

  return config;
}
