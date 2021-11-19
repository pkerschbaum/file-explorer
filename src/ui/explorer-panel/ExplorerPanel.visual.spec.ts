import { cy } from 'local-cypress';

import metadata, { DefaultCase } from '@app/ui/explorer-panel/ExplorerPanel.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

import { getTestTitle, bootstrap } from '@app-cypress/cypress.util';

describe('ExplorerPanel [visual]', () => {
  it.only('Default Case', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ DefaultCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.document().matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Rename resource', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ DefaultCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByRole('row', { name: /testfile1.txt/i }).click();
    cy.findByRole('button', { name: /Rename/i }).click();

    cy.document().matchImageSnapshot(`${getTestTitle()}_1`);

    cy.findByRole('textbox', { name: /new name for resource/i })
      .clear()
      .type('new-name.txt');
    cy.findByRole('button', { name: /OK/i }).click();

    cy.document().matchImageSnapshot(`${getTestTitle()}_2`);
  });
});
