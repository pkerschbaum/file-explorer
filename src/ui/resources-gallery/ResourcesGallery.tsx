import * as React from 'react';
import styled, { css } from 'styled-components';
import invariant from 'tiny-invariant';

import { assertIsUnreachable, check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { startNativeFileDnD } from '@app/operations/app.operations';
import { openResources } from '@app/operations/explorer.operations';
import { commonStyles } from '@app/ui/common-styles';
import { Box, componentLibraryUtils, useFramerMotionAnimations } from '@app/ui/components-library';
import { KEY } from '@app/ui/constants';
import {
  useChangeSelection,
  useKeyOfLastSelectedResource,
  useKeyOfResourceToRename,
  useRegisterCwdSegmentShortcuts,
  useRenameResource,
  useResourcesToShow,
  useScrollTop,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
  useSetScrollTop,
} from '@app/ui/explorer-context';
import { useExplorerId } from '@app/ui/explorer-panel/ExplorerPanel';
import { ResourceIcon } from '@app/ui/resource-icon';
import { ResourceRenameInput } from '@app/ui/resource-rename-input';
import { usePrevious, useRunCallbackOnMount, useThrottleFn } from '@app/ui/utils/react.util';

const TILE_HEIGHT = 200;

export const ResourcesGallery: React.FC = () => {
  const galleryRootRef = React.useRef<HTMLDivElement>(null);
  const [countOfColumns, setCountOfColumns] = React.useState<number | undefined>();

  const resourcesToShow = useResourcesToShow();
  const changeSelection = useChangeSelection();
  const keyOfLastSelectedResource = useKeyOfLastSelectedResource();
  const scrollTop = useScrollTop();

  const setScrollTop = useSetScrollTop();
  const throttledSetScrollTop = useThrottleFn(setScrollTop, 200);

  useRunCallbackOnMount(function setInitialScrollTop() {
    invariant(galleryRootRef.current);
    galleryRootRef.current.scrollTop = scrollTop;
  });

  React.useEffect(function determineCountOfColumnsOnMountAndAfterResize() {
    invariant(galleryRootRef.current);
    const galleryRootElem = galleryRootRef.current;

    function computeAndSetCountOfColumns() {
      // read computed grid columns (https://stackoverflow.com/a/66186894/1700319)
      const computedStyle = window.getComputedStyle(galleryRootElem);
      const computedColumns = computedStyle.getPropertyValue('grid-template-columns');
      const countOfColumns = computedColumns.split(' ').length;
      setCountOfColumns(countOfColumns);
    }

    computeAndSetCountOfColumns();

    const resizeObserver = new ResizeObserver(computeAndSetCountOfColumns);
    resizeObserver.observe(galleryRootElem);
    return () => {
      resizeObserver.unobserve(galleryRootElem);
    };
  }, []);

  const idxOfLastSelectedResource = resourcesToShow.findIndex((resource) =>
    keyOfLastSelectedResource?.includes(resource.key),
  );
  useRegisterCwdSegmentShortcuts({
    changeSelectionByKeyboardShortcut: {
      keybindings: [
        {
          key: KEY.ARROW_LEFT,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.ARROW_RIGHT,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.ARROW_UP,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.ARROW_DOWN,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.PAGE_UP,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.PAGE_DOWN,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: (e) => {
        invariant(countOfColumns !== undefined);
        e.preventDefault();

        let idxOfResourceToSelect;
        if (e.key === KEY.ARROW_LEFT) {
          idxOfResourceToSelect = idxOfLastSelectedResource - 1;
        } else if (e.key === KEY.ARROW_RIGHT) {
          idxOfResourceToSelect = idxOfLastSelectedResource + 1;
        } else if (e.key === KEY.ARROW_UP) {
          idxOfResourceToSelect = idxOfLastSelectedResource - countOfColumns;
          if (idxOfResourceToSelect < 0) {
            idxOfResourceToSelect = 0;
          }
        } else if (e.key === KEY.ARROW_DOWN) {
          idxOfResourceToSelect = idxOfLastSelectedResource + countOfColumns;
          if (idxOfResourceToSelect >= resourcesToShow.length) {
            idxOfResourceToSelect = resourcesToShow.length - 1;
          }
        } else if (e.key === KEY.PAGE_UP) {
          idxOfResourceToSelect = 0;
        } else if (e.key === KEY.PAGE_DOWN) {
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

  return (
    <GalleryRoot
      ref={galleryRootRef}
      onScroll={(e) => throttledSetScrollTop(e.currentTarget.scrollTop)}
    >
      {resourcesToShow.map((resource, idx) => (
        <ResourceTile key={resource.key} resource={resource} idxOfResource={idx} />
      ))}
    </GalleryRoot>
  );
};

const GalleryRoot = styled(Box)`
  ${commonStyles.layout.flex.shrinkAndFitVertical}

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: ${TILE_HEIGHT}px;
  grid-gap: var(--spacing-3);
  overflow-y: scroll;
`;

type ResourceTileProps = {
  resource: ResourceForUI;
  idxOfResource: number;
};

const ResourceTile: React.FC<ResourceTileProps> = ({ resource, idxOfResource }) => {
  const tileRef = React.useRef<HTMLDivElement>(null);

  const explorerId = useExplorerId();
  const selectedShownResources = useSelectedShownResources();
  const renameResource = useRenameResource();
  const changeSelection = useChangeSelection();
  const keyOfResourceToRename = useKeyOfResourceToRename();
  const setKeyOfResourceToRename = useSetKeyOfResourceToRename();

  const isResourceSelected = !!selectedShownResources.find(
    (selectedResource) => selectedResource.key === resource.key,
  );
  const wasResourceSelectedLastRender = usePrevious(isResourceSelected);
  const tileGotSelected = !wasResourceSelectedLastRender && isResourceSelected;

  React.useEffect(
    function scrollElementIntoViewOnSelection() {
      invariant(tileRef.current);

      if (tileGotSelected) {
        tileRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    },
    [tileGotSelected],
  );

  function abortRename() {
    setKeyOfResourceToRename(undefined);
  }
  const renameForResourceIsActive = keyOfResourceToRename === resource.key;

  const isAnimationAllowed = componentLibraryUtils.useIsAnimationAllowed();
  const framerMotionAnimations = useFramerMotionAnimations();
  const animations = !isAnimationAllowed
    ? {}
    : ({
        initial: framerMotionAnimations.fadeInOut.initial,
        animate: framerMotionAnimations.fadeInOut.animate,
        exit: framerMotionAnimations.fadeInOut.exit,
        layout: 'position',
      } as const);

  return (
    <ResourceTileRoot
      ref={tileRef}
      data-window-keydownhandlers-enabled="true"
      {...animations}
      draggable={!renameForResourceIsActive}
      onDragStart={(e) => {
        e.preventDefault();
        startNativeFileDnD(resource.uri);
      }}
      onClick={(e) =>
        changeSelection(idxOfResource, {
          ctrl: e.ctrlKey,
          shift: e.shiftKey,
        })
      }
      onDoubleClick={() => openResources(explorerId, [resource])}
      styleProps={{ isSelectable: true, isSelected: isResourceSelected }}
    >
      <StyledResourceIcon resource={resource} height={TILE_HEIGHT} />
      <ResourceDetails>
        {renameForResourceIsActive ? (
          <ResourceRenameInput
            resource={resource}
            onSubmit={(newName) => renameResource(resource, newName)}
            abortRename={abortRename}
          />
        ) : (
          <NameFormatted>{resource.basename}</NameFormatted>
        )}
        <SizeAndExtension>
          <SizeFormatted>
            {resource.resourceType === RESOURCE_TYPE.FILE &&
              resource.size !== undefined &&
              formatter.bytes(resource.size)}
          </SizeFormatted>
          {check.isNonEmptyString(resource.extension) && (
            <ExtensionBadge>{formatter.resourceExtension(resource)}</ExtensionBadge>
          )}
        </SizeAndExtension>
      </ResourceDetails>
    </ResourceTileRoot>
  );
};

type ResourceTileRootProps = {
  isSelectable: boolean;
  isSelected: boolean;
};

const ResourceTileRoot = styled(Box)<{ styleProps: ResourceTileRootProps }>`
  display: flex;
  flex-direction: column;

  border: var(--border-width-1) solid var(--color-darken-1);
  border-radius: var(--border-radius-2);

  ${({ styleProps }) =>
    styleProps.isSelectable &&
    css`
      &:hover {
        background-color: var(--color-bg-1);
      }
    `}

  ${({ styleProps }) =>
    styleProps.isSelected
      ? css`
          background-color: var(--color-bg-2);
          &:hover {
            background-color: var(--color-bg-2);
          }
        `
      : css`
          background-color: var(--color-bg-0);
        `};
`;

const StyledResourceIcon = styled(ResourceIcon)`
  ${commonStyles.layout.flex.shrinkAndFitVertical}
  padding: var(--spacing-2);
`;

const ResourceDetails = styled(Box)`
  flex-shrink: 0;

  padding: var(--spacing-2);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);

  border-top: var(--border-width-1) solid var(--color-darken-1);
`;

const NameFormatted = styled(Box)`
  font-weight: var(--font-weight-bold);
`;

const SizeAndExtension = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const SizeFormatted = styled(Box)``;

const ExtensionBadge = styled(Box)`
  padding-inline: var(--spacing-1);

  border-radius: var(--border-radius-2);
  color: var(--color-primary-contrast);
  background-color: var(--color-primary-main);
  font-weight: var(--font-weight-bold);
`;
