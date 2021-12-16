import * as React from 'react';
import styled from 'styled-components';

import { Row, RowProps } from '@app/ui/components-library/data-table/Row';

export type HeadRowProps = RowProps & HeadRowComponentProps;

type HeadRowComponentProps = {};

export const HeadRow = styled(
  React.forwardRef<HTMLTableRowElement, HeadRowProps>(function HeadRowWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <HeadRowRoot {...delegatedProps} ref={ref}>
        {children}
      </HeadRowRoot>
    );
  }),
)``;

const HeadRowRoot = styled(Row)`
  position: sticky;
  top: 0;
`;
