import { cy } from 'local-cypress';

import metadata, { MultipleTabs, SimpleCase, WithProcesses } from '@app/ui/shell/Shell.stories';

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

  it('switch file icon theme', () => {
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

  it('the CWD should automatically update if a new folder is created', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ SimpleCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.findByRole('button', { name: /New Folder/i }).click();
    cy.findByRole('textbox', { name: /Name of folder/i }).type('name of new folder');
    cy.findByRole('button', { name: /Create/i }).click();

    cy.findByRole('table', { name: /Table of resources/i }).matchImageSnapshot(
      `${getTestTitle()}_1_folder-created`,
    );
  });

  it('if modifier keys are pressed, possible shortcuts should be shown next to the shortcut actions', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ MultipleTabs }),
    );
    bootstrap({ storybookIdToVisit });

    cy.get('body').type('{ctrl}', { release: false });
    cy.document().matchImageSnapshot(`${getTestTitle()}_1_ctrl-keydown`);
    cy.get('body').type('{ctrl}');
    cy.get('body').type('{alt}', { release: false });
    cy.document().matchImageSnapshot(`${getTestTitle()}_2_alt-keydown`);
    cy.get('body').type('{alt}');
    cy.document().matchImageSnapshot(`${getTestTitle()}_3_no-modifier-keydown`);
  });

  it('ctrl+c should trigger copy action', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ MultipleTabs }),
    );
    bootstrap({ storybookIdToVisit });

    cy.get('body').type('{ctrl}c');
    cy.document().matchImageSnapshot(`${getTestTitle()}_1_ctrl-and-c-pressed`);
  });
});
