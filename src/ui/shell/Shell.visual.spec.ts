import { cy } from 'local-cypress';

import metadata, { DefaultCase } from '@app/ui/shell/Shell.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

import { getTestTitle, bootstrap } from '@app-cypress/cypress.util';

describe('Shell [visual]', () => {
  it('Base Case', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ DefaultCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.document().matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('Filter Resources', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ DefaultCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByRole('textbox', { name: /Filter/i }).type('testf');

    cy.document().matchImageSnapshot(`${getTestTitle()}_1_after-first-filter-input`);

    cy.findByRole('textbox', { name: /Filter/i })
      .clear()
      .type('aa test');

    cy.document().matchImageSnapshot(`${getTestTitle()}_2_after-second-filter-input`);
  });

  it('Trigger Rename', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ DefaultCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByRole('row', { name: /testfile2.docx/i }).click();
    cy.findByRole('button', { name: /Rename/i }).click();

    cy.document().matchImageSnapshot(`${getTestTitle()}_1_after-trigger-of-rename`);
  });
});
