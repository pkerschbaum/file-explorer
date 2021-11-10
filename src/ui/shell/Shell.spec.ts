import metadata, { DefaultCase } from '@app/ui/shell/Shell.stories';

import { openPageForStory } from '@app-test/utils/pptr.util';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

it('Default Case', async () => {
  const storybookId = deriveIdFromMetadataAndExportName(metadata, varToString({ DefaultCase }));
  const { page, queries } = await openPageForStory({ storybookId });

  const image = await page.screenshot();
  expect(image).toMatchImageSnapshot();

  const fileToSelect = await queries.getByRole('row', { name: /testfile2.docx/i });
  await fileToSelect.click();
  const renameButton = await queries.getByRole('button', { name: /Rename/i });
  await renameButton.click();

  const image2 = await page.screenshot();
  expect(image2).toMatchImageSnapshot();
});
