import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwdSegments } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory } from '@app/operations/explorer.operations';
import {
  ButtonHandle,
  Box,
  Breadcrumbs,
  Button,
  BreadcrumbItem,
  useMenu,
  useBreadcrumbItem,
  KeyboardArrowDownOutlinedIcon,
} from '@app/ui/components-library';
import { KEY, MOUSE_BUTTONS } from '@app/ui/constants';
import { CwdActionsMenu } from '@app/ui/cwd-breadcrumbs/CwdActionsMenu';
import {
  useExplorerId,
  useRegisterExplorerAuxclickHandler,
  useRegisterExplorerShortcuts,
} from '@app/ui/explorer-context';

export const CwdBreadcrumbs: React.FC = () => {
  const explorerId = useExplorerId();
  const cwdSegments = useCwdSegments(explorerId);

  const formattedUriSegments = formatter.uriSegments(cwdSegments.map((segment) => segment.uri));

  return (
    <Breadcrumbs>
      {cwdSegments.map((segment, idx) => {
        const isLastSegment = idx === formattedUriSegments.length - 1;
        const isSecondToLastSegment = idx === formattedUriSegments.length - 2;

        return (
          <Breadcrumb
            key={uriHelper.getComparisonKey(segment.uri)}
            explorerId={explorerId}
            segmentFormatted={formattedUriSegments[idx]}
            isLastSegment={isLastSegment}
            isSecondToLastSegment={isSecondToLastSegment}
            changeDirectory={() => changeDirectory(explorerId, segment.uri)}
          />
        );
      })}
    </Breadcrumbs>
  );
};

type BreadcrumbProps = {
  explorerId: string;
  segmentFormatted: string;
  isLastSegment: boolean;
  isSecondToLastSegment: boolean;
  changeDirectory: () => Promise<void>;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  explorerId,
  segmentFormatted,
  isLastSegment,
  isSecondToLastSegment,
  changeDirectory,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const buttonHandleRef = React.useRef<ButtonHandle>(null);

  const { itemProps } = useBreadcrumbItem({
    itemRef: buttonRef,
    itemProps: { isCurrent: isLastSegment, elementType: 'button' },
  });

  const { triggerProps: menuTriggerProps, menuInstance } = useMenu({
    triggerRef: buttonRef,
    menu: {
      triggerProps: {
        direction: 'bottom',
        align: 'start',
      },
    },
  });

  const registerShortcutsResult = useRegisterExplorerShortcuts({
    changeDirectoryShortcut: {
      keybindings: isSecondToLastSegment
        ? [
            {
              key: KEY.ARROW_LEFT,
              modifiers: {
                ctrl: 'NOT_SET',
                alt: 'SET',
              },
            },
          ]
        : [],
      handler: () => {
        invariant(buttonHandleRef.current);
        buttonHandleRef.current.triggerSyntheticPress();
      },
    },
    openCwdMenuShortcut: {
      keybindings: isLastSegment
        ? [
            {
              key: KEY.ENTER,
              modifiers: {
                ctrl: 'NOT_SET',
                alt: 'SET',
              },
            },
          ]
        : [],
      handler: () => {
        invariant(buttonHandleRef.current);
        buttonHandleRef.current.triggerSyntheticPress();
      },
    },
  });

  /*
   * "auxclick" event is fired when the "back" button on a mouse (e.g. Logitech MX Master 2) is clicked.
   */
  useRegisterExplorerAuxclickHandler(
    !isSecondToLastSegment
      ? []
      : [{ condition: (e) => e.button === MOUSE_BUTTONS.BACK, handler: changeDirectory }],
  );

  async function handleClick(e: PressEvent) {
    if (isLastSegment) {
      menuTriggerProps.onPress?.(e);
    } else {
      await changeDirectory();
    }
  }

  return (
    <BreadcrumbItem isCurrent={isLastSegment}>
      <BreadcrumbButton
        ref={buttonRef}
        handleRef={buttonHandleRef}
        onPress={handleClick}
        endIcon={
          isLastSegment ? (
            <CwdActionsMenuTrigger>
              <KeyboardArrowDownOutlinedIcon fontSize="sm" />
              {registerShortcutsResult.changeDirectoryShortcut?.icon ??
                registerShortcutsResult.openCwdMenuShortcut?.icon}
            </CwdActionsMenuTrigger>
          ) : (
            registerShortcutsResult.changeDirectoryShortcut?.icon ??
            registerShortcutsResult.openCwdMenuShortcut?.icon
          )
        }
        enableLayoutAnimation
        ariaButtonProps={menuTriggerProps}
        /* do not set "aria-disabled" for the last segment */
        {...mergeProps(itemProps, { 'aria-disabled': false })}
      >
        {segmentFormatted}
      </BreadcrumbButton>

      {isLastSegment && <CwdActionsMenu explorerId={explorerId} menuInstance={menuInstance} />}
    </BreadcrumbItem>
  );
};

const BreadcrumbButton = styled(Button)`
  min-width: 0;
`;

const CwdActionsMenuTrigger = styled(Box)`
  display: flex;
  align-items: stretch;
  gap: var(--spacing-2);
`;
