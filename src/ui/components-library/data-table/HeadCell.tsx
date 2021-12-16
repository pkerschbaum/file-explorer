import * as React from 'react';
import styled from 'styled-components';

export type HeadCellProps = HeadCellComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'th'> & React.RefAttributes<HTMLTableCellElement>,
    keyof HeadCellComponentProps
  >;

type HeadCellComponentProps = {};

export const HeadCell = styled(
  React.forwardRef<HTMLTableCellElement, HeadCellProps>(function HeadCellWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <HeadCellRoot {...delegatedProps} ref={ref}>
        {children}
      </HeadCellRoot>
    );
  }),
)``;

const HeadCellRoot = styled.th`
  /* make head cells sticky and put them before data cells, with opaque background */
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: inherit;

  padding: 0;

  border-bottom: var(--border-width-1) solid var(--color-darken-1);
`;
