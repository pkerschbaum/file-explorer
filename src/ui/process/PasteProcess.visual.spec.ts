import { cy, describe, it } from 'local-cypress';

import metadata, {
  AbortRequested,
  AbortSuccess,
  Failure,
  RunningDeterminingTotalSize,
  RunningPerformingPaste,
  Success,
} from '@app/ui/process/PasteProcess.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

import { getTestTitle, bootstrap } from '@app-cypress/cypress.util';

describe('PasteProcess [visual]', () => {
  it('Running Determining Total Size', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ RunningDeterminingTotalSize }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/^Paste Process$/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Running Performing Paste', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ RunningPerformingPaste }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/^Paste Process$/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Success', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ Success }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/^Paste Process$/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Abort Requested', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ AbortRequested }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/^Paste Process$/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Abort Success', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ AbortSuccess }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/^Paste Process$/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Failure', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ Failure }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/^Paste Process$/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });
});
