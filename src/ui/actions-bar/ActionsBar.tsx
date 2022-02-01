import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { assertIsUnreachable } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useDraftPasteState } from '@app/global-state/slices/processes.hooks';
import { CreateFolder } from '@app/ui/actions-bar/CreateFolder';
import { FilterInput } from '@app/ui/actions-bar/FilterInput';
import {
  Box,
  Button,
  ButtonHandle,
  ContentCopyOutlinedIcon,
  ContentCutOutlinedIcon,
  ContentPasteOutlinedIcon,
  DeleteOutlinedIcon,
  Divider,
  EditOutlinedIcon,
  LaunchOutlinedIcon,
  Tooltip,
  useTooltip,
  ViewComfyIcon,
} from '@app/ui/components-library';
import { PRINTED_KEY } from '@app/ui/constants';
import {
  useSelectedShownResources,
  useCopySelectedResources,
  useCutSelectedResources,
  useOpenSelectedResources,
  usePasteResourcesIntoExplorer,
  useScheduleDeleteSelectedResources,
  useTriggerRenameForSelectedResources,
  useRegisterCwdSegmentShortcuts,
  useSetActiveResourcesView,
  useSelectAll,
} from '@app/ui/cwd-segment-context';
import { useClipboardResources } from '@app/ui/hooks/clipboard-resources.hooks';

export const ActionsBar: React.FC = () => {
  const draftPasteState = useDraftPasteState();

  const selectedShownResources = useSelectedShownResources();

  const selectAll = useSelectAll();
  const setActiveResourcesView = useSetActiveResourcesView();
  const openSelectedResources = useOpenSelectedResources();
  const copySelectedResources = useCopySelectedResources();
  const cutSelectedResources = useCutSelectedResources();
  const pasteResourcesIntoExplorer = usePasteResourcesIntoExplorer();
  const triggerRenameForSelectedResources = useTriggerRenameForSelectedResources();
  const scheduleDeleteSelectedResources = useScheduleDeleteSelectedResources();

  const setActiveResourcesViewButtonHandleRef = React.useRef<ButtonHandle>(null);
  const openButtonHandleRef = React.useRef<ButtonHandle>(null);
  const copyButtonHandleRef = React.useRef<ButtonHandle>(null);
  const cutButtonHandleRef = React.useRef<ButtonHandle>(null);
  const pasteButtonHandleRef = React.useRef<ButtonHandle>(null);
  const triggerRenameButtonHandleRef = React.useRef<ButtonHandle>(null);
  const scheduleDeleteButtonHandleRef = React.useRef<ButtonHandle>(null);
  const triggerCreateNewFolderButtonHandleRef = React.useRef<ButtonHandle>(null);

  const registerShortcutsResult = useRegisterCwdSegmentShortcuts({
    selectAllShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.A,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: selectAll,
    },
    setActiveResourcesViewShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.T,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(setActiveResourcesViewButtonHandleRef.current);
        setActiveResourcesViewButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    openShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.ENTER,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(openButtonHandleRef.current);
        openButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    copyShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.C,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(copyButtonHandleRef.current);
        copyButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    cutShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.X,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(cutButtonHandleRef.current);
        cutButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    pasteShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.V,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(pasteButtonHandleRef.current);
        pasteButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    triggerRenameShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.R,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(triggerRenameButtonHandleRef.current);
        triggerRenameButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    scheduleDeleteShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.DELETE,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(scheduleDeleteButtonHandleRef.current);
        scheduleDeleteButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    triggerCreateNewFolderShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.N,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(triggerCreateNewFolderButtonHandleRef.current);
        triggerCreateNewFolderButtonHandleRef.current.triggerSyntheticPress();
      },
    },
  });

  const singleResourceActionsDisabled = selectedShownResources.length !== 1;
  const multipleResourcesActionsDisabled = selectedShownResources.length < 1;

  return (
    <ActionBarContainer role="menubar">
      <Box style={{ alignSelf: 'flex-end' }}>
        <FilterInput />
      </Box>

      <Divider orientation="vertical" />

      <ActionBarButtons>
        <Button
          handleRef={openButtonHandleRef}
          onPress={openSelectedResources}
          isDisabled={singleResourceActionsDisabled}
          startIcon={<LaunchOutlinedIcon />}
          endIcon={!singleResourceActionsDisabled && registerShortcutsResult.openShortcut?.icon}
          enableLayoutAnimation
        >
          Open
        </Button>
        <Button
          handleRef={copyButtonHandleRef}
          onPress={copySelectedResources}
          isDisabled={multipleResourcesActionsDisabled}
          startIcon={<ContentCopyOutlinedIcon />}
          endIcon={!multipleResourcesActionsDisabled && registerShortcutsResult.copyShortcut?.icon}
          enableLayoutAnimation
        >
          Copy
        </Button>
        <Button
          handleRef={cutButtonHandleRef}
          onPress={cutSelectedResources}
          isDisabled={multipleResourcesActionsDisabled}
          startIcon={<ContentCutOutlinedIcon />}
          endIcon={!multipleResourcesActionsDisabled && registerShortcutsResult.cutShortcut?.icon}
          enableLayoutAnimation
        >
          Cut
        </Button>
        <Button
          handleRef={pasteButtonHandleRef}
          variant={draftPasteState === undefined ? undefined : 'contained'}
          onPress={pasteResourcesIntoExplorer}
          isDisabled={draftPasteState === undefined}
          startIcon={<ContentPasteOutlinedIcon />}
          endIcon={draftPasteState !== undefined && registerShortcutsResult.pasteShortcut?.icon}
          enableLayoutAnimation
        >
          Paste
          <PasteInfoBadge />
        </Button>
        <Button
          handleRef={triggerRenameButtonHandleRef}
          onPress={triggerRenameForSelectedResources}
          isDisabled={singleResourceActionsDisabled}
          startIcon={<EditOutlinedIcon />}
          endIcon={
            !singleResourceActionsDisabled && registerShortcutsResult.triggerRenameShortcut?.icon
          }
          enableLayoutAnimation
        >
          Rename
        </Button>
        <Button
          handleRef={scheduleDeleteButtonHandleRef}
          onPress={scheduleDeleteSelectedResources}
          isDisabled={multipleResourcesActionsDisabled}
          startIcon={<DeleteOutlinedIcon />}
          endIcon={
            !multipleResourcesActionsDisabled &&
            registerShortcutsResult.scheduleDeleteShortcut?.icon
          }
          enableLayoutAnimation
        >
          Delete
        </Button>
        <CreateFolder
          buttonHandleRef={triggerCreateNewFolderButtonHandleRef}
          buttonEndIcon={registerShortcutsResult.triggerCreateNewFolderShortcut?.icon}
        />
        <Button
          handleRef={setActiveResourcesViewButtonHandleRef}
          onPress={() =>
            setActiveResourcesView((currentValue) => {
              if (currentValue === undefined || currentValue === 'table') {
                return 'gallery';
              } else if (currentValue === 'gallery') {
                return 'table';
              } else {
                assertIsUnreachable(currentValue);
              }
            })
          }
          startIcon={<ViewComfyIcon />}
          endIcon={registerShortcutsResult.setActiveResourcesViewShortcut?.icon}
          enableLayoutAnimation
        >
          Toggle View
        </Button>
      </ActionBarButtons>
    </ActionBarContainer>
  );
};

const ActionBarContainer = styled(Box)`
  display: flex;
  gap: var(--spacing-2);
`;

const ActionBarButtons = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: wrap;
`;

const PasteInfoBadge: React.FC = () => {
  const clipboardResources = useClipboardResources();
  const draftPasteState = useDraftPasteState();

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const { triggerProps, tooltipInstance } = useTooltip({
    triggerRef,
    tooltip: {
      offset: { mainAxis: 8 },
    },
  });

  if (draftPasteState === undefined || clipboardResources.length === 0) {
    return null;
  }

  return (
    <>
      <StyledBadge ref={triggerRef} {...triggerProps}>
        {draftPasteState.pasteShouldMove ? <ContentCutOutlinedIcon /> : <ContentCopyOutlinedIcon />}
      </StyledBadge>

      <Tooltip tooltipInstance={tooltipInstance}>
        <ClipboardResourcesList>
          {clipboardResources.map((resource) => (
            <Box key={uriHelper.getComparisonKey(resource)}>{formatter.resourcePath(resource)}</Box>
          ))}
        </ClipboardResourcesList>
      </Tooltip>
    </>
  );
};

const StyledBadge = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--color-fg-0);
  background-color: var(--color-bg-1);
  border-radius: 50%;
  padding: 5px;
  /* compensate vertical padding so that the container does not grow because of the StyledBadge */
  margin-block: -5px;
`;

const ClipboardResourcesList = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2);

  word-break: break-all;
`;
