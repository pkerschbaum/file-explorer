// https://testing-library.com/docs/cypress-testing-library/intro/#usage
import '@testing-library/cypress/add-commands';

// https://github.com/jaredpalmer/cypress-image-snapshot#installation
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
addMatchImageSnapshotCommand({
  failureThreshold: 0.03,
  failureThresholdType: 'percent',
});
