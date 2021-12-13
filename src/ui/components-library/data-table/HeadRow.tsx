import * as React from 'react';
import styled from 'styled-components';

import { Row, RowProps } from '@app/ui/components-library/data-table/Row';

export type HeadRowProps = RowProps & HeadRowComponentProps;

type HeadRowComponentProps = {};

const HeadRowBase = React.forwardRef<HTMLTableRowElement, HeadRowProps>(function HeadRowBaseWithRef(
  props,
  ref,
) {
  const { children, ...delegated } = props;

  return (
    <Row {...delegated} ref={ref}>
      {children}
    </Row>
  );
});

export const HeadRow = styled(HeadRowBase)`
  position: sticky;
  top: 0;
`;
