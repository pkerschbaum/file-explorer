import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { KeyboardEvent } from '@react-types/shared';
import * as React from 'react';
import { useVirtual } from 'react-virtual';
import styled, { css } from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { getNativeIconURLForResource, startNativeFileDnD } from '@app/operations/app.operations';
import { changeDirectory } from '@app/operations/explorer.operations';
import { openFiles, removeTagsFromResources } from '@app/operations/resource.operations';
import { Box, Button, Chip, FocusScope, Skeleton, TextField } from '@app/ui/components-library';
import {
  Cell,
  DataTable,
  DataTableProps,
  HeadCell,
  HeadRow,
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
        <HeadRow>
          <StyledHeadCell>Name</StyledHeadCell>
          <SizeHeadCell>Size</SizeHeadCell>
          <MtimeHeadCell>Last Modified</MtimeHeadCell>
        </HeadRow>
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

  padding-inline: var(--padding-button-md-inline);

  text-align: start;
  font-weight: var(--font-weight-bold);
`;

const SizeHeadCell = styled(StyledHeadCell)`
  min-width: 90px;
`;

const MtimeHeadCell = styled(StyledHeadCell)`
  min-width: 155px;
`;

const ForwardClassNameTable = React.forwardRef<
  HTMLDivElement,
  DataTableProps & { className?: string }
>(function ForwardClassNameTableWithRef({ className, ...delegated }, ref) {
  return (
    <DataTable {...delegated} ref={ref} classes={{ ...delegated.classes, table: className }} />
  );
});

const StyledDataTable = styled(ForwardClassNameTable)`
  border: var(--border-width-1) solid var(--color-darken-1);
  border-radius: var(--border-radius-2);

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
      isSelectable
      isSelected={resourceIsSelected}
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
  padding-block: var(--padding-button-md-block);

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
  <Row style={{ opacity }}>
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

  padding-inline: var(--padding-button-md-inline);
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

type RenameInputProps = {
  resource: ResourceForUI;
  onSubmit: (newName: string) => void;
  abortRename: () => void;
};

const RenameInput: React.FC<RenameInputProps> = ({ resource, onSubmit, abortRename }) => {
  const [value, setValue] = React.useState(formatter.resourceBasename(resource));

  const inputIsValid = check.isNonEmptyString(value);

  function handleSubmit() {
    if (!inputIsValid) {
      return;
    }

    onSubmit(value);
  }

  function abortOnEsc(e: KeyboardEvent) {
    if (e.key === KEY.ESC) {
      abortRename();
    }
  }

  return (
    <FocusScope contain autoFocus restoreFocus>
      <RenameInputForm
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          aria-label="new name for resource"
          autoFocus
          value={value}
          onChange={setValue}
          onKeyDown={abortOnEsc}
        />
        <Button
          buttonSize="sm"
          type="submit"
          isDisabled={!inputIsValid}
          /* https://github.com/adobe/react-spectrum/issues/1593 */
          onPress={handleSubmit}
          onKeyDown={abortOnEsc}
        >
          OK
        </Button>
        <Button buttonSize="sm" onPress={abortRename} onKeyDown={abortOnEsc}>
          Abort
        </Button>
      </RenameInputForm>
    </FocusScope>
  );
};

const RenameInputForm = styled.form`
  width: 100%;

  display: flex;
  align-items: stretch;
  gap: var(--spacing-4);

  & > ${Button} {
    margin-block: var(--padding-button-md-block);
  }

  /* 
     The spacing between the TextField and the resource icon is evenly distributed across the 
     TextField container and the TextField input.
     Also, width is set to 100% so that it takes up the full width of the row.
   */
  --padding-block-for-rename-textfield: 3px;
  & > ${TextField} {
    padding-left: calc(${ResourceNameFormattedSpacingFactor} * var(--spacing-1) - 1px);

    width: 100%;
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
