import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Box, Breadcrumbs, Button, Skeleton } from '@mui/material';
import { posix, win32 } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { isWindows } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import styled from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { changeDirectory } from '@app/operations/explorer.operations';
import { commonStyles } from '@app/ui/Common.styles';
import { CwdActionsMenu } from '@app/ui/cwd-actions/CwdActionsMenu';
import { Cell } from '@app/ui/elements/DataTable/Cell';
import { DataTable, DataTableProps } from '@app/ui/elements/DataTable/DataTable';
import { HeadCell } from '@app/ui/elements/DataTable/HeadCell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import { TableHead } from '@app/ui/elements/DataTable/TableHead';
import { TextBox } from '@app/ui/elements/TextBox';
import { ExplorerActions } from '@app/ui/explorer-actions/ExplorerActions';
import { useDataAvailable } from '@app/ui/explorer-context/Explorer.context';
import { FilesTableBody } from '@app/ui/files-table/FilesTableBody';
import { Stack } from '@app/ui/layouts/Stack';

export const ExplorerPanel: React.FC<{ explorerId: string }> = ({ explorerId }) => {
  const cwd = useCwd(explorerId);
  const dataAvailable = useDataAvailable();

  const cwdStringifiedParts = URI.from(cwd)
    .fsPath.split(isWindows ? win32.sep : posix.sep)
    .filter(check.isNonEmptyString);
  const cwdRootPart = uriHelper.parseUri(cwd.scheme, cwdStringifiedParts[0]);

  return (
    <Stack direction="column" alignItems="stretch" stretchContainer sx={{ height: '100%' }}>
      <BreadcrumbsRow>
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
      </BreadcrumbsRow>

      <ExplorerActions />

      <DataTableContainer>
        <FilesTable>
          <TableHead sx={{ userSelect: 'none' }}>
            <Row>
              <HeadCell>
                <TextBox fontSize="sm" fontBold>
                  Name
                </TextBox>
              </HeadCell>
              <HeadCell>
                <TextBox fontSize="sm" fontBold>
                  Size
                </TextBox>
              </HeadCell>
              <HeadCell>
                <TextBox fontSize="sm" fontBold>
                  Last Modified
                </TextBox>
              </HeadCell>
            </Row>
          </TableHead>

          <TableBody>
            {dataAvailable ? (
              <FilesTableBody />
            ) : (
              <>
                <SkeletonRow />
                <SkeletonRow opacity={0.66} />
                <SkeletonRow opacity={0.33} />
              </>
            )}
          </TableBody>
        </FilesTable>
      </DataTableContainer>
    </Stack>
  );
};

const ForwardClassNameTable: React.FC<DataTableProps & { className?: string }> = ({
  className,
  ...delegated
}) => <DataTable {...delegated} classes={{ ...delegated.classes, table: className }} />;

const FilesTable = styled(ForwardClassNameTable)`
  & thead th:nth-of-type(1),
  & tbody td:nth-of-type(1) {
    width: 100%;
  }
  & thead th,
  & thead th *,
  & tbody td,
  & tbody td * {
    white-space: nowrap;
  }
`;

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

type SkeletonRowProps = {
  opacity?: number;
};

const SkeletonRow: React.FC<SkeletonRowProps> = ({ opacity }) => (
  <Row sx={{ opacity }}>
    <Cell>
      <TextBox fontSize="sm">
        <Skeleton variant="text" width={160} />
      </TextBox>
    </Cell>
    <Cell>
      <TextBox fontSize="sm">
        <Skeleton variant="text" width={40} />
      </TextBox>
    </Cell>
  </Row>
);

const BreadcrumbsRow = styled(Breadcrumbs)`
  margin-top: ${(props) => props.theme.spacing(0.5)};
  margin-bottom: ${(props) => props.theme.spacing()};

  & .MuiBreadcrumbs-li > * {
    min-width: 0;
    padding-inline: ${(props) => props.theme.spacing(1.5)};
  }

  & .MuiBreadcrumbs-li > *:not(button) {
    /* MUI outlined button height */
    height: 30.8px;
    /* compensate for inline border of MUI outlined button */
    padding-inline: calc(${(props) => props.theme.spacing(1.5)} + 1px);

    display: flex;
    align-items: center;
  }
`;

const DataTableContainer = styled(Box)`
  ${commonStyles.flex.shrinkAndFitVertical}
`;
