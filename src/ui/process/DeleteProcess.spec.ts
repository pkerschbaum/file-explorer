import metadata, { PendingForUserInput } from '@app/ui/process/DeleteProcess.stories';

import { openPageForStory } from '@app-test/utils/pptr.util';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

it('Pending for User Input', async () => {
  const storybookId = deriveIdFromMetadataAndExportName(
    metadata,
    varToString({ PendingForUserInput }),
  );
  const { page } = await openPageForStory({ storybookId });

  const image = await page.screenshot();
  expect(image).toMatchImageSnapshot();
});
