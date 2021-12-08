import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { Pulsate } from '@app/ui/utils/animations';

type SkeletonProps = {
  variant: 'text' | 'rectangular';
  width?: number;
  className?: string;
};

const SkeletonBase = React.forwardRef<HTMLDivElement, SkeletonProps>(function SkeletonBaseWithRef(
  props,
  ref,
) {
  const { variant = 'text', width: _ignored, ...htmlProps } = props;

  return (
    <>
      {variant === 'text' ? (
        <SkeletonText ref={ref} {...htmlProps} />
      ) : (
        <SkeletonRectangular ref={ref} {...htmlProps} />
      )}
    </>
  );
});

export const Skeleton = styled(SkeletonBase)`
  width: ${({ width }) => (width !== undefined ? `${width}px` : '100%')};

  /* appearance props taken from https://mui.com/components/skeleton/#variants */
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.13);
  animation: 1.5s ease-in-out 0.5s infinite normal none running ${Pulsate};
`;

const SkeletonText = styled(Box)`
  height: 1em;
`;

const SkeletonRectangular = styled(Box)`
  height: 100%;
`;
