import * as React from 'react';
import styled, { css } from 'styled-components';

import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { startNativeFileDnD } from '@app/operations/app.operations';
import { openResource } from '@app/operations/explorer.operations';
import { removeTagsFromResources } from '@app/operations/resource.operations';
import { commonStyles } from '@app/ui/common-styles';
import { Box, Chip, Skeleton, TextField, useVirtual } from '@app/ui/components-library';
import {
  DataCell,
  DataTable,
  HeadCell,
  Row,
  RowProps,
  TableBody,
  TableHead,
} from '@app/ui/components-library/data-table';
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
import { ResourceIcon } from '@app/ui/resource-icon';
import { ResourceRenameInput } from '@app/ui/resource-rename-input';

const ROW_HEIGHT = 38;
const ICON_SIZE = 24;
const VIRTUALIZE_TABLE_BODY_THRESHOLD = 1000;

export const ResourcesTable: React.FC = () => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <DataTable ref={tableContainerRef} labels={{ table: 'Table of resources' }}>
      <StyledTableHead>
        <Row>
          <NameHeadCell>Name</NameHeadCell>
          <SizeHeadCell>Size</SizeHeadCell>
          <MtimeHeadCell>Last Modified</MtimeHeadCell>
        </Row>
      </StyledTableHead>

      <ResourcesTableBody tableContainerRef={tableContainerRef} />
    </DataTable>
  );
};

const StyledTableHead = styled(TableHead)`
  user-select: none;
`;

const headCellStyles = css`
  height: ${ROW_HEIGHT}px;

  padding-inline: var(--padding-button-md-inline);

  text-align: start;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  & * {
    white-space: nowrap;
  }
`;

const NameHeadCell = styled(HeadCell)`
  ${headCellStyles}
  width: 100%;
`;

const SizeHeadCell = styled(HeadCell)`
  ${headCellStyles}
  min-width: 90px;
`;

const MtimeHeadCell = styled(HeadCell)`
  ${headCellStyles}
  min-width: 155px;
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
    /* add paddingStart for space of the parent which is occupied by the sticky header row */
    paddingStart: ROW_HEIGHT,
    estimateSize: React.useCallback(() => ROW_HEIGHT, []),
    keyExtractor: (index) => resourcesToShow[index].key,
    overscan: 50,
  });

  return (
    <TableBody
      style={{
        position: 'relative',
        /**
         * Because of paddingStart set to ROW_HEIGHT, react-virtual thinks it must move all rows
         * down by ROW_HEIGHT pixels. This is not the case - the <tbody> element is already below the
         * sticky header row, so there is no need to move the rows further down.
         *
         * Since there seems to be no way to tell react-virtual that the given paddingStart should
         * just be used for space calculation (not for positioning), we just move the <tbody> element
         * up, below the sticky header row, to align with the react-virtual behavior.
         *
         * We also have to reduce the height by the paddingStart because react-virtual does include
         * it in the calculated total size.
         */
        top: -ROW_HEIGHT,
        height: `${rowVirtualizer.totalSize - ROW_HEIGHT}px`,
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

  return (
    <Row
      data-window-keydownhandlers-enabled="true"
      draggable={!renameForResourceIsActive}
      onDragStart={(e) => {
        e.preventDefault();
        startNativeFileDnD(resourceForRow.uri);
      }}
      onClick={(e) => changeSelectionByClick(e, resourceForRow, idxOfResourceForRow)}
      onDoubleClick={() => openResource(explorerId, resourceForRow)}
      isSelectable
      isSelected={resourceIsSelected}
      style={rowStyleForVirtualization}
    >
      <ResourceRowContent
        iconSlot={
          <ResourceIconContainer>
            <ResourceIcon resource={resourceForRow} />
          </ResourceIconContainer>
        }
        resourceNameSlot={
          renameForResourceIsActive ? (
            <StyledResourceRenameInput
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
                  style={{ backgroundColor: `var(--color-tags-${tag.colorId})` }}
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

const ResourceNameFormattedSpacingFactor = 1;

const ResourceNameFormatted = styled(Box)`
  padding-left: calc(2 * ${ResourceNameFormattedSpacingFactor} * var(--spacing-1));
  display: flex;
  align-items: center;
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
  <Row style={{ opacity }}>
    <ResourceRowContent
      iconSlot={
        <ResourceIconContainer>
          <Skeleton variant="rectangular" />
        </ResourceIconContainer>
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

const ResourceIconContainer = styled(Box)`
  width: ${ICON_SIZE}px;
  max-width: ${ICON_SIZE}px;
  height: 100%;
  max-height: 100%;

  padding-block: var(--padding-button-md-block);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > * {
    ${commonStyles.layout.flex.shrinkAndFitVertical}
  }
`;

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
    <NameDataCell>
      <ResourceIconAndNameAndTags>
        <ResourceIconAndName fullWidth={!tagsSlot}>
          {iconSlot}
          {resourceNameSlot}
        </ResourceIconAndName>

        {tagsSlot}
      </ResourceIconAndNameAndTags>
    </NameDataCell>
    <StyledDataCell>{sizeSlot}</StyledDataCell>
    <StyledDataCell>{mtimeSlot}</StyledDataCell>
  </>
);

const StyledDataCell = styled(DataCell)`
  height: ${ROW_HEIGHT}px;

  padding-inline: var(--padding-button-md-inline);

  white-space: nowrap;
  & * {
    white-space: nowrap;
  }
`;

const NameDataCell = styled(StyledDataCell)`
  width: 100%;
`;

const ResourceIconAndNameAndTags = styled(Box)`
  height: 100%;

  display: flex;
  gap: var(--spacing-2);
`;

const ResourceIconAndName = styled(Box)<{ fullWidth: boolean }>`
  width: ${({ fullWidth }) => fullWidth && '100%'};

  display: flex;
`;

const StyledResourceRenameInput = styled(ResourceRenameInput)`
  /* 
     The spacing between the TextField and the resource icon is evenly distributed across the 
     TextField container and the TextField input.
     Also, width is set to 100% so that it takes up the full width of the row.
   */
  --padding-block-for-rename-textfield: 3px;
  & > ${TextField} {
    padding-left: calc(${ResourceNameFormattedSpacingFactor} * var(--spacing-1) - 1px);
  }

  & > ${TextField} > input {
    padding-inline: calc(${ResourceNameFormattedSpacingFactor} * var(--spacing-1));
    padding-block: var(--padding-block-for-rename-textfield);
  }

  & > ${TextField} > input:focus {
    padding-bottom: calc(
      var(--padding-block-for-rename-textfield) - var(--border-bottom-width-difference)
    );
  }
`;
