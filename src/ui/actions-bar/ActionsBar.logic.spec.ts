import { fireEvent, screen } from '@testing-library/react';

import { ResourceUIDescription, uriHelper } from '@app/base/utils/uri-helper';
import { createStoreInstance } from '@app/global-state/store';
import { nativeHostRef, storeRef } from '@app/operations/global-modules';
import { KEY } from '@app/ui/constants';
import { createQueryClient } from '@app/ui/Globals';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';
import { renderApp } from '@app-test/utils/render-app';

describe('ActionsBar [logic]', () => {
  it('Click on button "Copy" should store selected resources in clipboard and "pasteShouldMove: false" in global-state', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    // select some resources and copy them
    const res1 = await screen.findByRole('row', { name: /aa test folder/i });
    const res2 = await screen.findByRole('row', { name: /testfile1.txt/i });
    fireEvent.click(res1);
    fireEvent.click(res2, { ctrlKey: true });
    const copyButton = await screen.findByRole('button', { name: /Copy/i });
    fireEvent.click(copyButton);

    // assert clipboard
    const resourcesInClipboard = nativeHostRef.current.clipboard.readResources();
    expect(resourcesInClipboard).toHaveLength(2);
    const actualResource1 = uriHelper.extractNameAndExtension(resourcesInClipboard[0]);
    const expectedResource1: ResourceUIDescription = {
      resourceName: 'aa test folder',
    };
    expect(actualResource1).toMatchObject(expectedResource1);
    const actualResource2 = uriHelper.extractNameAndExtension(resourcesInClipboard[1]);
    const expectedResource2: ResourceUIDescription = {
      resourceName: 'testfile1',
      extension: '.txt',
    };
    expect(actualResource2).toMatchObject(expectedResource2);

    // assert that "pasteShouldMove" was set to "false" in global state
    expect(storeRef.current.getState().processesSlice.draftPasteState).not.toBeUndefined();
    expect(storeRef.current.getState().processesSlice.draftPasteState?.pasteShouldMove).toBe(false);
  });

  it('CTRL+C should trigger the "Copy" action (therefore, store selected resources in clipboard and "pasteShouldMove: false" in global-state)', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    // select some resources and copy them
    const res1 = await screen.findByRole('row', { name: /aa test folder/i });
    const res2 = await screen.findByRole('row', { name: /testfile1.txt/i });
    fireEvent.click(res1);
    fireEvent.click(res2, { ctrlKey: true });
    fireEvent.keyDown(res1, { ctrlKey: true, key: KEY.C });

    // assert clipboard
    const resourcesInClipboard = nativeHostRef.current.clipboard.readResources();
    expect(resourcesInClipboard).toHaveLength(2);
    const actualResource1 = uriHelper.extractNameAndExtension(resourcesInClipboard[0]);
    const expectedResource1: ResourceUIDescription = {
      resourceName: 'aa test folder',
    };
    expect(actualResource1).toMatchObject(expectedResource1);
    const actualResource2 = uriHelper.extractNameAndExtension(resourcesInClipboard[1]);
    const expectedResource2: ResourceUIDescription = {
      resourceName: 'testfile1',
      extension: '.txt',
    };
    expect(actualResource2).toMatchObject(expectedResource2);

    // assert that "pasteShouldMove" was set to "false" in global state
    expect(storeRef.current.getState().processesSlice.draftPasteState).not.toBeUndefined();
    expect(storeRef.current.getState().processesSlice.draftPasteState?.pasteShouldMove).toBe(false);
  });

  it('Click on button "Cut" should store selected resources in clipboard and "pasteShouldMove: true" in global-state', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    // select some resources and copy them
    const res1 = await screen.findByRole('row', { name: /aa test folder/i });
    const res2 = await screen.findByRole('row', { name: /testfile1.txt/i });
    fireEvent.click(res1);
    fireEvent.click(res2, { ctrlKey: true });
    const copyButton = await screen.findByRole('button', { name: /Cut/i });
    fireEvent.click(copyButton);

    // assert clipboard
    const resourcesInClipboard = nativeHostRef.current.clipboard.readResources();
    expect(resourcesInClipboard).toHaveLength(2);
    const actualResource1 = uriHelper.extractNameAndExtension(resourcesInClipboard[0]);
    const expectedResource1: ResourceUIDescription = {
      resourceName: 'aa test folder',
    };
    expect(actualResource1).toMatchObject(expectedResource1);
    const actualResource2 = uriHelper.extractNameAndExtension(resourcesInClipboard[1]);
    const expectedResource2: ResourceUIDescription = {
      resourceName: 'testfile1',
      extension: '.txt',
    };
    expect(actualResource2).toMatchObject(expectedResource2);

    // assert that "pasteShouldMove" was set to "false" in global state
    expect(storeRef.current.getState().processesSlice.draftPasteState).not.toBeUndefined();
    expect(storeRef.current.getState().processesSlice.draftPasteState?.pasteShouldMove).toBe(true);
  });

  it('CTRL+X should trigger "Cut" action (therefore, store selected resources in clipboard and "pasteShouldMove: true" in global-state)', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    // select some resources and copy them
    const res1 = await screen.findByRole('row', { name: /aa test folder/i });
    const res2 = await screen.findByRole('row', { name: /testfile1.txt/i });
    fireEvent.click(res1);
    fireEvent.click(res2, { ctrlKey: true });
    fireEvent.keyDown(res1, { ctrlKey: true, key: KEY.X });

    // assert clipboard
    const resourcesInClipboard = nativeHostRef.current.clipboard.readResources();
    expect(resourcesInClipboard).toHaveLength(2);
    const actualResource1 = uriHelper.extractNameAndExtension(resourcesInClipboard[0]);
    const expectedResource1: ResourceUIDescription = {
      resourceName: 'aa test folder',
    };
    expect(actualResource1).toMatchObject(expectedResource1);
    const actualResource2 = uriHelper.extractNameAndExtension(resourcesInClipboard[1]);
    const expectedResource2: ResourceUIDescription = {
      resourceName: 'testfile1',
      extension: '.txt',
    };
    expect(actualResource2).toMatchObject(expectedResource2);

    // assert that "pasteShouldMove" was set to "false" in global state
    expect(storeRef.current.getState().processesSlice.draftPasteState).not.toBeUndefined();
    expect(storeRef.current.getState().processesSlice.draftPasteState?.pasteShouldMove).toBe(true);
  });
});
