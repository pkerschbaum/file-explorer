import * as React from 'react';
import styled, { css } from 'styled-components';

export type RowProps = RowComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'tr'> & React.RefAttributes<HTMLTableRowElement>,
    keyof RowComponentProps
  >;

type RowComponentProps = {
  isSelectable?: boolean;
  isSelected?: boolean;
};

const RowBase = React.forwardRef<HTMLTableRowElement, RowProps>(function RowBaseWithRef(
  props,
  ref,
) {
  const {
    /* component props */
    children,
    isSelectable: _ignored2,
    isSelected: _ignored1,

    /* other props */
    ...delegatedProps
  } = props;

  return (
    <tr {...delegatedProps} ref={ref}>
      {children}
    </tr>
  );
});

export const Row = styled(RowBase)`
  ${({ isSelected }) =>
    isSelected
      ? css`
          background-color: var(--color-bg-2);
          &&:hover {
            background-color: var(--color-bg-2);
          }
        `
      : css`
          background-color: var(--color-bg-0);
        `};

  ${({ isSelectable }) =>
    isSelectable &&
    css`
      &:hover {
        background-color: var(--color-bg-1);
      }
    `}
`;
