import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import * as React from 'react';

import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory, revealCwdInOSExplorer } from '@app/operations/explorer.operations';
import {
  Icon,
  Paper,
  Popover,
  usePopover,
  Item,
  MenuPopup,
  MenuInstance,
} from '@app/ui/components-library';
import { ChangeCwdForm } from '@app/ui/cwd-breadcrumbs/ChangeCwdForm';

enum CWD_ACTIONS_MENU_ACTION {
  REVEAL_IN_OS_FILE_EXPLORER = 'reveal-in-os-file-explorer',
  CHANGE_CWD = 'change-cwd',
}

type CwdActionsMenuProps = {
  explorerId: string;
  menuInstance: MenuInstance;
};

export const CwdActionsMenu: React.FC<CwdActionsMenuProps> = ({ explorerId, menuInstance }) => {
  const cwd = useCwd(explorerId);

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
      {menuInstance.state.isOpen && (
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
            <Icon Component={FolderOutlinedIcon} />
            Reveal in OS File Explorer
          </Item>
          <Item
            key={CWD_ACTIONS_MENU_ACTION.CHANGE_CWD}
            textValue="Change Directory"
            itemRef={changeCwdLIRef}
            itemDomProps={changeCwdTriggerProps}
            onAction={() => changeCwdPopoverInstance.state.open()}
          >
            <Icon Component={ArrowRightAltOutlinedIcon} />
            Change Directory
          </Item>
        </MenuPopup>
      )}

      {changeCwdPopoverInstance.state.isOpen && (
        <Popover popoverInstance={changeCwdPopoverInstance}>
          <Paper>
            <ChangeCwdForm
              initialCwdValue={formatter.resourcePath(cwd)}
              onSubmit={async (newDir) => {
                await changeDirectory(explorerId, uriHelper.parseUri(cwd.scheme, newDir));
                changeCwdPopoverInstance.state.close();
                menuInstance.state.close();
              }}
            />
          </Paper>
        </Popover>
      )}
    </>
  );
};
