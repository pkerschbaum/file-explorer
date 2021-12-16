import * as React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type SkeletonProps = {
  variant: 'text' | 'rectangular';
  width?: number;
  className?: string;
};

export const Skeleton = styled(
  React.forwardRef<HTMLDivElement, SkeletonProps>(function SkeletonWithRef(props, ref) {
    const { variant = 'text', width: _ignored, ...delegatedProps } = props;

    return (
      <>
        {variant === 'text' ? (
          <SkeletonText ref={ref} {...delegatedProps} styleProps={props} />
        ) : (
          <SkeletonRectangular ref={ref} {...delegatedProps} styleProps={props} />
        )}
      </>
    );
  }),
)``;

type StyleProps = SkeletonProps;

const skeletonStyles = css<{ styleProps: StyleProps }>`
  width: ${({ styleProps }) => (styleProps.width !== undefined ? `${styleProps.width}px` : '100%')};

  /* appearance props taken from https://mui.com/components/skeleton/#variants */
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.13);
  animation: var(--animation-pulsate);
`;

const SkeletonText = styled(Box)`
  ${skeletonStyles}
  height: 1em;
`;

const SkeletonRectangular = styled(Box)`
  ${skeletonStyles}
  height: 100%;
`;
