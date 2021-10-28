import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import MinimizeOutlinedIcon from '@mui/icons-material/MinimizeOutlined';
import { Button } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { windowClose, windowMinimize, windowToggleMaximized } from '@app/operations/app.operations';
import { Stack } from '@app/ui/layouts/Stack';
import { ROOTCONTAINER_PADDING_RIGHT_FACTOR } from '@app/ui/shell/constants';

export const TitleBar: React.FC = () => {
  return (
    <WindowDragRegion justifyContent="end">
      <TitleBarWindowControls spacing={0} alignItems="stretch">
        <TitleBarButton onClick={windowMinimize}>
          <MinimizeOutlinedIcon />
        </TitleBarButton>
        <TitleBarButton onClick={windowToggleMaximized}>
          <FullscreenOutlinedIcon />
        </TitleBarButton>
        <TitleBarCloseButton onClick={windowClose}>
          <CloseOutlinedIcon />
        </TitleBarCloseButton>
      </TitleBarWindowControls>
    </WindowDragRegion>
  );
};

const WindowDragRegion = styled(Stack)`
  grid-area: shell-title-bar;

  /* revert padding on the right side introduced by the Shell RootContainer */
  margin-right: ${(props) => props.theme.spacing(-ROOTCONTAINER_PADDING_RIGHT_FACTOR)};

  /* https://www.electronjs.org/docs/latest/tutorial/window-customization#set-custom-draggable-region */
  -webkit-app-region: drag;
`;

const TitleBarWindowControls = styled(Stack)`
  height: 100%;
  justify-self: end;

  /* hide overflow because of the -1px margin trick applied on the last TitleBarButton to eliminate dead click space */
  overflow: hidden;

  /* https://www.electronjs.org/docs/latest/tutorial/window-customization#set-custom-draggable-region */
  -webkit-app-region: no-drag;
`;

const TitleBarButton = styled(Button)`
  min-width: 0;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;
  color: inherit;
  background-color: inherit;
  cursor: default;

  &:last-of-type {
    /* add 1px of negative margin in the top right corner because otherwise, some subtle dead click space is there */
    margin-top: -1px;
    margin-right: -1px;
  }
`;

const TitleBarCloseButton = styled(TitleBarButton)`
  &:hover {
    background-color: ${(props) => props.theme.palette.error.main};
  }
`;
