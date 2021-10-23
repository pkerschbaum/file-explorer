import * as React from 'react';
import { Box, Breadcrumbs, Button, Chip, Skeleton, TextField } from '@mui/material';
import styled, { css } from 'styled-components';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { posix, win32 } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { isWindows } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';

import { FileForUI, FILE_TYPE } from '@app/domain/types';
import { commonStyles } from '@app/ui/Common.styles';
import { Stack } from '@app/ui/layouts/Stack';
import { TextBox } from '@app/ui/elements/TextBox';
import { Cell } from '@app/ui/elements/DataTable/Cell';
import { DataTable } from '@app/ui/elements/DataTable/DataTable';
import { HeadCell } from '@app/ui/elements/DataTable/HeadCell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import { TableHead } from '@app/ui/elements/DataTable/TableHead';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { nativeHostRef } from '@app/operations/global-modules';
import { openFile, removeTags, renameFile } from '@app/operations/file.operations';
import { changeDirectory } from '@app/operations/explorer.operations';
import {
  useDataAvailable,
  useExplorerId,
  useFileIdSelectionGotStartedWith,
  useFilesToShow,
  useFileToRenameId,
  useSelectedFiles,
  useSetFileToRenameId,
  useSetIdsOfSelectedFiles,
} from '@app/ui/Explorer.context';
import { KEYS } from '@app/ui/constants';
import { useThemeFileIconClasses } from '@app/ui/hooks/files.hooks';
import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { ExplorerActions } from '@app/ui/explorer-actions/ExplorerActions';

const USE_NATIVE_ICON_FOR_REGEX = /(?:exe|ico|dll)/i;

export const ExplorerPanel: React.FC<{ explorerId: string }> = ({ explorerId }) => {
  const cwd = useCwd(explorerId);
  const dataAvailable = useDataAvailable();

  const cwdStringifiedParts = URI.from(cwd)
    .fsPath.split(isWindows ? win32.sep : posix.sep)
    .filter(check.isNonEmptyString);
  const cwdRootPart = uriHelper.parseUri(cwd.scheme, cwdStringifiedParts[0]);

  return (
    <Stack direction="column" alignItems="stretch" stretchContainer sx={{ height: '100%' }}>
      <ExplorerActions />

      <BreadcrumbsAndFileTable direction="column" alignItems="stretch">
        <BreadcrumbsRow>
          {cwdStringifiedParts.map((pathPart, idx) => {
            const isFirstPart = idx === 0;
            const isLastPart = idx === cwdStringifiedParts.length - 1;
            const pathPartFormatted = isFirstPart
              ? `${pathPart[0].toLocaleUpperCase()}${pathPart.slice(1)}`
              : pathPart;

            async function handleClick() {
              await changeDirectory(
                explorerId,
                URI.joinPath(
                  cwdRootPart,
                  ...(isFirstPart ? ['/'] : cwdStringifiedParts.slice(1, idx + 1)),
                ).path,
              );
            }

            return !isLastPart ? (
              <Button key={pathPart} variant="outlined" color="inherit" onClick={handleClick}>
                {pathPartFormatted}
              </Button>
            ) : (
              <TextBox key={pathPart} fontSize="sm" boxProps={{ component: 'div' }}>
                {pathPartFormatted}
              </TextBox>
            );
          })}
        </BreadcrumbsRow>

        <DataTable>
          <TableHead>
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
        </DataTable>
      </BreadcrumbsAndFileTable>
    </Stack>
  );
};

const FilesTableBody: React.FC = () => {
  const filesToShow = useFilesToShow();

  return (
    <>
      {filesToShow.map((fileForRow, idxOfFileForRow) => (
        <FilesTableRow
          key={fileForRow.id}
          filesToShow={filesToShow}
          fileForRow={fileForRow}
          idxOfFileForRow={idxOfFileForRow}
        />
      ))}
    </>
  );
};

type FilesTableRowProps = {
  filesToShow: FileForUI[];
  fileForRow: FileForUI;
  idxOfFileForRow: number;
};

const FilesTableRow: React.FC<FilesTableRowProps> = ({
  filesToShow,
  fileForRow,
  idxOfFileForRow,
}) => {
  const explorerId = useExplorerId();
  const selectedFiles = useSelectedFiles();
  const fileToRenameId = useFileToRenameId();
  const fileIdSelectionGotStartedWith = useFileIdSelectionGotStartedWith();
  const setIdsOfSelectedFiles = useSetIdsOfSelectedFiles();
  const setFileToRenameId = useSetFileToRenameId();

  const [nativeIconDataURL, setNativeIconDataURL] = React.useState<string | undefined>();

  const themeFileIconClasses = useThemeFileIconClasses(fileForRow);

  const fsPath = URI.from(fileForRow.uri).fsPath;
  const extension = fileForRow.extension;
  React.useEffect(
    function fetchIcon() {
      if (
        check.isEmptyString(fsPath) ||
        check.isNullishOrEmptyString(extension) ||
        !USE_NATIVE_ICON_FOR_REGEX.test(extension)
      ) {
        return;
      }

      async function doFetchIcon() {
        const icon = await nativeHostRef.current.getNativeFileIconDataURL({ fsPath });
        setNativeIconDataURL(icon);
      }
      void doFetchIcon();
    },
    [fsPath, extension],
  );

  async function openFileOrDirectory(file: FileForUI) {
    if (file.fileType === FILE_TYPE.DIRECTORY) {
      await changeDirectory(explorerId, file.uri.path);
    } else {
      await openFile(file.uri);
    }
  }

  async function renameFileHandler(fileToRename: FileForUI, newName: string) {
    await renameFile(fileToRename.uri, newName);
    setFileToRenameId(undefined);
  }

  function abortRename() {
    setFileToRenameId(undefined);
  }

  function selectFiles(files: FileForUI[]) {
    setIdsOfSelectedFiles(files.map((file) => file.id));
  }

  const fileIsSelected = !!selectedFiles.find((file) => file.id === fileForRow.id);

  return (
    <Row
      key={fileForRow.id}
      draggable
      onDragStart={() =>
        nativeHostRef.current.startNativeFileDnD({ fsPath: URI.from(fileForRow.uri).fsPath })
      }
      onClick={(e) => {
        if (e.ctrlKey) {
          // toggle selection of file which was clicked on
          if (fileIsSelected) {
            selectFiles(selectedFiles.filter((selectedFile) => selectedFile.id !== fileForRow.id));
          } else {
            selectFiles([...selectedFiles, fileForRow]);
          }
        } else if (e.shiftKey) {
          // select range of files
          if (fileIdSelectionGotStartedWith === undefined) {
            return;
          }

          const idxSelectionGotStartedWith = filesToShow.findIndex(
            (file) => file.id === fileIdSelectionGotStartedWith,
          );
          let idxSelectFrom = idxSelectionGotStartedWith;
          let idxSelectTo = idxOfFileForRow;
          if (idxSelectTo < idxSelectFrom) {
            // swap values
            const tmp = idxSelectFrom;
            idxSelectFrom = idxSelectTo;
            idxSelectTo = tmp;
          }

          const filesToSelect = filesToShow.filter(
            (_, idx) => idx >= idxSelectFrom && idx <= idxSelectTo,
          );
          selectFiles(filesToSelect);
        } else {
          // no ctrl or shift key pressed --> just select the file which was clicked on
          selectFiles([fileForRow]);
        }
      }}
      onDoubleClick={() => openFileOrDirectory(fileForRow)}
      selected={fileIsSelected}
    >
      <Cell>
        <Stack>
          <FileIcon className={nativeIconDataURL ? undefined : themeFileIconClasses}>
            {nativeIconDataURL && (
              <IconWrapper>
                <img
                  src={nativeIconDataURL}
                  alt="application icon"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              </IconWrapper>
            )}
            {fileToRenameId === fileForRow.id ? (
              <RenameInput
                file={fileForRow}
                onSubmit={(newName) => renameFileHandler(fileForRow, newName)}
                abortRename={abortRename}
              />
            ) : (
              <TextBox fontSize="sm">{formatter.file(fileForRow)}</TextBox>
            )}
          </FileIcon>

          {fileForRow.tags.map((tag) => (
            <Chip
              key={tag.id}
              style={{ backgroundColor: tag.colorHex }}
              variant="outlined"
              size="small"
              label={tag.name}
              onDelete={() => removeTags([fileForRow.uri], [tag.id])}
            />
          ))}
        </Stack>
      </Cell>
      <Cell>
        {fileForRow.fileType === FILE_TYPE.FILE &&
          fileForRow.size !== undefined &&
          formatter.bytes(fileForRow.size)}
      </Cell>
    </Row>
  );
};

type RenameInputProps = {
  file: FileForUI;
  onSubmit: (newName: string) => void;
  abortRename: () => void;
};

const RenameInput: React.FC<RenameInputProps> = ({ file, onSubmit, abortRename }) => {
  const [value, setValue] = React.useState(formatter.file(file));

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      onBlur={abortRename}
    >
      <TextField
        fullWidth
        autoFocus
        label="Rename"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === KEYS.ESC) {
            abortRename();
          }
        }}
      />
    </form>
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

const BreadcrumbsAndFileTable = styled(Stack)`
  height: 100%;
  ${commonStyles.flex.shrinkAndFitVertical}
`;

const BreadcrumbsRow = styled(Breadcrumbs)`
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

const iconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  max-width: 24px;
  height: 1em;
  max-height: 1em;
`;

const FileIcon = styled(Stack)`
  width: 100%;

  ::before {
    /* icon-theme.ts sets a unwanted font-size, use !important to overrule that*/
    font-size: 2em !important;

    ${iconStyles}

    background-size: 24px 1em;
    background-repeat: no-repeat;
    -webkit-font-smoothing: antialiased;
  }
`;

const IconWrapper = styled(Box)`
  ${iconStyles}
`;
