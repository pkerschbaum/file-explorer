import * as React from 'react';
import styled, { css } from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { ResourceForUI, RESOURCE_TYPE } from '@app/domain/types';
import { startNativeFileDnD } from '@app/operations/app.operations';
import { openResource } from '@app/operations/explorer.operations';
import { commonStyles } from '@app/ui/common-styles';
import { Box } from '@app/ui/components-library';
import {
  useChangeSelectionByClick,
  useExplorerId,
  useKeyOfResourceToRename,
  useResourcesToShow,
  useSelectedShownResources,
} from '@app/ui/explorer-context';
import { ResourceIcon } from '@app/ui/resource-icon';

export const ResourcesGallery: React.FC = () => {
  const resourcesToShow = useResourcesToShow();

  return (
    <GalleryViewRoot>
      {resourcesToShow.map((resource, idx) => (
        <ResourceTile key={resource.key} resourceForTile={resource} idxOfResource={idx} />
      ))}
    </GalleryViewRoot>
  );
};

const GalleryViewRoot = styled(Box)`
  ${commonStyles.layout.flex.shrinkAndFitVertical}
  margin-top: var(--spacing-1);

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 200px;
  grid-gap: var(--spacing-3);
  overflow: auto;
`;

type ResourceTileProps = {
  resourceForTile: ResourceForUI;
  idxOfResource: number;
};

const ResourceTile: React.FC<ResourceTileProps> = ({ resourceForTile, idxOfResource }) => {
  const explorerId = useExplorerId();
  const selectedShownResources = useSelectedShownResources();
  const changeSelectionByClick = useChangeSelectionByClick();
  const keyOfResourceToRename = useKeyOfResourceToRename();

  // TODO implement rename

  const resourceIsSelected = !!selectedShownResources.find(
    (resource) => resource.key === resourceForTile.key,
  );
  const renameForResourceIsActive = keyOfResourceToRename === resourceForTile.key;

  return (
    <ResourceTileRoot
      data-window-keydownhandlers-enabled="true"
      draggable={!renameForResourceIsActive}
      onDragStart={(e) => {
        e.preventDefault();
        startNativeFileDnD(resourceForTile.uri);
      }}
      onClick={(e) => changeSelectionByClick(e, resourceForTile, idxOfResource)}
      onDoubleClick={() => openResource(explorerId, resourceForTile)}
      styleProps={{ isSelectable: true, isSelected: resourceIsSelected }}
    >
      <StyledResourceIcon resource={resourceForTile} />
      <ResourceDetails>
        <NameFormatted>{formatter.resourceBasename(resourceForTile)}</NameFormatted>
        <SizeAndExtension>
          <SizeFormatted>
            {resourceForTile.resourceType === RESOURCE_TYPE.FILE &&
              resourceForTile.size !== undefined &&
              formatter.bytes(resourceForTile.size)}
          </SizeFormatted>
          {check.isNonEmptyString(resourceForTile.extension) && (
            <ExtensionFormatted>{formatter.resourceExtension(resourceForTile)}</ExtensionFormatted>
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

const ExtensionFormatted = styled(Box)`
  padding-inline: var(--spacing-1);

  border-radius: var(--border-radius-2);
  color: var(--color-primary-contrast);
  background-color: var(--color-primary-main);
  font-weight: var(--font-weight-bold);
`;
