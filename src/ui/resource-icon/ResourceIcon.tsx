import * as React from 'react';
import styled, { css } from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { ResourceForUI } from '@app/domain/types';
import {
  getNativeIconURLForResource,
  getThumbnailURLForResource,
} from '@app/operations/app.operations';
import { Box } from '@app/ui/components-library';
import { useThemeResourceIconClasses } from '@app/ui/hooks/resources.hooks';

type ResourceIconProps = {
  resource: ResourceForUI;
  height: number;
  className?: string;
};

export const ResourceIcon: React.FC<ResourceIconProps> = ({ resource, height, className }) => {
  const scaledHeight = Math.floor(height * window.devicePixelRatio);
  const thumbnailUrl = getThumbnailURLForResource(resource, scaledHeight);
  const nativeIconUrl = getNativeIconURLForResource(resource);
  const themeIconCssClasses = useThemeResourceIconClasses(resource);

  const [thumbnailLoadStatus, setThumbnailLoadStatus] = React.useState<
    'NO_URL_GIVEN' | 'NOT_LOADED_YET' | 'SUCCESS' | 'ERROR'
  >(() => (check.isNullishOrEmptyString(thumbnailUrl) ? 'NO_URL_GIVEN' : 'NOT_LOADED_YET'));
  const [nativeIconLoadStatus, setNativeIconLoadStatus] = React.useState<
    'NO_URL_GIVEN' | 'NOT_LOADED_YET' | 'SUCCESS' | 'ERROR'
  >(() => (check.isNullishOrEmptyString(nativeIconUrl) ? 'NO_URL_GIVEN' : 'NOT_LOADED_YET'));

  const iconToShow =
    thumbnailLoadStatus === 'SUCCESS'
      ? 'THUMBNAIL'
      : nativeIconLoadStatus === 'SUCCESS'
      ? 'NATIVE_ICON'
      : 'THEME_ICON';

  const classes = [iconToShow === 'THEME_ICON' ? themeIconCssClasses : undefined, className].join(
    ' ',
  );

  return (
    <IconWrapper className={classes} styleProps={{ height }}>
      {thumbnailLoadStatus !== 'NO_URL_GIVEN' && (
        <img
          src={thumbnailUrl}
          alt="thumbnail for resource"
          loading="lazy"
          style={{ maxHeight: '100%', display: iconToShow !== 'THUMBNAIL' ? 'none' : undefined }}
          onLoad={() => {
            setThumbnailLoadStatus('SUCCESS');
          }}
          onError={() => {
            setThumbnailLoadStatus('ERROR');
          }}
        />
      )}

      {nativeIconLoadStatus !== 'NO_URL_GIVEN' && (
        <img
          src={nativeIconUrl}
          alt="icon for resource"
          style={{ maxHeight: '100%', display: iconToShow !== 'NATIVE_ICON' ? 'none' : undefined }}
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
