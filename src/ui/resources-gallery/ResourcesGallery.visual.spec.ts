import { cy, describe, it } from 'local-cypress';

import metadata, { DefaultCase } from '@app/ui/resources-gallery/ResourcesGallery.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

import { getTestTitle, bootstrap } from '@app-cypress/cypress.util';

describe('ResourcesGallery [visual]', () => {
  it('Default Case', () => {
    const storybookIdToVisit = deriveIdFromMetadataAndExportName(
      metadata,
      varToString({ DefaultCase }),
    );
    bootstrap({ storybookIdToVisit });

    cy.document().matchImageSnapshot(`${getTestTitle()}_1`);
  });
});
