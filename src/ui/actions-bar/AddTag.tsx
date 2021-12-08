import * as React from 'react';
import styled from 'styled-components';

import { arrays } from '@app/base/utils/arrays.util';
import { check } from '@app/base/utils/assert.util';
import { AvailableTagIds, Tag } from '@app/domain/types';
import { commonStyles } from '@app/ui/Common.styles';
import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  useTheme,
} from '@app/ui/components-library';

// derived from https://material-ui.com/components/autocomplete/#creatable
type WithInput<T> = T & {
  inputValue?: string;
};

const autocompleteDefaultFilter = createFilterOptions<WithInput<Tag>>();

type AddTagProps = {
  options: Tag[];
  onValueCreated: (value: Omit<Tag, 'id'>) => Tag;
  onValueChosen: (value: Tag) => void;
  disabled?: boolean;
};

export const AddTag: React.FC<AddTagProps> = ({
  options,
  onValueCreated,
  onValueChosen,
  disabled,
}) => {
  const { availableTagColors } = useTheme();
  const defaultTag: WithInput<Omit<Tag, 'id'>> = {
    inputValue: '',
    name: '',
    colorId: 'tagColor1',
  };

  const [open, toggleOpen] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState(defaultTag);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (check.isNonEmptyString(dialogValue.name)) {
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
      <TagAutocomplete
        disabled={disabled}
        value={null as WithInput<Tag> | null}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            toggleOpen(true);
            setDialogValue({
              name: newValue,
              colorId: 'tagColor1',
            });
          } else if (newValue?.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              colorId: 'tagColor1',
            });
          } else if (newValue !== null) {
            onValueChosen(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = autocompleteDefaultFilter(options, params);

          if (check.isNonEmptyString(params.inputValue)) {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
              colorId: 'tagColor1',
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
          <TagAutocompleteEntry {...props}>
            {check.isNullishOrEmptyString(option.inputValue) && (
              <ColorButton
                variant="contained"
                style={{ backgroundColor: availableTagColors[option.colorId] }}
              />
            )}
            <OptionLabel>{option.name}</OptionLabel>
          </TagAutocompleteEntry>
        )}
        renderInput={(params) => <TextField {...params} label="Add tag" />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new tag</DialogTitle>
          <DialogContent sx={{ overflowY: 'initial' }}>
            <NewTagDialogContent>
              <ColorButtonAndTagName>
                <ColorButton
                  variant="contained"
                  style={{ backgroundColor: availableTagColors[dialogValue.colorId] }}
                />
                <TagNameInput
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
              </ColorButtonAndTagName>

              <AvailableColorsContainer variant="outlined">
                {arrays
                  .partitionArray(Object.entries(availableTagColors), { itemsPerPartition: 5 })
                  .map((partition, idx) => (
                    <AvailableColorsRow key={idx}>
                      {partition.map((color) => {
                        const [colorId, colorHex] = color as [AvailableTagIds, string];
                        const isSelected = dialogValue.colorId === colorId;

                        return (
                          <ColorButton
                            key={colorId}
                            style={{
                              backgroundColor: colorHex,
                              opacity: isSelected ? '0.35' : undefined,
                            }}
                            variant={isSelected ? 'outlined' : 'contained'}
                            onPress={() => setDialogValue({ ...dialogValue, colorId })}
                          />
                        );
                      })}
                    </AvailableColorsRow>
                  ))}
              </AvailableColorsContainer>
            </NewTagDialogContent>
          </DialogContent>
          <DialogActions>
            <Button variant="text" onPress={handleClose}>
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

const TagAutocomplete: typeof Autocomplete = styled(Autocomplete)`
  min-width: 150px;
`;

const TagAutocompleteEntry = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing()};
`;

const OptionLabel = styled(Box)`
  ${commonStyles.layout.flex.shrinkAndFitHorizontal}
`;

const NewTagDialogContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--spacing-2);
`;

const ColorButtonAndTagName = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const AvailableColorsContainer = styled(Paper)`
  padding: var(--spacing-2);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2);
`;

const AvailableColorsRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const ColorButton = styled(Button)`
  min-height: 0;
  min-width: 0;
  padding: 0;
  height: 24px;
  width: 24px;
`;

const TagNameInput = styled(TextField)`
  width: 170px;
`;
