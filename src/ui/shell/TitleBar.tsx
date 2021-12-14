import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import MinimizeOutlinedIcon from '@mui/icons-material/MinimizeOutlined';
import * as React from 'react';
import styled from 'styled-components';

import { windowClose, windowMinimize, windowToggleMaximized } from '@app/operations/app.operations';
import { Box, Button } from '@app/ui/components-library';
import { ROOTCONTAINER_PADDING_FACTOR } from '@app/ui/shell/constants';

export const TITLE_BAR_GRID_AREA = 'shell-title-bar';

export const TitleBar: React.FC = () => {
  return (
    <WindowDragRegion>
      <TitleBarWindowControls>
        <TitleBarButton tabIndex={-1} onPress={windowMinimize}>
          <MinimizeOutlinedIcon />
        </TitleBarButton>
        <TitleBarButton tabIndex={-1} onPress={windowToggleMaximized}>
          <FullscreenOutlinedIcon />
        </TitleBarButton>
        <TitleBarCloseButton tabIndex={-1} onPress={windowClose}>
          <CloseOutlinedIcon />
        </TitleBarCloseButton>
      </TitleBarWindowControls>
    </WindowDragRegion>
  );
};

const WindowDragRegion = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: var(--spacing-2);

  grid-area: ${TITLE_BAR_GRID_AREA};

  /* revert padding on left and right side introduced by the Shell RootContainer */
  margin-left: calc(-1 * ${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
  margin-right: calc(-1 * ${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));

  /* https://www.electronjs.org/docs/latest/tutorial/window-customization#set-custom-draggable-region */
  -webkit-app-region: drag;
`;

const TitleBarWindowControls = styled(Box)`
  height: 100%;
  justify-self: end;

  display: flex;

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
  &:not(:disabled):hover {
    background-color: var(--color-error);
  }
`;
