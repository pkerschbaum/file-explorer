import { storyNameFromExport, toId } from '@storybook/csf';

import { ObjectLiteral } from '@app/base/utils/types.util';
import { fileIconThemeLoaderRef, logWriterRef } from '@app/operations/global-modules';

import { createLogWriter } from '@app/platform/log-writer';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';

import { createStorybookFileIconThemeLoader } from '@app-storybook/file-icon-theme-loader';

/**
 * https://stackoverflow.com/a/42791996/1700319
 */
export function varToString(varObj: ObjectLiteral): string {
  return Object.keys(varObj)[0];
}

export function deriveIdFromMetadataAndExportName(
  metadata: { title: string },
  nameOfStoryBinding: string,
): string {
  return toId(metadata.title, storyNameFromExport(nameOfStoryBinding));
}

export async function initializeStorybookPlatformModules() {
  await initializeFakePlatformModules();
  fileIconThemeLoaderRef.current = createStorybookFileIconThemeLoader();
  logWriterRef.current = createLogWriter();
}
