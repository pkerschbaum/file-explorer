import * as React from 'react';
import styled from 'styled-components';

export type HeadCellProps = HeadCellComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'th'> & React.RefAttributes<HTMLTableCellElement>,
    keyof HeadCellComponentProps
  >;

type HeadCellComponentProps = {};

const HeadCellBase = React.forwardRef<HTMLTableCellElement, HeadCellProps>(
  function HeadCellBaseWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <th {...delegatedProps} ref={ref}>
        {children}
      </th>
    );
  },
);

export const HeadCell = styled(HeadCellBase)`
  padding: 0;

  border-bottom: var(--border-width-1) solid var(--color-darken-1);
`;
