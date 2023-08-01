import * as React from 'react';

import { errorsUtil } from '#pkg/base/utils/errors.util';
import { formatter } from '#pkg/base/utils/formatter.util';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import { useCwd } from '#pkg/global-state/slices/explorers.hooks';
import {
  changeCwd,
  copyCwdIntoClipboard,
  revealCwdInOSExplorer,
} from '#pkg/operations/explorer.operations';
import { APP_MESSAGE_SEVERITY, usePushAppMessage } from '#pkg/ui/AppMessagesContext';
import type { MenuInstance } from '#pkg/ui/components-library';
import {
  Paper,
  Popover,
  usePopover,
  Item,
  MenuPopup,
  ArrowRightAltOutlinedIcon,
  FolderOutlinedIcon,
  ContentCopyOutlinedIcon,
} from '#pkg/ui/components-library';
import { ChangeCwdForm } from '#pkg/ui/cwd-breadcrumbs/ChangeCwdForm';

enum CWD_ACTIONS_MENU_ACTION {
  REVEAL_IN_OS_FILE_EXPLORER = 'reveal-in-os-file-explorer',
  COPY_CWD = 'copy-cwd',
  CHANGE_CWD = 'change-cwd',
}

type CwdActionsMenuProps = {
  explorerId: string;
  menuInstance: MenuInstance;
};

export const CwdActionsMenu: React.FC<CwdActionsMenuProps> = ({ explorerId, menuInstance }) => {
  const cwd = useCwd(explorerId);
  const pushAppMessage = usePushAppMessage();

  const changeCwdLIRef = React.useRef<HTMLLIElement>(null);

  const { triggerProps: changeCwdTriggerProps, popoverInstance: changeCwdPopoverInstance } =
    usePopover({
      triggerRef: changeCwdLIRef,
      popover: {
        placement: 'right top',
      },
    });

  return (
    <>
      <MenuPopup
        aria-label="Actions for the current working directory"
        menuPopupInstance={menuInstance}
        closeOnSelect={false}
      >
        <Item
          key={CWD_ACTIONS_MENU_ACTION.REVEAL_IN_OS_FILE_EXPLORER}
          textValue="Reveal in OS File Explorer"
          onAction={async () => {
            await revealCwdInOSExplorer(explorerId);
            menuInstance.state.close();
          }}
        >
          <FolderOutlinedIcon />
          Reveal in OS File Explorer
        </Item>
        <Item
          key={CWD_ACTIONS_MENU_ACTION.COPY_CWD}
          textValue="Copy Directory Path"
          onAction={() => {
            copyCwdIntoClipboard(explorerId);
            menuInstance.state.close();
          }}
        >
          <ContentCopyOutlinedIcon />
          Copy Directory Path
        </Item>
        <Item
          key={CWD_ACTIONS_MENU_ACTION.CHANGE_CWD}
          textValue="Change Directory"
          itemRef={changeCwdLIRef}
          itemDomProps={changeCwdTriggerProps}
          onAction={() => changeCwdPopoverInstance.state.open()}
        >
          <ArrowRightAltOutlinedIcon />
          Change Directory
        </Item>
      </MenuPopup>

      <Popover popoverInstance={changeCwdPopoverInstance}>
        <Paper>
          <ChangeCwdForm
            isOpen={changeCwdPopoverInstance.state.isOpen}
            initialCwdValue={formatter.resourcePath(cwd)}
            onSubmit={async (newDir) => {
              try {
                await changeCwd({
                  explorerId,
                  newCwd: uriHelper.parseUri(cwd.scheme, newDir),
                  keepExistingCwdSegments: false,
                });
                changeCwdPopoverInstance.state.close();
                menuInstance.state.close();
              } catch (error) {
                const errorMessage =
                  errorsUtil.computeVerboseMessageFromError(error) ?? 'Unknown error';

                pushAppMessage({
                  severity: APP_MESSAGE_SEVERITY.ERROR,
                  label: `Error while changing current working directory`,
                  detail: errorMessage,
                });
              }
            }}
          />
        </Paper>
      </Popover>
    </>
  );
};
