import { getDocument, queries } from 'pptr-testing-library';

type GetByRoleParamters = Parameters<typeof queries.getByRole>;

export async function openPageForStory({ storybookId }: { storybookId: string }) {
  const page = await global.__BROWSER__.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  page.setDefaultTimeout(0);
  await page.goto(`http://localhost:6006/iframe.html?viewMode=story&args=&id=${storybookId}`, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });
  const $document = await getDocument(page);

  const getByRole = (m: GetByRoleParamters[1], opts?: GetByRoleParamters[2]) =>
    queries.getByRole($document, m, opts);

  return { page, queries: { getByRole } };
}
