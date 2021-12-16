import * as React from 'react';
import styled from 'styled-components';

export type DataCellProps = DataCellComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'td'> & React.RefAttributes<HTMLTableCellElement>,
    keyof DataCellComponentProps
  >;

type DataCellComponentProps = {};

export const DataCell = styled(
  React.forwardRef<HTMLTableCellElement, DataCellProps>(function DataCellWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <DataCellRoot {...delegatedProps} ref={ref}>
        {children}
      </DataCellRoot>
    );
  }),
)``;

const DataCellRoot = styled.td`
  padding: 0;

  border-bottom: var(--border-width-1) solid var(--color-darken-1);
`;
