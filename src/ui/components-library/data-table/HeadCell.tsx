import * as React from 'react';
import styled from 'styled-components';

export type HeadCellProps = React.ComponentProps<'th'> & HeadCellComponentProps;

type HeadCellComponentProps = {};

const HeadCellBase = React.forwardRef<HTMLTableCellElement, HeadCellProps>(
  function HeadCellBaseWithRef(props, ref) {
    const { children, ...htmlProps } = props;

    return (
      <th {...htmlProps} ref={ref}>
        {children}
      </th>
    );
  },
);

export const HeadCell = styled(HeadCellBase)`
  padding: 0;

  border-bottom: var(--border-width-1) solid var(--color-darken-1);
`;
