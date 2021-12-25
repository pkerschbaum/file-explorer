import * as React from 'react';
import styled, { css } from 'styled-components';
import invariant from 'tiny-invariant';

import { assertIsUnreachable, check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { startNativeFileDnD } from '@app/operations/app.operations';
import { openResource } from '@app/operations/explorer.operations';
import { commonStyles } from '@app/ui/common-styles';
import { Box } from '@app/ui/components-library';
import { KEY } from '@app/ui/constants';
import {
  useChangeSelection,
  useExplorerId,
  useKeyOfLastSelectedResource,
  useKeyOfResourceToRename,
  useRegisterExplorerShortcuts,
  useRenameResource,
  useResourcesToShow,
  useSelectedShownResources,
  useSetKeyOfResourceToRename,
} from '@app/ui/explorer-context';
import { ResourceIcon } from '@app/ui/resource-icon';
import { ResourceRenameInput } from '@app/ui/resource-rename-input';
import { usePrevious } from '@app/ui/utils/react.util';

const TILE_HEIGHT = 200;

export const ResourcesGallery: React.FC = () => {
  const galleryRootRef = React.useRef<HTMLDivElement>(null);
  const [countOfColumns, setCountOfColumns] = React.useState<number | undefined>();

  const resourcesToShow = useResourcesToShow();
  const changeSelection = useChangeSelection();
  const keyOfLastSelectedResource = useKeyOfLastSelectedResource();
  const idxOfLastSelectedResource = resourcesToShow.findIndex((resource) =>
    keyOfLastSelectedResource?.includes(resource.key),
  );

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

  useRegisterExplorerShortcuts({
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
    <GalleryRoot ref={galleryRootRef}>
      {resourcesToShow.map((resource, idx) => (
        <ResourceTile key={resource.key} resourceForTile={resource} idxOfResource={idx} />
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
  overflow: auto;
`;

type ResourceTileProps = {
  resourceForTile: ResourceForUI;
  idxOfResource: number;
};

const ResourceTile: React.FC<ResourceTileProps> = ({ resourceForTile, idxOfResource }) => {
  const tileRef = React.useRef<HTMLDivElement>(null);

  const explorerId = useExplorerId();
  const selectedShownResources = useSelectedShownResources();
  const renameResource = useRenameResource();
  const changeSelection = useChangeSelection();
  const keyOfResourceToRename = useKeyOfResourceToRename();
  const setKeyOfResourceToRename = useSetKeyOfResourceToRename();

  const isResourceSelected = !!selectedShownResources.find(
    (resource) => resource.key === resourceForTile.key,
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

  const renameForResourceIsActive = keyOfResourceToRename === resourceForTile.key;

  return (
    <ResourceTileRoot
      ref={tileRef}
      data-window-keydownhandlers-enabled="true"
      draggable={!renameForResourceIsActive}
      onDragStart={(e) => {
        e.preventDefault();
        startNativeFileDnD(resourceForTile.uri);
      }}
      onClick={(e) =>
        changeSelection(idxOfResource, {
          ctrl: e.ctrlKey,
          shift: e.shiftKey,
        })
      }
      onDoubleClick={() => openResource(explorerId, resourceForTile)}
      styleProps={{ isSelectable: true, isSelected: isResourceSelected }}
    >
      <StyledResourceIcon resource={resourceForTile} height={TILE_HEIGHT} />
      <ResourceDetails>
        {renameForResourceIsActive ? (
          <ResourceRenameInput
            resource={resourceForTile}
            onSubmit={(newName) => renameResource(resourceForTile, newName)}
            abortRename={abortRename}
          />
        ) : (
          <NameFormatted>{resourceForTile.basename}</NameFormatted>
        )}
        <SizeAndExtension>
          <SizeFormatted>
            {resourceForTile.resourceType === RESOURCE_TYPE.FILE &&
              resourceForTile.size !== undefined &&
              formatter.bytes(resourceForTile.size)}
          </SizeFormatted>
          {check.isNonEmptyString(resourceForTile.extension) && (
            <ExtensionBadge>{formatter.resourceExtension(resourceForTile)}</ExtensionBadge>
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
