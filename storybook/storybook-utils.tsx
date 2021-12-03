import { storyNameFromExport, toId } from '@storybook/csf';
import type { ComponentMeta } from '@storybook/react';
import invariant from 'tiny-invariant';

import { ObjectLiteral } from '@app/base/utils/types.util';
import { fileIconThemeLoaderRef, logWriterRef } from '@app/operations/global-modules';
import { createLogWriter } from '@app/platform/browser/log-writer';
import { createStorybookFileIconThemeLoader } from '@app/platform/storybook/file-icon-theme-loader';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';

/**
 * https://stackoverflow.com/a/42791996/1700319
 */
export function varToString(varObj: ObjectLiteral): string {
  return Object.keys(varObj)[0];
}

export function deriveIdFromMetadataAndExportName(
  metadata: ComponentMeta<any>,
  nameOfStoryBinding: string,
): string {
  invariant(metadata.title);
  return toId(metadata.title, storyNameFromExport(nameOfStoryBinding));
}

export async function initializeStorybookPlatformModules() {
  await initializeFakePlatformModules();
  fileIconThemeLoaderRef.current = createStorybookFileIconThemeLoader();
  logWriterRef.current = createLogWriter();
}
