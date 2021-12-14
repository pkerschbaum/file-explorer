import * as React from 'react';
import styled from 'styled-components';

export type CellProps = CellComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'td'> & React.RefAttributes<HTMLTableCellElement>,
    keyof CellComponentProps
  >;

type CellComponentProps = {};

const CellBase = React.forwardRef<HTMLTableCellElement, CellProps>(function CellBaseWithRef(
  props,
  ref,
) {
  const { children, ...delegatedProps } = props;

  return (
    <td {...delegatedProps} ref={ref}>
      {children}
    </td>
  );
});

export const Cell = styled(CellBase)`
  padding: 0;

  border-bottom: var(--border-width-1) solid var(--color-darken-1);
`;
