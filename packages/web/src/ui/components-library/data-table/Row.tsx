import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import * as React from 'react';
import { styled, css } from 'styled-components';

import type { ReactMotionProps } from '#pkg/ui/components-library/utils';

export type RowProps = RowComponentProps &
  Omit<ReactMotionProps<'tr', HTMLTableRowElement>, keyof RowComponentProps>;

type RowComponentProps = {
  isSelectable?: boolean;
  isSelected?: boolean;
};

export const Row = styled(
  React.forwardRef<HTMLTableRowElement, RowProps>(function RowWithRef(props, ref) {
    const {
      /* component props */
      children,
      isSelectable: _ignored2,
      isSelected: _ignored1,

      /* other props */
      ...delegatedProps
    } = props;

    return (
      <RowRoot {...(delegatedProps as HTMLMotionProps<'tr'>)} ref={ref} $styleProps={props}>
        {children}
      </RowRoot>
    );
  }),
)``;

type StyleProps = RowProps;

const RowRoot = styled(motion.tr)<{ $styleProps: StyleProps }>`
  ${({ $styleProps }) =>
    $styleProps.isSelectable &&
    css`
      &:hover {
        background-color: var(--color-bg-1);
      }
    `}

  ${({ $styleProps }) =>
    $styleProps.isSelected
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
