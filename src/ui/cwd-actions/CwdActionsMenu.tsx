import * as React from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { KEYS, MOUSE_BUTTONS } from '@app/ui/constants';
import { useExplorerId } from '@app/ui/Explorer.context';
import { useWindowEvent } from '@app/ui/utils/react.util';
import { useCwd, useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory, revealCwdInOSExplorer } from '@app/operations/explorer.operations';
import { ChangeCwd } from '@app/ui/cwd-actions/ChangeCwd';

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
    await changeDirectory(explorerId, URI.joinPath(URI.from(cwd), '..').path);
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
        onClick={() => {
          revealCwdInOSExplorer(explorerId);
          onClose();
        }}
      >
        <ListItemIcon>
          <FolderOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Reveal in OS File Explorer</ListItemText>
      </MenuItem>

      <ChangeCwd
        initialCwdValue={URI.from(cwd).fsPath}
        onSubmit={async (newDir) => {
          await changeDirectory(explorerId, newDir);
          onClose();
        }}
      />
    </Menu>
  );
};
