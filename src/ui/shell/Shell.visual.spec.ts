import { cy } from 'local-cypress';

import metadata, { WithProcesses, SimpleCase } from '@app/ui/shell/Shell.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

import { getTestTitle, bootstrap } from '@app-cypress/cypress.util';

describe('Shell [visual]', () => {
  it('with processes', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ WithProcesses }),
    );
    bootstrap({ storybookIdToVisit });

    cy.document().matchImageSnapshot(`${getTestTitle()}_1`);
  });

  it('filter resources', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ SimpleCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByRole('textbox', { name: /Filter/i }).type('testf');

    cy.document().matchImageSnapshot(`${getTestTitle()}_1_after-first-filter-input`);

    cy.findByRole('textbox', { name: /Filter/i })
      .clear()
      .type('aa test');

    cy.document().matchImageSnapshot(`${getTestTitle()}_2_after-second-filter-input`);
  });

  it('trigger rename', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ SimpleCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByRole('row', { name: /testfile2.docx/i }).click();
    cy.findByRole('button', { name: /Rename/i }).click();

    cy.document().matchImageSnapshot(`${getTestTitle()}_1_after-trigger-of-rename`);
  });

  it('open and close sidebar', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ SimpleCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByRole('button', { name: /Open User Preferences/i }).click();

    cy.document().matchImageSnapshot(`${getTestTitle()}_1_sidebar-open`);

    cy.findByRole('button', { name: /Hide User Preferences/i }).click();

    cy.document().matchImageSnapshot(`${getTestTitle()}_2_sidebar-hidden`);
  });

  it('switch theme', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ SimpleCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByRole('button', { name: /Open User Preferences/i }).click();
    cy.findByRole('button', { name: /Flow/i }).click();

    cy.document().matchImageSnapshot(`${getTestTitle()}_1_switched-theme`);
  });

  it.only('switch file icon theme', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ SimpleCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.intercept({ url: /icons\/folder\.svg/i }).as('iconRequest');

    cy.findByRole('button', { name: /Open User Preferences/i }).click();
    cy.findByRole('button', { name: /Material Design/i }).click();

    cy.wait('@iconRequest');

    cy.document().matchImageSnapshot(`${getTestTitle()}_1_switched-file-icon-theme`);
  });
});
