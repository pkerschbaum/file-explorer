import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';
import invariant from 'tiny-invariant';

import { assertIsUnreachable } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { REASON_FOR_SELECTION_CHANGE } from '@app/global-state/slices/explorers.slice';
import { startNativeFileDnD } from '@app/operations/app.operations';
import { openResources } from '@app/operations/explorer.operations';
import {
  removeTagsFromResources,
  triggerPreloadContentsOfResource,
} from '@app/operations/resource.operations';
import { commonStyles } from '@app/ui/common-styles';
import {
  Box,
  Chip,
  componentLibraryUtils,
  Skeleton,
  TextField,
  useFramerMotionAnimations,
  useVirtual,
} from '@app/ui/components-library';
import {
  DataCell,
  DataTable,
  HeadCell,
  Row,
  TableBody,
  TableHead,
} from '@app/ui/components-library/data-table';
import { doesKeyboardEventKeyMatchPrintedKey, PRINTED_KEY } from '@app/ui/constants';
import {
  useChangeSelection,
  useResourcesToShow,
  useKeyOfResourceToRename,
  useSetKeyOfResourceToRename,
  useRenameResource,
  useDataAvailable,
  useRegisterCwdSegmentShortcuts,
  useKeyOfLastSelectedResource,
  useScrollTop,
  useSetScrollTop,
  useReasonForLastSelectionChange,
  useIsResourceSelected,
} from '@app/ui/cwd-segment-context';
import { useExplorerId } from '@app/ui/explorer-context';
import { ResourceIcon } from '@app/ui/resource-icon';
import { ResourceRenameInput } from '@app/ui/resource-rename-input';
import { usePrevious, useRunCallbackOnMount, useDebounceFn } from '@app/ui/utils/react.util';

const ROW_HEIGHT = 38;
const ICON_SIZE = 24;
const VIRTUALIZE_TABLE_BODY_THRESHOLD = 1000;

export const ResourcesTable: React.FC = () => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollTop = useScrollTop();
  const setScrollTop = useSetScrollTop();
  const debouncedSetScrollTop = useDebounceFn(setScrollTop, 200);

  useRunCallbackOnMount(function setInitialScrollTop() {
    invariant(tableContainerRef.current);
    tableContainerRef.current.scrollTop = scrollTop;
  });

  return (
    <DataTable
      ref={tableContainerRef}
      labels={{ table: 'Table of resources' }}
      onScroll={(e) => debouncedSetScrollTop(e.currentTarget.scrollTop)}
    >
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

const cellStyles = css`
  height: ${ROW_HEIGHT}px;

  padding-inline: var(--padding-button-md-inline);

  white-space: nowrap;
  & * {
    white-space: nowrap;
  }
`;

const headCellStyles = css`
  ${cellStyles}

  text-align: start;
  font-weight: var(--font-weight-bold);
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
  const changeSelection = useChangeSelection();
  const keyOfLastSelectedResource = useKeyOfLastSelectedResource();
  const idxOfLastSelectedResource = resourcesToShow.findIndex((resource) =>
    keyOfLastSelectedResource?.includes(resource.key),
  );

  useRegisterCwdSegmentShortcuts({
    changeSelectionByKeyboardShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.ARROW_UP,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: PRINTED_KEY.ARROW_DOWN,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: PRINTED_KEY.PAGE_UP,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: PRINTED_KEY.PAGE_DOWN,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: (e) => {
        let idxOfResourceToSelect;
        if (
          doesKeyboardEventKeyMatchPrintedKey({
            printedKey: PRINTED_KEY.ARROW_UP,
            keyboardEventKey: e.key,
          })
        ) {
          idxOfResourceToSelect = idxOfLastSelectedResource - 1;
        } else if (
          doesKeyboardEventKeyMatchPrintedKey({
            printedKey: PRINTED_KEY.ARROW_DOWN,
            keyboardEventKey: e.key,
          })
        ) {
          idxOfResourceToSelect = idxOfLastSelectedResource + 1;
        } else if (
          doesKeyboardEventKeyMatchPrintedKey({
            printedKey: PRINTED_KEY.PAGE_UP,
            keyboardEventKey: e.key,
          })
        ) {
          idxOfResourceToSelect = 0;
        } else if (
          doesKeyboardEventKeyMatchPrintedKey({
            printedKey: PRINTED_KEY.PAGE_DOWN,
            keyboardEventKey: e.key,
          })
        ) {
          idxOfResourceToSelect = resourcesToShow.length - 1;
        } else {
          assertIsUnreachable();
        }

        changeSelection(idxOfResourceToSelect, {
          ctrl: e.ctrlKey,
          shift: e.shiftKey,
        });
      },
      enableForRepeatedKeyboardEvent: true,
    },
  });

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
    <AnimatePresence>
      {resourcesToShow.map((resourceToShow, index) => (
        <ResourceRow
          key={resourceToShow.key}
          resource={resourceToShow}
          idxOfResourceForRow={index}
        />
      ))}
    </AnimatePresence>
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
        /**
         * Change position to "relative" for two reasons:
         * 1) The table body should be a containing block for the absolutely positioned virtualized rows.
         * 2) The table body must be moved up below the sticky header row (see explanation below).
         *
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
        position: 'relative',
        top: -ROW_HEIGHT,
        height: `${rowVirtualizer.totalSize - ROW_HEIGHT}px`,
      }}
    >
      {rowVirtualizer.virtualItems.map((virtualRow) => (
        <ResourceRow
          key={virtualRow.key}
          resource={resourcesToShow[virtualRow.index]}
          idxOfResourceForRow={virtualRow.index}
          virtualRowStart={virtualRow.start}
        />
      ))}
    </TableBody>
  );
};

type ResourceRowProps = {
  resource: ResourceForUI;
  idxOfResourceForRow: number;
  virtualRowStart?: number;
};

const ResourceRow = React.memo<ResourceRowProps>(function ResourceRow({
  resource,
  idxOfResourceForRow,
  virtualRowStart,
}) {
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const explorerId = useExplorerId();
  const isResourceSelected = useIsResourceSelected(resource.key);
  const reasonForLastSelectionChange = useReasonForLastSelectionChange();
  const renameResource = useRenameResource();
  const changeSelection = useChangeSelection();
  const keyOfResourceToRename = useKeyOfResourceToRename();
  const setKeyOfResourceToRename = useSetKeyOfResourceToRename();

  const { hoverProps } = useHover({
    onHoverStart: () => triggerPreloadContentsOfResource(resource),
  });

  React.useEffect(
    function triggerPreloadOnSelection() {
      if (isResourceSelected) {
        triggerPreloadContentsOfResource(resource);
      }
    },
    [isResourceSelected, resource],
  );

  const wasResourceSelectedLastRender = usePrevious(isResourceSelected);
  const tileGotSelected = !wasResourceSelectedLastRender && isResourceSelected;

  React.useEffect(
    function scrollElementIntoViewOnSelection() {
      invariant(rowRef.current);

      if (
        tileGotSelected &&
        (reasonForLastSelectionChange === REASON_FOR_SELECTION_CHANGE.USER_CHANGED_SELECTION ||
          reasonForLastSelectionChange === REASON_FOR_SELECTION_CHANGE.NEW_FOLDER_WAS_CREATED)
      ) {
        rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    },
    [reasonForLastSelectionChange, tileGotSelected],
  );

  function abortRename() {
    setKeyOfResourceToRename(undefined);
  }

  const renameForResourceIsActive = keyOfResourceToRename === resource.key;

  const rowStyleForVirtualization: undefined | React.CSSProperties =
    virtualRowStart === undefined
      ? undefined
      : {
          position: 'absolute',
          width: '100%',
          top: `${virtualRowStart}px`,
        };
  const isAnimationAllowed = componentLibraryUtils.useIsAnimationAllowed();
  const framerMotionAnimations = useFramerMotionAnimations();
  const animations =
    !isAnimationAllowed || rowStyleForVirtualization
      ? {}
      : ({
          initial: { ...framerMotionAnimations.fadeInOut.initial },
          animate: { ...framerMotionAnimations.fadeInOut.animate },
          exit: { ...framerMotionAnimations.fadeInOut.exit },
          layout: 'position',
        } as const);

  return (
    <ResourceRowRoot
      ref={rowRef}
      data-window-keydownhandlers-enabled="true"
      {...animations}
      draggable={!renameForResourceIsActive}
      isSelectable
      isSelected={isResourceSelected}
      style={rowStyleForVirtualization}
      {...mergeProps(hoverProps, {
        onDragStart: (e: React.DragEvent<HTMLTableRowElement>) => {
          e.preventDefault();
          startNativeFileDnD(resource.uri);
        },
        onClick: (e: React.MouseEvent<HTMLTableRowElement>) =>
          changeSelection(idxOfResourceForRow, {
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
          }),
        onDoubleClick: () => openResources(explorerId, [resource]),
      })}
    >
      <ResourceRowContent
        iconSlot={
          <ResourceIconContainer>
            <ResourceIcon resource={resource} height={ICON_SIZE} />
          </ResourceIconContainer>
        }
        resourceNameSlot={
          renameForResourceIsActive ? (
            <StyledResourceRenameInput
              resource={resource}
              onSubmit={(newName) => renameResource(resource, newName)}
              abortRename={abortRename}
            />
          ) : (
            <ResourceNameFormatted>{resource.basename}</ResourceNameFormatted>
          )
        }
        tagsSlot={
          renameForResourceIsActive
            ? undefined
            : resource.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  style={{ backgroundColor: `var(--color-tags-${tag.colorId})` }}
                  label={tag.name}
                  onDelete={() => removeTagsFromResources([resource.uri], [tag.id])}
                  deleteTooltipContent="Remove tag"
                />
              ))
        }
        sizeSlot={
          resource.resourceType === RESOURCE_TYPE.FILE &&
          resource.size !== undefined &&
          formatter.bytes(resource.size)
        }
        mtimeSlot={resource.mtime !== undefined && formatter.date(resource.mtime)}
      />
    </ResourceRowRoot>
  );
});

const ResourceRowRoot = styled(Row)`
  /* add scroll-margin-top so that "scrollIntoView" respects the sticky-positioned header */
  scroll-margin-top: ${ROW_HEIGHT}px;

  will-change: transform, opacity;
  content-visibility: auto;
`;

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
  ${cellStyles}
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
