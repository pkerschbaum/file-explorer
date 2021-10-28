import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Breadcrumbs, Button } from '@mui/material';
import { posix, win32 } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { isWindows } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import styled from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory } from '@app/operations/explorer.operations';
import { CwdActionsMenu } from '@app/ui/cwd-breadcrumbs/CwdActionsMenu';
import { useExplorerId } from '@app/ui/explorer-context/ExplorerDerivedValues.context';

export const EXPLORER_CWDBREADCRUMBS_GRID_AREA = 'shell-explorer-cwd-breadcrumbs';

export const CwdBreadcrumbs: React.FC = () => {
  const explorerId = useExplorerId();
  const cwd = useCwd(explorerId);

  const cwdStringifiedParts = formatter
    .folderPath(cwd)
    .split(isWindows ? win32.sep : posix.sep)
    .filter(check.isNonEmptyString);
  const cwdRootPart = uriHelper.parseUri(cwd.scheme, cwdStringifiedParts[0]);

  return (
    <StyledBreadcrumbs maxItems={999}>
      {cwdStringifiedParts.map((pathPart, idx) => {
        const isFirstPart = idx === 0;
        const isLastPart = idx === cwdStringifiedParts.length - 1;

        return (
          <Breadcrumb
            key={pathPart}
            pathPart={pathPart}
            isFirstPart={isFirstPart}
            isLastPart={isLastPart}
            changeDirectory={() =>
              changeDirectory(
                explorerId,
                URI.joinPath(
                  cwdRootPart,
                  ...(isFirstPart ? ['/'] : cwdStringifiedParts.slice(1, idx + 1)),
                ).path,
              )
            }
          />
        );
      })}
    </StyledBreadcrumbs>
  );
};

type BreadcrumbProps = {
  pathPart: string;
  isFirstPart: boolean;
  isLastPart: boolean;
  changeDirectory: () => Promise<void>;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  pathPart,
  isFirstPart,
  isLastPart,
  changeDirectory,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(null);

  const pathPartFormatted =
    isFirstPart && isWindows ? `${pathPart[0].toLocaleUpperCase()}${pathPart.slice(1)}` : pathPart;

  async function handleClick(e: React.MouseEvent<HTMLElement>) {
    if (isLastPart) {
      setMenuAnchorEl(e.currentTarget);
    } else {
      await changeDirectory();
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleClick}
        endIcon={!isLastPart ? undefined : <KeyboardArrowDownOutlined />}
      >
        {pathPartFormatted}
      </Button>
      {isLastPart && (
        <CwdActionsMenu anchorEl={menuAnchorEl} onClose={() => setMenuAnchorEl(null)} />
      )}
    </>
  );
};

const StyledBreadcrumbs = styled(Breadcrumbs)`
  /* Overlap the CwdBreadcrumbs with the WindowDragRegion above it */
  margin-top: -20px;
  -webkit-app-region: no-drag;

  width: fit-content;
  grid-area: ${EXPLORER_CWDBREADCRUMBS_GRID_AREA};
  padding-bottom: ${(props) => props.theme.spacing()};
  margin-bottom: ${(props) => props.theme.spacing()};

  & > .MuiBreadcrumbs-ol {
    gap: ${(props) => props.theme.spacing()};
  }

  & > .MuiBreadcrumbs-ol .MuiBreadcrumbs-separator {
    margin: 0;
  }

  & > .MuiBreadcrumbs-ol .MuiBreadcrumbs-li > * {
    min-width: 0;
    padding-inline: ${(props) => props.theme.spacing(1.5)};
  }

  & > .MuiBreadcrumbs-ol .MuiBreadcrumbs-li > *:not(button) {
    /* MUI outlined button height */
    height: 30.8px;
    /* compensate for inline border of MUI outlined button */
    padding-inline: calc(${(props) => props.theme.spacing(1.5)} + 1px);

    display: flex;
    align-items: center;
  }
`;
