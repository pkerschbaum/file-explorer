import { Box, Button, Chip } from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { useNativeIconDataURL } from '@app/global-cache/resource-icons';
import { changeDirectory } from '@app/operations/explorer.operations';
import { nativeHostRef } from '@app/operations/global-modules';
import { openFiles, removeTagsFromResources } from '@app/operations/resource.operations';
import { KEY } from '@app/ui/constants';
import { Cell } from '@app/ui/elements/DataTable/Cell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { TextField } from '@app/ui/elements/TextField';
import {
  useChangeSelectionByClick,
  useExplorerId,
  useResourcesToShow,
  useKeyOfResourceToRename,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
  useRenameResource,
} from '@app/ui/explorer-context';
import { useThemeResourceIconClasses } from '@app/ui/hooks/resources.hooks';
import { Stack } from '@app/ui/layouts/Stack';

const USE_NATIVE_ICON_FOR_REGEX = /(?:exe|ico|dll)/i;

export const ResourcesTableBody: React.FC = () => {
  const resourcesToShow = useResourcesToShow();

  return (
    <>
      {resourcesToShow.map((resourceForRow, idxOfResourceForRow) => (
        <ResourceRow
          key={resourceForRow.key}
          resourceForRow={resourceForRow}
          idxOfResourceForRow={idxOfResourceForRow}
        />
      ))}
    </>
  );
};

type ResourceRowProps = {
  resourceForRow: ResourceForUI;
  idxOfResourceForRow: number;
};

const ResourceRow: React.FC<ResourceRowProps> = ({ resourceForRow, idxOfResourceForRow }) => {
  const explorerId = useExplorerId();
  const selectedShownResources = useSelectedShownResources();
  const renameResource = useRenameResource();
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

  function abortRename() {
    setKeyOfResourceToRename(undefined);
  }

  const resourceIsSelected = !!selectedShownResources.find(
    (resource) => resource.key === resourceForRow.key,
  );
  const renameForResourceIsActive = keyOfResourceToRename === resourceForRow.key;

  return (
    <Row
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
      <ResourceRowContent
        iconSlot={
          <IconWrapper className={nativeIconDataURL ? undefined : themeResourceIconClasses}>
            {nativeIconDataURL && (
              <img src={nativeIconDataURL} alt="icon for resource" style={{ maxHeight: '100%' }} />
            )}
          </IconWrapper>
        }
        resourceNameSlot={
          renameForResourceIsActive ? (
            <RenameInput
              resource={resourceForRow}
              onSubmit={(newName) => renameResource(resourceForRow, newName)}
              abortRename={abortRename}
            />
          ) : (
            <ResourceNameFormatted>
              {formatter.resourceBasename(resourceForRow)}
            </ResourceNameFormatted>
          )
        }
        tagsSlot={resourceForRow.tags.map((tag) => (
          <Chip
            key={tag.id}
            sx={{ backgroundColor: (theme) => theme.availableTagColors[tag.colorId] }}
            variant="outlined"
            size="small"
            label={tag.name}
            onDelete={() => removeTagsFromResources([resourceForRow.uri], [tag.id])}
          />
        ))}
        sizeSlot={
          resourceForRow.resourceType === RESOURCE_TYPE.FILE &&
          resourceForRow.size !== undefined &&
          formatter.bytes(resourceForRow.size)
        }
        mtimeSlot={resourceForRow.mtime !== undefined && formatter.date(resourceForRow.mtime)}
      />
    </Row>
  );
};

const ResourceNameFormatted = styled.div`
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

export const IconWrapper = styled(Box)`
  ${iconStyles}

  ::before {
    ${iconStyles}

    background-size: 24px 24px;
    background-repeat: no-repeat;
    -webkit-font-smoothing: antialiased;
  }
`;

type ResourceRowContentProps = {
  iconSlot: React.ReactNode;
  resourceNameSlot: React.ReactNode;
  tagsSlot?: React.ReactNode;
  sizeSlot: React.ReactNode;
  mtimeSlot: React.ReactNode;
};

export const ResourceRowContent: React.FC<ResourceRowContentProps> = ({
  iconSlot,
  resourceNameSlot,
  tagsSlot,
  sizeSlot,
  mtimeSlot,
}) => (
  <>
    <ResourcesTableCell>
      <Stack>
        <ResourceIconAndName>
          {iconSlot}
          {resourceNameSlot}
        </ResourceIconAndName>

        {tagsSlot}
      </Stack>
    </ResourcesTableCell>
    <ResourcesTableCell>{sizeSlot}</ResourcesTableCell>
    <ResourcesTableCell>{mtimeSlot}</ResourcesTableCell>
  </>
);

const ResourcesTableCell = styled(Cell)`
  font-size: ${({ theme }) => theme.font.sizes.sm};
`;

const ResourceIconAndName = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

type RenameInputProps = {
  resource: ResourceForUI;
  onSubmit: (newName: string) => void;
  abortRename: () => void;
};

const RenameInput: React.FC<RenameInputProps> = ({ resource, onSubmit, abortRename }) => {
  const [value, setValue] = React.useState(formatter.resourceBasename(resource));

  return (
    <RenameInputForm
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <ResourceNameTextField
        fullWidth
        inputProps={{ 'aria-label': 'new name for resource' }}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === KEY.ESC) {
            abortRename();
          }
        }}
      />
      <Button size="small" disabled={check.isNullishOrEmptyString(value)} type="submit">
        OK
      </Button>
      <Button size="small" onClick={abortRename}>
        Abort
      </Button>
    </RenameInputForm>
  );
};

const RenameInputForm = styled.form`
  width: 100%;
  display: flex;
  gap: ${(props) => props.theme.spacing(2)};
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
