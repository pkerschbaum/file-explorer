import * as React from 'react';
import styled from 'styled-components';

export type CellProps = CellComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'td'> & React.RefAttributes<HTMLTableCellElement>,
    keyof CellComponentProps
  >;

type CellComponentProps = {};

export const Cell = styled(
  React.forwardRef<HTMLTableCellElement, CellProps>(function CellWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <CellRoot {...delegatedProps} ref={ref}>
        {children}
      </CellRoot>
    );
  }),
)``;

const CellRoot = styled.td`
  padding: 0;

  border-bottom: var(--border-width-1) solid var(--color-darken-1);
`;
