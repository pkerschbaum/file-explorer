import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Breadcrumbs, Button } from '@mui/material';
import { posix, win32 } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { isWindows } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import styled from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory } from '@app/operations/explorer.operations';
import { CwdActionsMenu } from '@app/ui/cwd-breadcrumbs/CwdActionsMenu';
import { useExplorerId } from '@app/ui/explorer-context/ExplorerDerivedValues.context';

export const BREADCRUMBS_GRID_AREA = 'breadcrumbs';

export const CwdBreadcrumbs: React.FC = () => {
  const explorerId = useExplorerId();
  const cwd = useCwd(explorerId);

  const cwdStringifiedParts = URI.from(cwd)
    .fsPath.split(isWindows ? win32.sep : posix.sep)
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
  grid-area: ${BREADCRUMBS_GRID_AREA};
  padding-right: ${(props) => props.theme.spacing()};
  padding-bottom: ${(props) => props.theme.spacing()};

  margin-top: ${(props) => props.theme.spacing(0.5)};
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
