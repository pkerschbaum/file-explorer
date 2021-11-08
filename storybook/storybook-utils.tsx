import { storyNameFromExport, toId } from '@storybook/csf';
import { DecoratorFn } from '@storybook/react';

import { ObjectLiteral } from '@app/base/utils/types.util';
import { createStoreInstance } from '@app/global-state/store';
import { queryClientRef, storeRef, dispatchRef } from '@app/operations/global-modules';
import { createQueryClient, Globals } from '@app/ui/Globals';

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

export const globalDecorator: DecoratorFn = (story) => {
  const queryClient = createQueryClient();
  queryClientRef.current = queryClient;
  const store = createStoreInstance();
  storeRef.current = store;
  dispatchRef.current = store.dispatch;

  return (
    <Globals queryClient={queryClient} store={store}>
      {story()}
    </Globals>
  );
};
