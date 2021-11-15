import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';

import { addLaunchOptionsPlugin } from '@app-cypress/plugins/add-launch-options';

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  // https://github.com/jaredpalmer/cypress-image-snapshot#installation
  addMatchImageSnapshotPlugin(on, config);

  addLaunchOptionsPlugin(on, config);

  return config;
};
