import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import { Button, ListItemIcon, ListItemText, MenuItem, Popover } from '@mui/material';
import * as React from 'react';

import { check } from '@app/base/utils/assert.util';
import { TextField } from '@app/ui/elements/TextField';
import { Stack } from '@app/ui/layouts/Stack';

type ChangeCwdProps = {
  initialCwdValue: string;
  onSubmit: (folderName: string) => void | Promise<void>;
};

export const ChangeCwd: React.FC<ChangeCwdProps> = ({ initialCwdValue, onSubmit }) => {
  const [cwdValue, setCwdValue] = React.useState(initialCwdValue);
  const [changeCwdAnchorEl, setChangeCwdAnchorEl] = React.useState<HTMLElement | null>(null);

  React.useEffect(
    function resetValueOnPopoverClose() {
      if (changeCwdAnchorEl === null) {
        setCwdValue(initialCwdValue);
      }
    },
    [changeCwdAnchorEl, initialCwdValue],
  );

  async function handleSubmit() {
    if (check.isEmptyString(cwdValue)) {
      return;
    }

    await onSubmit(cwdValue);
    setChangeCwdAnchorEl(null);
  }

  return (
    <>
      <MenuItem onClick={(e) => setChangeCwdAnchorEl(e.currentTarget)}>
        <ListItemIcon>
          <ArrowRightAltOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Change Directory</ListItemText>
      </MenuItem>

      <Popover
        open={changeCwdAnchorEl !== null}
        anchorEl={changeCwdAnchorEl}
        onClose={() => setChangeCwdAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        BackdropProps={{ invisible: false }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          <Stack
            direction="column"
            alignItems="stretch"
            sx={{ padding: 1.5, width: (theme) => theme.sizes.card.md }}
          >
            <TextField
              autoFocus
              label="Directory"
              value={cwdValue}
              onChange={(event) => setCwdValue(event.target.value)}
            />
            <Stack justifyContent="end">
              <Button
                variant={check.isEmptyString(cwdValue) ? undefined : 'contained'}
                type="submit"
                disabled={check.isEmptyString(cwdValue)}
              >
                Change Directory
              </Button>
            </Stack>
          </Stack>
        </form>
      </Popover>
    </>
  );
};
