import { storyNameFromExport, toId } from '@storybook/csf';
import type { ComponentMeta } from '@storybook/react';
import invariant from 'tiny-invariant';

import { ObjectLiteral } from '@app/base/utils/types.util';
import { setGlobalModules } from '@app/operations/global-modules';
import { createLogWriter } from '@app/platform/browser/log-writer';
import { createStorybookFileIconThemeLoader } from '@app/platform/storybook/file-icon-theme-loader';

import {
  initializeFakePlatformModules,
  InitializeFakePlatformModulesArgs,
} from '@app-test/utils/fake-platform-modules';

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

export async function initializeStorybookPlatformModules(args?: InitializeFakePlatformModulesArgs) {
  await initializeFakePlatformModules(args);
  setGlobalModules({
    fileIconThemeLoader: createStorybookFileIconThemeLoader(),
    logWriter: createLogWriter(),
  });
}
