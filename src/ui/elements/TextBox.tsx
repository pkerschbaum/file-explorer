import * as React from 'react';
import { Box, BoxProps } from '@mui/material';
import styled from '@mui/styled-engine';

import { assertUnreachable } from '@app/base/utils/types.util';

// adapted from https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Typography/Typography.js

type TextBoxProps = {
  fontBold?: boolean;
  fontItalic?: boolean;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  disablePreserveNewlines?: boolean;
  sx?: BoxProps['sx'];
  className?: string;
  children?: React.ReactNode;

  boxProps?: BoxProps;
};

export const TextBox = React.forwardRef<HTMLElement, TextBoxProps>(function TextBox(props, ref) {
  const {
    fontBold = false,
    fontItalic = false,
    fontSize = 'md',
    disablePreserveNewlines,

    sx,
    className,
    children,

    boxProps,
  } = props;

  return (
    <StyledBox
      className={className}
      fontSize={fontSize}
      fontBold={fontBold}
      disablePreserveNewlines={disablePreserveNewlines}
      fontStyle={fontItalic ? 'italic' : undefined}
      sx={sx}
      component="span"
      /* add ref, see https://github.com/mui-org/material-ui/issues/17010#issuecomment-615577360 */
      {...({ ref } as any)}
      {...boxProps}
    >
      {children}
    </StyledBox>
  );
});

const StyledBox = styled(Box)<{
  fontSize: TextBoxProps['fontSize'];
  fontBold: boolean;
  disablePreserveNewlines?: boolean;
}>`
  font-size: ${(props) => {
    switch (props.fontSize) {
      case undefined:
      case 'md': {
        return props.theme.typography.body1.fontSize;
      }
      case 'sm': {
        return props.theme.typography.body2.fontSize;
      }
      case 'lg': {
        return '1.25rem';
      }
      case 'xl': {
        return '1.5rem';
      }
      case 'xxl': {
        return '2.125rem';
      }
      case 'xxxl': {
        return '3.75rem';
      }
      default: {
        assertUnreachable(props.fontSize);
      }
    }
  }};
  font-weight: ${(props) => props.fontBold && 700};
  white-space: ${(props) => !props.disablePreserveNewlines && 'pre-wrap'};
`;
