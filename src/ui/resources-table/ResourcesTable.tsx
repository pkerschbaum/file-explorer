import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import { useVirtual } from 'react-virtual';
import styled, { css } from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { getNativeIconURLForResource, startNativeFileDnD } from '@app/operations/app.operations';
import { changeDirectory } from '@app/operations/explorer.operations';
import { openFiles, removeTagsFromResources } from '@app/operations/resource.operations';
import { Box, Button, Chip, Skeleton, TextField, useTheme } from '@app/ui/components-library';
import {
  Cell,
  DataTable,
  DataTableProps,
  HeadCell,
  Row,
  RowProps,
  TableBody,
  TableHead,
} from '@app/ui/components-library/data-table';
import { KEY } from '@app/ui/constants';
import {
  useChangeSelectionByClick,
  useExplorerId,
  useResourcesToShow,
  useKeyOfResourceToRename,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
  useRenameResource,
  useDataAvailable,
} from '@app/ui/explorer-context';
import { useThemeResourceIconClasses } from '@app/ui/hooks/resources.hooks';

const ROW_HEIGHT = 38;
const VIRTUALIZE_TABLE_BODY_THRESHOLD = 1000;

export const ResourcesTable: React.FC = () => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <StyledDataTable
      labels={{ table: 'Table of resources' }}
      refs={{ tableContainer: tableContainerRef }}
    >
      <StyledTableHead>
        <Row>
          <StyledHeadCell>Name</StyledHeadCell>
          <SizeHeadCell>Size</SizeHeadCell>
          <MtimeHeadCell>Last Modified</MtimeHeadCell>
        </Row>
      </StyledTableHead>

      <ResourcesTableBody tableContainerRef={tableContainerRef} />
    </StyledDataTable>
  );
};

const StyledTableHead = styled(TableHead)`
  user-select: none;
`;

const StyledHeadCell = styled(HeadCell)`
  height: ${ROW_HEIGHT}px;
  font-weight: ${({ theme }) => theme.font.weights.bold};
`;

const SizeHeadCell = styled(StyledHeadCell)`
  min-width: 90px;
`;

const MtimeHeadCell = styled(StyledHeadCell)`
  min-width: 150px;
`;

const ForwardClassNameTable: React.FC<DataTableProps & { className?: string }> = ({
  className,
  ...delegated
}) => <DataTable {...delegated} classes={{ ...delegated.classes, table: className }} />;

const StyledDataTable = styled(ForwardClassNameTable)`
  & thead th:nth-of-type(1),
  & tbody td:nth-of-type(1) {
    width: 100%;
  }
  & thead th,
  & thead th *,
  & tbody td,
  & tbody td * {
    white-space: nowrap;
  }
`;

type ResourcesTableBodyProps = {
  tableContainerRef: React.RefObject<HTMLDivElement>;
};

const ResourcesTableBody: React.FC<ResourcesTableBodyProps> = ({ tableContainerRef }) => {
  const dataAvailable = useDataAvailable();
  const resourcesToShow = useResourcesToShow();

  return !dataAvailable ? (
    <SkeletonTableBody />
  ) : resourcesToShow.length < VIRTUALIZE_TABLE_BODY_THRESHOLD ? (
    <EagerTableBody resourcesToShow={resourcesToShow} />
  ) : (
    <VirtualizedTableBody tableContainerRef={tableContainerRef} resourcesToShow={resourcesToShow} />
  );
};

type EagerTableBodyProps = {
  resourcesToShow: ResourceForUI[];
};

const EagerTableBody: React.FC<EagerTableBodyProps> = ({ resourcesToShow }) => (
  <TableBody>
    {resourcesToShow.map((resourceToShow, index) => (
      <ResourceRow
        key={resourceToShow.key}
        resourceForRow={resourceToShow}
        idxOfResourceForRow={index}
      />
    ))}
  </TableBody>
);

type VirtualizedTableBodyProps = {
  tableContainerRef: React.RefObject<HTMLDivElement>;
  resourcesToShow: ResourceForUI[];
};

const VirtualizedTableBody: React.FC<VirtualizedTableBodyProps> = ({
  tableContainerRef,
  resourcesToShow,
}) => {
  const rowVirtualizer = useVirtual({
    size: resourcesToShow.length,
    parentRef: tableContainerRef,
    estimateSize: React.useCallback(() => ROW_HEIGHT, []),
    keyExtractor: (index) => resourcesToShow[index].key,
    overscan: 50,
  });

  return (
    <TableBody
      style={{
        /* subtract height for header row */
        height: `${rowVirtualizer.totalSize - ROW_HEIGHT}px`,
        position: 'relative',
      }}
    >
      {rowVirtualizer.virtualItems.map((virtualRow) => (
        <ResourceRow
          key={virtualRow.key}
          resourceForRow={resourcesToShow[virtualRow.index]}
          idxOfResourceForRow={virtualRow.index}
          virtualRowStart={virtualRow.start}
        />
      ))}
    </TableBody>
  );
};

type ResourceRowProps = {
  resourceForRow: ResourceForUI;
  idxOfResourceForRow: number;
  virtualRowStart?: number;
};

const ResourceRow = React.memo<ResourceRowProps>(function ResourceRow({
  resourceForRow,
  idxOfResourceForRow,
  virtualRowStart,
}) {
  const explorerId = useExplorerId();
  const selectedShownResources = useSelectedShownResources();
  const renameResource = useRenameResource();
  const changeSelectionByClick = useChangeSelectionByClick();
  const keyOfResourceToRename = useKeyOfResourceToRename();
  const setKeyOfResourceToRename = useSetKeyOfResourceToRename();

  const { availableTagColors } = useTheme();

  const themeResourceIconClasses = useThemeResourceIconClasses(resourceForRow);

  const [nativeIconLoadStatus, setNativeIconLoadStatus] = React.useState<
    'NOT_LOADED_YET' | 'SUCCESS' | 'ERROR'
  >('NOT_LOADED_YET');

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
  const rowStyleForVirtualization: RowProps['style'] =
    virtualRowStart === undefined
      ? undefined
      : {
          position: 'absolute',
          width: '100%',
          transform: `translateY(${virtualRowStart}px)`,
        };

  const nativeIconUrl = getNativeIconURLForResource(resourceForRow);

  return (
    <Row
      data-window-keydownhandlers-enabled="true"
      draggable={!renameForResourceIsActive}
      onDragStart={(e) => {
        e.preventDefault();
        startNativeFileDnD(resourceForRow.uri);
      }}
      onClick={(e) => changeSelectionByClick(e, resourceForRow, idxOfResourceForRow)}
      onDoubleClick={() => openResource(resourceForRow)}
      selected={resourceIsSelected}
      style={rowStyleForVirtualization}
    >
      <ResourceRowContent
        iconSlot={
          <IconWrapper
            className={nativeIconLoadStatus === 'SUCCESS' ? undefined : themeResourceIconClasses}
          >
            {check.isNonEmptyString(nativeIconUrl) &&
              (nativeIconLoadStatus === 'NOT_LOADED_YET' || nativeIconLoadStatus === 'SUCCESS') && (
                <img
                  src={nativeIconUrl}
                  alt="icon for resource"
                  style={{ maxHeight: '100%' }}
                  onLoad={() => {
                    setNativeIconLoadStatus('SUCCESS');
                  }}
                  onError={() => {
                    setNativeIconLoadStatus('ERROR');
                  }}
                />
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
        tagsSlot={
          renameForResourceIsActive
            ? undefined
            : resourceForRow.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  style={{ backgroundColor: availableTagColors[tag.colorId] }}
                  label={tag.name}
                  onDelete={() => removeTagsFromResources([resourceForRow.uri], [tag.id])}
                  deleteTooltipContent="Remove tag"
                />
              ))
        }
        sizeSlot={
          resourceForRow.resourceType === RESOURCE_TYPE.FILE &&
          resourceForRow.size !== undefined &&
          formatter.bytes(resourceForRow.size)
        }
        mtimeSlot={resourceForRow.mtime !== undefined && formatter.date(resourceForRow.mtime)}
      />
    </Row>
  );
});

const ResourceNameFormatted = styled(Box)`
  padding-left: ${(props) => props.theme.spacing(ResourceNameFormattedSpacingFactor * 2)};
  display: flex;
  align-items: center;
`;

const iconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  max-width: 24px;
  height: 100%;
  max-height: 100%;
`;

const IconWrapper = styled(Box)`
  ${iconStyles}

  ::before {
    ${iconStyles}

    background-size: 24px 100%;
    background-repeat: no-repeat;
    -webkit-font-smoothing: antialiased;
  }
`;

const SkeletonTableBody: React.FC = () => (
  <TableBody>
    <SkeletonRow />
    <SkeletonRow opacity={0.66} />
    <SkeletonRow opacity={0.33} />
  </TableBody>
);

type SkeletonRowProps = {
  opacity?: number;
};

const SkeletonRow: React.FC<SkeletonRowProps> = ({ opacity }) => (
  <Row sx={{ opacity }}>
    <ResourceRowContent
      iconSlot={
        <IconWrapper>
          <Skeleton variant="rectangular" />
        </IconWrapper>
      }
      resourceNameSlot={
        <ResourceNameFormatted>
          <Skeleton variant="text" width={160} />
        </ResourceNameFormatted>
      }
      sizeSlot={<Skeleton variant="text" width={50} />}
      mtimeSlot={<Skeleton variant="text" width={110} />}
    />
  </Row>
);

type ResourceRowContentProps = {
  iconSlot: React.ReactNode;
  resourceNameSlot: React.ReactNode;
  tagsSlot?: React.ReactNode;
  sizeSlot: React.ReactNode;
  mtimeSlot: React.ReactNode;
};

const ResourceRowContent: React.FC<ResourceRowContentProps> = ({
  iconSlot,
  resourceNameSlot,
  tagsSlot,
  sizeSlot,
  mtimeSlot,
}) => (
  <>
    <StyledCell>
      <ResourceIconAndNameAndTags>
        <ResourceIconAndName fullWidth={!tagsSlot}>
          {iconSlot}
          {resourceNameSlot}
        </ResourceIconAndName>

        {tagsSlot}
      </ResourceIconAndNameAndTags>
    </StyledCell>
    <StyledCell>{sizeSlot}</StyledCell>
    <StyledCell>{mtimeSlot}</StyledCell>
  </>
);

const StyledCell = styled(Cell)`
  height: ${ROW_HEIGHT}px;
`;

const ResourceIconAndNameAndTags = styled(Box)`
  height: 100%;

  display: flex;
  gap: ${({ theme }) => theme.spacing()};
`;

const ResourceIconAndName = styled(Box)<{ fullWidth: boolean }>`
  width: ${({ fullWidth }) => fullWidth && '100%'};

  display: flex;
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
        inputProps={{ 'aria-label': 'new name for resource' }}
        autoFocus
        value={value}
        onChange={setValue}
        onKeyDown={(e) => {
          if (e.key === KEY.ESC) {
            abortRename();
          }
        }}
      />
      <Button buttonSize="sm" isDisabled={check.isNullishOrEmptyString(value)} type="submit">
        OK
      </Button>
      <Button buttonSize="sm" onPress={abortRename}>
        Abort
      </Button>
    </RenameInputForm>
  );
};

const RenameInputForm = styled.form`
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: ${(props) => props.theme.spacing(2)};
`;

const ResourceNameFormattedSpacingFactor = 0.5;

const ResourceNameTextField = styled(TextField)`
  width: 100%;
`;
