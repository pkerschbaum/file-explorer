import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory } from '@app/operations/explorer.operations';
import {
  ButtonHandle,
  Box,
  Breadcrumbs,
  Button,
  BreadcrumbItem,
  Icon,
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
  const cwd = useCwd(explorerId);

  const cwdSlugsWithFormatting = uriHelper.splitUriIntoSlugs(cwd);

  return (
    <Breadcrumbs>
      {cwdSlugsWithFormatting.map((slug, idx) => {
        const isLastSlug = idx === cwdSlugsWithFormatting.length - 1;
        const isSecondToLastSlug = idx === cwdSlugsWithFormatting.length - 2;

        return (
          <BreadcrumbItem key={uriHelper.getComparisonKey(slug.uri)}>
            <Breadcrumb
              explorerId={explorerId}
              slugFormatted={slug.formatted}
              isLastSlug={isLastSlug}
              isSecondToLastSlug={isSecondToLastSlug}
              changeDirectory={() => changeDirectory(explorerId, slug.uri)}
            />
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
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
  const buttonHandleRef = React.useRef<ButtonHandle>(null);
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
        invariant(buttonHandleRef.current);
        buttonHandleRef.current.triggerSyntheticPress();
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
        invariant(buttonHandleRef.current);
        buttonHandleRef.current.triggerSyntheticPress();
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

  async function handleClick(e: { target: HTMLElement }) {
    if (isLastSlug) {
      setMenuAnchorEl(e.target);
    } else {
      await changeDirectory();
    }
  }

  return (
    <>
      <Button
        handleRef={buttonHandleRef}
        onPress={handleClick}
        endIcon={
          isLastSlug ? (
            <CwdActionsMenuTrigger>
              <Icon Component={ArrowDropDownOutlinedIcon} fontSize="small" />
              {registerShortcutsResult.changeDirectoryShortcut?.icon ??
                registerShortcutsResult.openCwdMenuShortcut?.icon}
            </CwdActionsMenuTrigger>
          ) : (
            registerShortcutsResult.changeDirectoryShortcut?.icon ??
            registerShortcutsResult.openCwdMenuShortcut?.icon
          )
        }
        enableLayoutAnimation
      >
        {slugFormatted}
      </Button>

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

const CwdActionsMenuTrigger = styled(Box)`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing()};
`;
