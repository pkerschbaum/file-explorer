import * as React from 'react';
import {
  Autocomplete,
  Button,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  useTheme,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { css } from '@emotion/react';

import { styles } from '@app/ui/explorer-actions/AddTag.styles';
import { commonStyles } from '@app/ui/Common.styles';
import { Stack } from '@app/ui/layouts/Stack';
import { Tag } from '@app/platform/file-types';
import { strings } from '@app/base/utils/strings.util';
import { arrays } from '@app/base/utils/arrays.util';

// derived from https://material-ui.com/components/autocomplete/#creatable
type WithInput<T> = T & {
  inputValue?: string;
};

const autocompleteDefaultFilter = createFilterOptions<WithInput<Tag>>();

type AddTagProps = {
  options: Tag[];
  onValueCreated: (value: Omit<Tag, 'id'>) => Tag;
  onValueChosen: (value: Tag) => void;
  onValueDeleted: (value: Tag) => void;
  disabled?: boolean;
};

export const AddTag: React.FC<AddTagProps> = ({
  options,
  onValueCreated,
  onValueChosen,
  onValueDeleted,
  disabled,
}) => {
  const { availableTagColors } = useTheme();
  const defaultTag = {
    inputValue: '',
    name: '',
    colorHex: availableTagColors[0],
    id: 'add-tag-action',
  };

  const [open, toggleOpen] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState<WithInput<Omit<Tag, 'id'>>>(defaultTag);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!strings.isNullishOrEmpty(dialogValue.name)) {
      const tag = onValueCreated(dialogValue);
      onValueChosen(tag);
    }
    handleClose();
  }

  function handleClose() {
    setDialogValue(defaultTag);
    toggleOpen(false);
  }

  return (
    <React.Fragment>
      <Autocomplete
        css={styles.tagAutocomplete}
        disabled={disabled}
        value={null as WithInput<Tag> | null}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            toggleOpen(true);
            setDialogValue({
              name: newValue,
              colorHex: availableTagColors[0],
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              colorHex: availableTagColors[0],
            });
          } else if (newValue !== null) {
            onValueChosen(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = autocompleteDefaultFilter(options, params);

          if (!strings.isNullishOrEmpty(params.inputValue)) {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
              colorHex: availableTagColors[0],
              id: 'add-tag-action',
            });
          }

          return filtered;
        }}
        options={options as WithInput<Tag>[]}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        freeSolo
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>
            <Stack css={commonStyles.fullWidth}>
              {strings.isNullishOrEmpty(option.inputValue) && (
                <Button
                  css={styles.colorButton}
                  disableElevation
                  variant="contained"
                  style={{ backgroundColor: option.colorHex }}
                />
              )}
              <span css={commonStyles.flex.shrinkAndFitHorizontal}>{option.name}</span>
              <IconButton onClick={() => onValueDeleted(option)}>
                <CancelIcon />
              </IconButton>
            </Stack>
          </li>
        )}
        renderInput={(params) => <TextField {...params} label="Add tag" />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new tag</DialogTitle>
          <DialogContent
            css={css`
              overflow-y: initial;
            `}
          >
            <Stack direction="column" alignItems="start">
              <Stack>
                <Button
                  css={styles.colorButton}
                  disableElevation
                  variant="contained"
                  style={{ backgroundColor: dialogValue.colorHex }}
                />
                <TextField
                  css={styles.tagNameInput}
                  autoFocus
                  label="Name of tag"
                  value={dialogValue.name}
                  onChange={(event) =>
                    setDialogValue({
                      ...dialogValue,
                      name: event.target.value.trim(),
                    })
                  }
                />
              </Stack>
              <Paper
                variant="outlined"
                css={(theme) =>
                  css`
                    padding: ${theme.spacing()};
                  `
                }
              >
                <Stack direction="column" alignItems="start">
                  {arrays
                    .partitionArray(availableTagColors, { itemsPerPartition: 5 })
                    .map((partition, idx) => (
                      <Stack key={idx}>
                        {partition.map((colorHex) => {
                          const isSelected = dialogValue.colorHex === colorHex;
                          return (
                            <Button
                              key={colorHex}
                              css={styles.colorButton}
                              style={{
                                backgroundColor: colorHex,
                                opacity: isSelected ? '0.35' : undefined,
                              }}
                              disableRipple
                              disableElevation
                              variant={isSelected ? 'outlined' : 'contained'}
                              onClick={() => setDialogValue({ ...dialogValue, colorHex })}
                            />
                          );
                        })}
                      </Stack>
                    ))}
                </Stack>
              </Paper>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="text" type="submit">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};
