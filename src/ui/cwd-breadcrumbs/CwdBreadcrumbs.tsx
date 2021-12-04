import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { Box, Breadcrumbs } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory } from '@app/operations/explorer.operations';
import { KEY, MOUSE_BUTTONS } from '@app/ui/constants';
import { CwdActionsMenu } from '@app/ui/cwd-breadcrumbs/CwdActionsMenu';
import { ActionButton, ActionButtonRef } from '@app/ui/elements/ActionButton';
import {
  useExplorerId,
  useRegisterExplorerAuxclickHandler,
  useRegisterExplorerShortcuts,
} from '@app/ui/explorer-context';

export const CwdBreadcrumbs: React.FC = () => {
  const explorerId = useExplorerId();
  const cwd = useCwd(explorerId);

  const cwdSlugsWithFormatting = uriHelper.splitUriIntoSlugs(cwd);

  return (
    <StyledBreadcrumbs maxItems={999}>
      {cwdSlugsWithFormatting.map((slug, idx) => {
        const isLastSlug = idx === cwdSlugsWithFormatting.length - 1;
        const isSecondToLastSlug = idx === cwdSlugsWithFormatting.length - 2;

        return (
          <Breadcrumb
            key={uriHelper.getComparisonKey(slug.uri)}
            explorerId={explorerId}
            slugFormatted={slug.formatted}
            isLastSlug={isLastSlug}
            isSecondToLastSlug={isSecondToLastSlug}
            changeDirectory={() => changeDirectory(explorerId, slug.uri)}
          />
        );
      })}
    </StyledBreadcrumbs>
  );
};

type BreadcrumbProps = {
  explorerId: string;
  slugFormatted: string;
  isLastSlug: boolean;
  isSecondToLastSlug: boolean;
  changeDirectory: () => Promise<void>;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  explorerId,
  slugFormatted,
  isLastSlug,
  isSecondToLastSlug,
  changeDirectory,
}) => {
  const actionButtonRef = React.useRef<ActionButtonRef>(null);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(null);

  const registerShortcutsResult = useRegisterExplorerShortcuts({
    changeDirectoryShortcut: {
      keybindings: isSecondToLastSlug
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
        invariant(actionButtonRef.current);
        actionButtonRef.current.triggerSyntheticClick();
      },
    },
    openCwdMenuShortcut: {
      keybindings: isLastSlug
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
        invariant(actionButtonRef.current);
        actionButtonRef.current.triggerSyntheticClick();
      },
    },
  });

  /*
   * "auxclick" event is fired when the "back" button on a mouse (e.g. Logitech MX Master 2) is clicked.
   */
  useRegisterExplorerAuxclickHandler(
    !isSecondToLastSlug
      ? []
      : [{ condition: (e) => e.button === MOUSE_BUTTONS.BACK, handler: changeDirectory }],
  );

  async function handleClick(e: React.MouseEvent<HTMLElement>) {
    if (isLastSlug) {
      setMenuAnchorEl(e.currentTarget);
    } else {
      await changeDirectory();
    }
  }

  return (
    <>
      <ActionButton
        ref={actionButtonRef}
        onClick={handleClick}
        endIcon={
          isLastSlug ? (
            <CwdActionsMenuTrigger>
              <ArrowDropDownOutlinedIcon fontSize="small" />
              {registerShortcutsResult.changeDirectoryShortcut?.icon ??
                registerShortcutsResult.openCwdMenuShortcut?.icon}
            </CwdActionsMenuTrigger>
          ) : (
            registerShortcutsResult.changeDirectoryShortcut?.icon ??
            registerShortcutsResult.openCwdMenuShortcut?.icon
          )
        }
      >
        {slugFormatted}
      </ActionButton>

      {isLastSlug && (
        <CwdActionsMenu
          explorerId={explorerId}
          anchorEl={menuAnchorEl}
          onClose={() => setMenuAnchorEl(null)}
        />
      )}
    </>
  );
};

const StyledBreadcrumbs = styled(Breadcrumbs)`
  & > .MuiBreadcrumbs-ol {
    gap: ${(props) => props.theme.spacing()};
  }

  & > .MuiBreadcrumbs-ol .MuiBreadcrumbs-separator {
    margin: 0;
  }

  & > .MuiBreadcrumbs-ol .MuiBreadcrumbs-li > * {
    min-width: 0;
  }
`;

const CwdActionsMenuTrigger = styled(Box)`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing()};
`;
