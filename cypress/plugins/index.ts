import { addMatchImageSnapshotPlugin } from '@pkerschbaum/cypress-image-snapshot/lib/plugin';

import { addLaunchOptionsPlugin } from '@app-cypress/plugins/add-launch-options';

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  // https://github.com/jaredpalmer/cypress-image-snapshot#installation
  addMatchImageSnapshotPlugin(on, config);

  addLaunchOptionsPlugin(on, config);

  // allow to only use Chrome (https://docs.cypress.io/guides/guides/launching-browsers#Customize-available-browsers)
  config = {
    ...config,
    browsers: (
      config as unknown as { browsers: Cypress.RuntimeConfigOptions['browsers'] }
    ).browsers.filter((b) => b.name === 'chrome'),
  } as Cypress.PluginConfigOptions;

  return config;
};
