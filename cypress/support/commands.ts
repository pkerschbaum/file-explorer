// https://testing-library.com/docs/cypress-testing-library/intro/#usage
import '@testing-library/cypress/add-commands';
import { addMatchImageSnapshotCommand } from '@pkerschbaum/cypress-image-snapshot/lib/command';

// https://github.com/jaredpalmer/cypress-image-snapshot#installation
addMatchImageSnapshotCommand({
  failureThreshold: 0.03,
  failureThresholdType: 'percent',
});
