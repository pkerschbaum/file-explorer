import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import * as React from 'react';

import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory, revealCwdInOSExplorer } from '@app/operations/explorer.operations';
import { ChangeCwd } from '@app/ui/cwd-breadcrumbs/ChangeCwd';

type CwdActionsMenuProps = {
  explorerId: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

export const CwdActionsMenu: React.FC<CwdActionsMenuProps> = ({
  explorerId,
  anchorEl,
  onClose,
}) => {
  const cwd = useCwd(explorerId);

  return (
    <Menu open={anchorEl !== null} anchorEl={anchorEl} onClose={onClose}>
      <MenuItem
        onClick={async () => {
          await revealCwdInOSExplorer(explorerId);
          onClose();
        }}
      >
        <ListItemIcon>
          <FolderOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Reveal in OS File Explorer</ListItemText>
      </MenuItem>

      <ChangeCwd
        initialCwdValue={formatter.resourcePath(cwd)}
        onSubmit={async (newDir) => {
          await changeDirectory(explorerId, uriHelper.parseUri(cwd.scheme, newDir));
          onClose();
        }}
      />
    </Menu>
  );
};
