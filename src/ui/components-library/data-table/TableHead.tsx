import * as React from 'react';
import styled from 'styled-components';

export type TableHeadProps = TableHeadComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'thead'> & React.RefAttributes<HTMLTableSectionElement>,
    keyof TableHeadComponentProps
  >;

type TableHeadComponentProps = {};

const TableHeadBase = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHeadBaseWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <thead {...delegatedProps} ref={ref}>
        {children}
      </thead>
    );
  },
);

export const TableHead = styled(TableHeadBase)``;
