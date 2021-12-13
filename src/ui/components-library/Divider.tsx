import { SeparatorProps, useSeparator } from '@react-aria/separator';
import { mergeProps } from '@react-aria/utils';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type DividerProps = Pick<SeparatorProps, 'orientation'> &
  Pick<React.HTMLProps<HTMLDivElement>, 'className'>;

const DividerBase = React.forwardRef<HTMLDivElement, DividerProps>(function DividerForwardRef(
  props,
  ref,
) {
  const {
    /* react-aria props */
    orientation,

    /* html props */
    ...htmlProps
  } = props;
  const reactAriaProps = {
    orientation,
  };

  const { separatorProps } = useSeparator(reactAriaProps);
  return <Box ref={ref} {...mergeProps(htmlProps, separatorProps)} />;
});

export const Divider = styled(DividerBase)`
  border-top-width: 0;
  border-left-width: 0;
  border-color: var(--color-darken-1);
  border-style: solid;
  ${({ orientation }) => {
    if (orientation === 'vertical') {
      return css`
        border-bottom-width: 0;
        border-right-width: var(--border-width-1);
        height: auto;
      `;
    } else {
      return css`
        border-bottom-width: var(--border-width-1);
        border-right-width: 0;
        width: auto;
      `;
    }
  }};
`;
