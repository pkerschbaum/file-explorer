import { mergeProps } from '@react-aria/utils';
import * as React from 'react';
import { styled } from 'styled-components';
import invariant from 'tiny-invariant';

import { formatter as formatter2 } from '@file-explorer/code-oss-ecma/formatter.util';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';

import { useCwdSegments } from '#pkg/global-state/slices/explorers.hooks';
import { changeCwd } from '#pkg/operations/explorer.operations';
import type { ButtonHandle } from '#pkg/ui/components-library';
import {
  Box,
  Breadcrumbs,
  Button,
  BreadcrumbItem,
  useMenu,
  useBreadcrumbItem,
  KeyboardArrowDownOutlinedIcon,
} from '#pkg/ui/components-library';
import { PRINTED_KEY, MOUSE_BUTTONS } from '#pkg/ui/constants';
import { CwdActionsMenu } from '#pkg/ui/cwd-breadcrumbs/CwdActionsMenu';
import {
  useExplorerId,
  useRegisterExplorerAuxclickHandler,
  useRegisterExplorerShortcuts,
} from '#pkg/ui/explorer-context';

export const CwdBreadcrumbs: React.FC = () => {
  const explorerId = useExplorerId();
  const cwdSegments = useCwdSegments(explorerId);

  const formattedUriSegments = formatter2.uriSegments(cwdSegments.map((segment) => segment.uri));

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
            changeDirectory={() =>
              changeCwd({ explorerId, newCwd: segment.uri, keepExistingCwdSegments: true })
            }
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
    itemProps: {
      isCurrent: isLastSegment,
      elementType: 'button',
      onPress: !isLastSegment ? changeDirectory : undefined,
      onPressEnd: () => {
        invariant(buttonRef.current);
        // workaround: undo focus which is set by react-aria interactions usePress
        buttonRef.current.blur();
      },
    },
  });

  const { triggerProps: menuTriggerProps, menuInstance } = useMenu({
    triggerRef: buttonRef,
    menu: {
      align: 'start',
    },
  });

  const registerShortcutsResult = useRegisterExplorerShortcuts({
    changeDirectoryShortcut: {
      keybindings: isSecondToLastSegment
        ? [
            {
              key: PRINTED_KEY.ARROW_LEFT,
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
              key: PRINTED_KEY.ENTER,
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

  return (
    <BreadcrumbItem isCurrent={isLastSegment}>
      <BreadcrumbButton
        ref={buttonRef}
        handleRef={buttonHandleRef}
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
        ariaButtonProps={isLastSegment ? menuTriggerProps : undefined}
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
