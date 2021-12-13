import * as React from 'react';
import styled from 'styled-components';

export type TableHeadProps = React.ComponentProps<'thead'> & TableHeadComponentProps;

type TableHeadComponentProps = {};

const TableHeadBase = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHeadBaseWithRef(props, ref) {
    const { children, ...htmlProps } = props;

    return (
      <thead {...htmlProps} ref={ref}>
        {children}
      </thead>
    );
  },
);

export const TableHead = styled(TableHeadBase)``;
