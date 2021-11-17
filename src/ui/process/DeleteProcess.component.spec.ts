import { cy } from 'local-cypress';

import metadata, { PendingForUserInput } from '@app/ui/process/DeleteProcess.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

import { getTestTitle, bootstrap } from '@app-cypress/cypress.util';

describe('DeleteProcess.component', () => {
  it('Pending for User Input', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ PendingForUserInput }),
    );
    bootstrap({ storybookIdToVisit });

    cy.document().matchImageSnapshot(`${getTestTitle()}_1`);
  });
});
