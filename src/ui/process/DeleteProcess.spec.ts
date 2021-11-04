import metadata, { PendingForUserInput } from '@app/ui/process/DeleteProcess.stories';

import { deriveIdFromMetadataAndExportName, varToString } from '@app-storybook/storybook-utils';

it('Pending for User Input', async () => {
  const storybookId = deriveIdFromMetadataAndExportName(
    metadata,
    varToString({ PendingForUserInput }),
  );
  const page = await global.__BROWSER__.newPage();
  page.setDefaultTimeout(0);
  await page.goto(`http://localhost:6006/iframe.html?viewMode=story&args=&id=${storybookId}`, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });
  const image = await page.screenshot();

  expect(image).toMatchImageSnapshot();
});
