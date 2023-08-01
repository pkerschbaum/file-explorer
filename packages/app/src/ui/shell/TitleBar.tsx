import type * as React from 'react';
import styled from 'styled-components';

import { windowClose, windowMinimize, windowToggleMaximized } from '#pkg/operations/app.operations';
import { commonStyles } from '#pkg/ui/common-styles';
import {
  Box,
  Button,
  CloseOutlinedIcon,
  FullscreenOutlinedIcon,
  MinimizeOutlinedIcon,
} from '#pkg/ui/components-library';
import { ROOTCONTAINER_PADDING_FACTOR, WINDOW_CONTROLS_WIDTH } from '#pkg/ui/shell/constants';

export const TITLE_BAR_GRID_AREA = 'shell-title-bar';

export const TitleBar: React.FC = () => {
  return (
    <WindowDragRegion>
      <TitleBarWindowControls>
        <TitleBarButton tabIndex={-1} onPress={windowMinimize}>
          <MinimizeOutlinedIcon fontSize="sm" />
        </TitleBarButton>
        <TitleBarButton tabIndex={-1} onPress={windowToggleMaximized}>
          <FullscreenOutlinedIcon fontSize="sm" />
        </TitleBarButton>
        <TitleBarCloseButton tabIndex={-1} onPress={windowClose}>
          <CloseOutlinedIcon fontSize="sm" />
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

  /*
    We want the title bar to be a "drag region" - uses should be able to drag the window around using the title bar.
    See https://www.electronjs.org/docs/latest/tutorial/window-customization#set-custom-draggable-region.
    Additionally we disable pointer events so that if something things overlapping with the title bar 
    (e.g. CWD breadcrumbs) are still clickable. The drag region will still work.
   */
  pointer-events: none;
  -webkit-app-region: drag;
`;

const TitleBarWindowControls = styled(Box)`
  height: 100%;
  width: ${WINDOW_CONTROLS_WIDTH}px;

  display: flex;
  /* re-enable pointer events (which would otherwise be disabled because of the parent setting pointer-events to "none") */
  pointer-events: initial;

  /* hide overflow because of the -1px margin trick applied on the last TitleBarButton to eliminate dead click space */
  overflow: hidden;

  /* https://www.electronjs.org/docs/latest/tutorial/window-customization#set-custom-draggable-region */
  -webkit-app-region: no-drag;
`;

const TitleBarButton = styled(Button)`
  ${commonStyles.layout.flex.shrinkAndFitHorizontal}

  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

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
