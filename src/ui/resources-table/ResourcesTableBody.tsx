import { Box, Chip, TextField } from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { useNativeIconDataURL } from '@app/global-cache/resource-icons';
import { changeDirectory } from '@app/operations/explorer.operations';
import { nativeHostRef } from '@app/operations/global-modules';
import {
  openFiles,
  removeTagsFromResources,
  renameResource,
} from '@app/operations/resource.operations';
import { KEYS } from '@app/ui/constants';
import { Cell } from '@app/ui/elements/DataTable/Cell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { TextBox } from '@app/ui/elements/TextBox';
import {
  useChangeSelectionByClick,
  useExplorerId,
  useResourcesToShow,
  useKeyOfResourceToRename,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
} from '@app/ui/explorer-context';
import { useThemeResourceIconClasses } from '@app/ui/hooks/resources.hooks';
import { Stack } from '@app/ui/layouts/Stack';

const USE_NATIVE_ICON_FOR_REGEX = /(?:exe|ico|dll)/i;

export const ResourcesTableBody: React.FC = () => {
  const resourcesToShow = useResourcesToShow();

  return (
    <>
      {resourcesToShow.map((resourceForRow, idxOfResourceForRow) => (
        <ResourcesTableRow
          key={resourceForRow.key}
          resourceForRow={resourceForRow}
          idxOfResourceForRow={idxOfResourceForRow}
        />
      ))}
    </>
  );
};

type ResourcesTableRowProps = {
  resourceForRow: ResourceForUI;
  idxOfResourceForRow: number;
};

export const ResourcesTableRow: React.FC<ResourcesTableRowProps> = ({
  resourceForRow,
  idxOfResourceForRow,
}) => {
  const explorerId = useExplorerId();
  const selectedShownResources = useSelectedShownResources();
  const changeSelectionByClick = useChangeSelectionByClick();
  const keyOfResourceToRename = useKeyOfResourceToRename();
  const setKeyOfResourceToRename = useSetKeyOfResourceToRename();

  const themeResourceIconClasses = useThemeResourceIconClasses(resourceForRow);

  const fsPath = URI.from(resourceForRow.uri).fsPath;
  const extension = resourceForRow.extension;
  const nativeIconDataURL = useNativeIconDataURL(
    { fsPath },
    {
      enabled:
        check.isNonEmptyString(fsPath) &&
        check.isNonEmptyString(extension) &&
        USE_NATIVE_ICON_FOR_REGEX.test(extension),
    },
  );

  async function openResource(resource: ResourceForUI) {
    if (resource.resourceType === RESOURCE_TYPE.DIRECTORY) {
      await changeDirectory(explorerId, URI.from(resource.uri));
    } else {
      await openFiles([resource.uri]);
    }
  }

  async function renameResourceHandler(resourceToRename: ResourceForUI, newName: string) {
    await renameResource(resourceToRename.uri, newName);
    setKeyOfResourceToRename(undefined);
  }

  function abortRename() {
    setKeyOfResourceToRename(undefined);
  }

  const resourceIsSelected = !!selectedShownResources.find(
    (resource) => resource.key === resourceForRow.key,
  );
  const renameForResourceIsActive = keyOfResourceToRename === resourceForRow.key;

  return (
    <Row
      key={resourceForRow.key}
      data-window-keydownhandlers-enabled="true"
      draggable={!renameForResourceIsActive}
      onDragStart={(e) => {
        e.preventDefault();
        nativeHostRef.current.webContents.startNativeFileDnD(resourceForRow.uri);
      }}
      onClick={(e) => changeSelectionByClick(e, resourceForRow, idxOfResourceForRow)}
      onDoubleClick={() => openResource(resourceForRow)}
      selected={resourceIsSelected}
    >
      <Cell>
        <RowContent>
          <Stack spacing={0} sx={{ width: '100%' }}>
            <IconWrapper className={nativeIconDataURL ? undefined : themeResourceIconClasses}>
              {nativeIconDataURL && (
                <img
                  src={nativeIconDataURL}
                  alt="icon for resource"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              )}
            </IconWrapper>
            {renameForResourceIsActive ? (
              <RenameInput
                resource={resourceForRow}
                onSubmit={(newName) => renameResourceHandler(resourceForRow, newName)}
                abortRename={abortRename}
              />
            ) : (
              <ResourceNameFormatted fontSize="sm">
                {formatter.resourceBasename(resourceForRow)}
              </ResourceNameFormatted>
            )}
          </Stack>

          {resourceForRow.tags.map((tag) => (
            <Chip
              key={tag.id}
              style={{ backgroundColor: tag.colorHex }}
              variant="outlined"
              size="small"
              label={tag.name}
              onDelete={() => removeTagsFromResources([resourceForRow.uri], [tag.id])}
            />
          ))}
        </RowContent>
      </Cell>
      <Cell>
        {resourceForRow.resourceType === RESOURCE_TYPE.FILE &&
          resourceForRow.size !== undefined &&
          formatter.bytes(resourceForRow.size)}
      </Cell>
      <Cell>{resourceForRow.mtime !== undefined && formatter.date(resourceForRow.mtime)}</Cell>
    </Row>
  );
};

type RenameInputProps = {
  resource: ResourceForUI;
  onSubmit: (newName: string) => void;
  abortRename: () => void;
};

const RenameInput: React.FC<RenameInputProps> = ({ resource, onSubmit, abortRename }) => {
  const [value, setValue] = React.useState(formatter.resourceBasename(resource));

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <ResourceNameTextField
        fullWidth
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          abortRename();
        }}
        onKeyDown={(e) => {
          if (e.key === KEYS.ESC) {
            abortRename();
          }
        }}
      />
    </form>
  );
};

const RowContent = styled(Stack)`
  height: ${(props) => props.theme.sizes.resourceRow.height};
`;

const ResourceNameFormattedSpacingFactor = 0.5;

const ResourceNameTextField = styled(TextField)`
  & .MuiInputBase-root {
    font-size: ${12 / 16}rem;
    margin-left: ${(props) => props.theme.spacing(ResourceNameFormattedSpacingFactor)};
  }

  & .MuiInputBase-input {
    padding-left: ${(props) => props.theme.spacing(ResourceNameFormattedSpacingFactor)};
    padding-top: 5px;
    padding-bottom: 4px;
  }
`;

const ResourceNameFormatted = styled(TextBox)`
  padding-left: ${(props) => props.theme.spacing(ResourceNameFormattedSpacingFactor * 2)};
`;

const iconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  max-width: 24px;
  height: 24px;
  max-height: 24px;
`;

const IconWrapper = styled(Box)`
  ${iconStyles}

  ::before {
    ${iconStyles}

    background-size: 24px 24px;
    background-repeat: no-repeat;
    -webkit-font-smoothing: antialiased;
  }
`;
