import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd, useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory, revealCwdInOSExplorer } from '@app/operations/explorer.operations';
import { KEYS, MOUSE_BUTTONS } from '@app/ui/constants';
import { ChangeCwd } from '@app/ui/cwd-breadcrumbs/ChangeCwd';
import { useExplorerId } from '@app/ui/explorer-context';
import { useWindowEvent } from '@app/ui/utils/react.util';

type CwdActionsMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

export const CwdActionsMenu: React.FC<CwdActionsMenuProps> = (props) => {
  const explorerId = useExplorerId();
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  if (explorerId !== focusedExplorerId) {
    return null;
  }

  return <CwdActionsMenuImpl {...props} />;
};

const CwdActionsMenuImpl: React.FC<CwdActionsMenuProps> = ({ anchorEl, onClose }) => {
  const explorerId = useExplorerId();
  const cwd = useCwd(explorerId);

  async function navigateUp() {
    await changeDirectory(explorerId, URI.joinPath(URI.from(cwd), '..'));
  }

  useWindowEvent('keydown', [
    { condition: (e) => e.altKey && e.key === KEYS.ARROW_LEFT, handler: navigateUp },
  ]);

  /*
   * "auxclick" event is fired when the "back" button on a mouse (e.g. Logitech MX Master 2) is clicked.
   */
  useWindowEvent('auxclick', [
    { condition: (e) => e.button === MOUSE_BUTTONS.BACK, handler: navigateUp },
  ]);

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
        initialCwdValue={formatter.folderPath(cwd)}
        onSubmit={async (newDir) => {
          await changeDirectory(explorerId, uriHelper.parseUri(cwd.scheme, newDir));
          onClose();
        }}
      />
    </Menu>
  );
};
