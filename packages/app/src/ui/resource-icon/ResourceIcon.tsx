import * as React from 'react';
import styled, { css } from 'styled-components';

import type { ResourceForUI } from '#pkg/domain/types';
import {
  getNativeIconURLForResource,
  getThumbnailURLForResource,
  isResourceQualifiedForNativeIcon,
  isResourceQualifiedForThumbnail,
} from '#pkg/operations/app.operations';
import { Box } from '#pkg/ui/components-library';
import { useThemeResourceIconClasses } from '#pkg/ui/hooks/resources.hooks';

type ResourceIconProps = {
  resource: ResourceForUI;
  height: number;
  className?: string;
};

export const ResourceIcon: React.FC<ResourceIconProps> = ({ resource, height, className }) => {
  const themeIconCssClasses = useThemeResourceIconClasses(resource);

  const [thumbnailLoadStatus, setThumbnailLoadStatus] = React.useState<
    'NOT_LOADED_YET' | 'SUCCESS' | 'ERROR'
  >('NOT_LOADED_YET');
  const [nativeIconLoadStatus, setNativeIconLoadStatus] = React.useState<
    'NOT_LOADED_YET' | 'SUCCESS' | 'ERROR'
  >('NOT_LOADED_YET');

  let iconToShow: 'THUMBNAIL' | 'NATIVE_ICON' | 'THEME_ICON';
  const qualifiedForThumbnail = isResourceQualifiedForThumbnail(resource);
  const qualifiedForNativeIcon = isResourceQualifiedForNativeIcon(resource);
  if (qualifiedForThumbnail && thumbnailLoadStatus !== 'ERROR') {
    iconToShow = 'THUMBNAIL';
  } else if (qualifiedForNativeIcon && nativeIconLoadStatus !== 'ERROR') {
    iconToShow = 'NATIVE_ICON';
  } else {
    iconToShow = 'THEME_ICON';
  }

  const scaledHeight = Math.floor(height * window.devicePixelRatio);
  const thumbnailUrl = getThumbnailURLForResource(resource, scaledHeight);
  const nativeIconUrl = getNativeIconURLForResource(resource);
  const classes = [iconToShow === 'THEME_ICON' ? themeIconCssClasses : undefined, className].join(
    ' ',
  );

  return (
    <IconWrapper className={classes} styleProps={{ height }}>
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="thumbnail for resource"
          loading="lazy"
          style={{ maxHeight: '100%', display: iconToShow === 'THUMBNAIL' ? undefined : 'none' }}
          onLoad={() => {
            setThumbnailLoadStatus('SUCCESS');
          }}
          onError={() => {
            setThumbnailLoadStatus('ERROR');
          }}
        />
      )}

      {nativeIconUrl && (
        <img
          src={nativeIconUrl}
          alt="icon for resource"
          style={{ maxHeight: '100%', display: iconToShow === 'NATIVE_ICON' ? undefined : 'none' }}
          onLoad={() => {
            setNativeIconLoadStatus('SUCCESS');
          }}
          onError={() => {
            setNativeIconLoadStatus('ERROR');
          }}
        />
      )}
    </IconWrapper>
  );
};

type StyleProps = {
  height: number;
};

const iconStyles = css<{ styleProps: StyleProps }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  height: ${({ styleProps }) => styleProps.height}px;
  max-height: 100%;
`;

const IconWrapper = styled(Box)<{ styleProps: StyleProps }>`
  ${iconStyles}

  &::before {
    ${iconStyles}

    background-size: 100% ${({ styleProps }) => styleProps.height}px;
    background-repeat: no-repeat;
  }
`;
