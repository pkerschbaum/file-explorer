import * as React from 'react';
import styled from 'styled-components';

export type TableBodyProps = React.ComponentProps<'tbody'> & TableBodyComponentProps;

type TableBodyComponentProps = {};

const TableBodyBase = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBodyBaseWithRef(props, ref) {
    const { children, ...htmlProps } = props;

    return (
      <tbody {...htmlProps} ref={ref}>
        {children}
      </tbody>
    );
  },
);

export const TableBody = styled(TableBodyBase)``;
