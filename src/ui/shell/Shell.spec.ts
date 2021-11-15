import metadata, { DefaultCase } from '@app/ui/shell/Shell.stories';

import { events, openPageForStory } from '@app-test/utils/pptr.util';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

it('Filter Resources', async () => {
  const storybookId = deriveIdFromMetadataAndExportName(metadata, varToString({ DefaultCase }));
  const { page, queries } = await openPageForStory({ storybookId });

  const filterTextInput = await queries.getByRole('textbox', { name: /Filter/i });
  await filterTextInput.type('testf');

  const image1 = await page.screenshot();
  expect(image1).toMatchImageSnapshot('after-first-filter-input');

  await events.clearTextInput(filterTextInput);
  await filterTextInput.type('aa test');

  const image2 = await page.screenshot();
  expect(image2).toMatchImageSnapshot('after-second-filter-input');
});

it('Trigger Rename', async () => {
  const storybookId = deriveIdFromMetadataAndExportName(metadata, varToString({ DefaultCase }));
  const { page, queries } = await openPageForStory({ storybookId });

  const image1 = await page.screenshot();
  expect(image1).toMatchImageSnapshot('before-trigger-of-rename');

  const fileToSelect = await queries.getByRole('row', { name: /testfile2.docx/i });
  await fileToSelect.click();
  const renameButton = await queries.getByRole('button', { name: /Rename/i });
  await renameButton.click();

  const image2 = await page.screenshot();
  expect(image2).toMatchImageSnapshot('after-trigger-of-rename');
});
