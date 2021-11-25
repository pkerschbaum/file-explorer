import { cy } from 'local-cypress';

import metadata, {
  Failure,
  PendingForUserInput,
  Running,
  Success,
  VeryLongResourceNames,
} from '@app/ui/process/DeleteProcess.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

import { getTestTitle, bootstrap } from '@app-cypress/cypress.util';

describe('DeleteProcess [visual]', () => {
  it('Pending for User Input', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ PendingForUserInput }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/Delete Process/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Running', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ Running }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/Delete Process/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Success', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ Success }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/Delete Process/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Failure', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ Failure }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/Delete Process/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Very Long Resource Names', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ VeryLongResourceNames }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByLabelText(/Delete Process/i).matchImageSnapshot(`${getTestTitle()}_1`);
  });
});
