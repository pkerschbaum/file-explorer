import { cy } from 'local-cypress';

import metadata, { PendingForUserInput } from '@app/ui/process/DeleteProcess.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

import { getTestTitle, visitStorybook } from '@app-cypress/cypress.util';

describe('Pending for User Input', () => {
  it('Base Case', () => {
    const storybookId = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ PendingForUserInput }),
    );
    visitStorybook(storybookId);

    cy.document().matchImageSnapshot(`${getTestTitle()}_1`);
  });
});
