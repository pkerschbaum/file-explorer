import React from 'react';
import styled from 'styled-components';

import { assertIsUnreachable } from '@app/base/utils/assert.util';
import { Box } from '@app/ui/components-library/Box';
import { DESIGN_TOKENS } from '@app/ui/components-library/DesignTokenContext';

type VisualKeyProps = IconVisualKey | CharVisualKey;

type IconVisualKey = {
  children: React.ReactNode;
  type: 'icon';
  contentSize?: undefined;
};

type CharVisualKey = {
  children: React.ReactNode;
  type: 'char';
  contentSize: 'sm' | 'md';
};

export const VisualKey: React.FC<VisualKeyProps> = (props) => {
  const { children } = props;

  return (
    <VisualKeyRoot styleProps={props}>
      <VisualKeyChild styleProps={props}>{children}</VisualKeyChild>
    </VisualKeyRoot>
  );
};

type StyleProps = VisualKeyProps;

const VisualKeyRoot = styled(Box)<{ styleProps: StyleProps }>`
  /* 
   * The visual keys should be a square not exceeding the containers content. We take the current 
   * font size times the line height to get the height of the surrounding content box, and take that 
   * as height and width.
   *
   * It would be great to use height 100% and aspect-ratio 1 instead - this should in theory fill 
   * the parent's content box height and adjust the width accordingly.
   * But it seems like the resulting width of the visual key is not taken into account for the parent, 
   * there is always some spacing issue when trying this solution...
   */
  height: calc(${DESIGN_TOKENS.LINE_HEIGHT} * 1em);
  width: calc(${DESIGN_TOKENS.LINE_HEIGHT} * 1em);
  align-self: center;

  display: flex;
  justify-content: ${({ styleProps }) => (styleProps.type === 'char' ? 'flex-start' : 'center')};
  align-items: ${({ styleProps }) => (styleProps.type === 'char' ? 'flex-start' : 'center')};
  padding-top: ${({ styleProps }) => {
    if (styleProps.type === 'icon') {
      return '3px';
    } else if (styleProps.type === 'char') {
      if (styleProps.contentSize === 'md') {
        return '2px';
      } else {
        return '3px';
      }
    } else {
      assertIsUnreachable(styleProps);
    }
  }};
  padding-left: ${({ styleProps }) => {
    if (styleProps.type === 'icon') {
      return undefined;
    } else if (styleProps.type === 'char') {
      if (styleProps.contentSize === 'md') {
        return '4px';
      } else {
        return '2px';
      }
    } else {
      assertIsUnreachable(styleProps);
    }
  }};
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  color: black;
  background-color: lightgrey;
`;

const VisualKeyChild = styled(Box)<{ styleProps: StyleProps }>`
  font-size: ${({ styleProps }) => {
    if (styleProps.type === 'icon') {
      return '100%';
    } else if (styleProps.type === 'char') {
      if (styleProps.contentSize === 'md') {
        return '80%';
      } else if (styleProps.contentSize === 'sm') {
        return '70%';
      } else {
        assertIsUnreachable(styleProps.contentSize);
      }
    } else {
      assertIsUnreachable(styleProps);
    }
  }};
  line-height: 1;
`;
