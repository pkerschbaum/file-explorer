import React from 'react';
import styled from 'styled-components';

import { assertThat } from '@app/base/utils/assert.util';
import { Box, MUI_BUTTON_LINE_HEIGHT } from '@app/ui/components-library';

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

export const VisualKey: React.FC<VisualKeyProps> = ({ children, ...delegated }) => (
  <VisualKeyContainer {...delegated}>
    <VisualKeyChild {...delegated}>{children}</VisualKeyChild>
  </VisualKeyContainer>
);

const VisualKeyContainer = styled(Box)<VisualKeyProps>`
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
  height: calc(${MUI_BUTTON_LINE_HEIGHT} * 1em);
  width: calc(${MUI_BUTTON_LINE_HEIGHT} * 1em);
  align-self: center;

  display: flex;
  justify-content: ${(props) => (props.type === 'char' ? 'flex-start' : 'center')};
  align-items: ${(props) => (props.type === 'char' ? 'flex-start' : 'center')};
  padding-top: ${(props) => {
    if (props.type === 'icon') {
      return '3px';
    } else if (props.type === 'char') {
      if (props.contentSize === 'md') {
        return '2px';
      } else {
        return '3px';
      }
    } else {
      assertThat.isUnreachable(props);
    }
  }};
  padding-left: ${(props) => {
    if (props.type === 'icon') {
      return undefined;
    } else if (props.type === 'char') {
      if (props.contentSize === 'md') {
        return '4px';
      } else {
        return '2px';
      }
    } else {
      assertThat.isUnreachable(props);
    }
  }};
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  color: black;
  background-color: lightgrey;
`;

const VisualKeyChild = styled(Box)<VisualKeyProps>`
  font-size: ${(props) => {
    if (props.type === 'icon') {
      return '100%';
    } else if (props.type === 'char') {
      if (props.contentSize === 'md') {
        return '80%';
      } else if (props.contentSize === 'sm') {
        return '70%';
      } else {
        assertThat.isUnreachable(props.contentSize);
      }
    } else {
      assertThat.isUnreachable(props);
    }
  }};
  line-height: 1;
`;
