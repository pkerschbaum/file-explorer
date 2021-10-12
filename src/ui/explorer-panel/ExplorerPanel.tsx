import * as React from 'react';
import { Box, Breadcrumbs, Button, Chip, Skeleton, TextField } from '@mui/material';

import { URI } from 'code-oss-file-service/out/vs/base/common/uri';
import { posix, win32 } from 'code-oss-file-service/out/vs/base/common/path';
import { isWindows } from 'code-oss-file-service/out/vs/base/common/platform';

import { styles } from '@app/ui/explorer-panel/ExplorerPanel.styles';
import { commonStyles } from '@app/ui/Common.styles';
import { Stack } from '@app/ui/layouts/Stack';
import { TextBox } from '@app/ui/elements/TextBox';
import { Cell } from '@app/ui/elements/DataTable/Cell';
import { DataTable } from '@app/ui/elements/DataTable/DataTable';
import { HeadCell } from '@app/ui/elements/DataTable/HeadCell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import { TableHead } from '@app/ui/elements/DataTable/TableHead';
import {
  FileForUI,
  useFileProviderCwd,
} from '@app/platform/store/file-provider/file-provider.hooks';
import { useOpenFile, useRemoveTags, useRenameFile } from '@app/platform/file.hooks';
import { useChangeDirectory } from '@app/platform/explorer.hooks';
import {
  useDataAvailable,
  useExplorerId,
  useFileIdSelectionGotStartedWith,
  useFilesToShow,
  useFileToRename,
  useSelectedFiles,
  useSetFileToRenameId,
  useSetIdsOfSelectedFiles,
} from '@app/ui/Explorer.context';
import { FILE_TYPE } from '@app/platform/file-types';
import { KEYS } from '@app/ui/constants';
import { strings } from '@app/base/utils/strings.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { ExplorerActions } from '@app/ui/explorer-actions/ExplorerActions';

const USE_NATIVE_ICON_FOR_REGEX = /(?:exe|ico|dll)/i;

export const ExplorerPanel: React.FC<{ explorerId: string }> = ({ explorerId }) => {
  const cwd = useFileProviderCwd(explorerId);
  const dataAvailable = useDataAvailable();
  const { changeDirectory } = useChangeDirectory(explorerId);

  const cwdStringifiedParts = URI.from(cwd)
    .fsPath.split(isWindows ? win32.sep : posix.sep)
    .filter(strings.isNotNullishOrEmpty);
  const cwdRootPart = uriHelper.parseUri(cwd.scheme, cwdStringifiedParts[0]);

  return (
    <Stack css={commonStyles.fullHeight} direction="column" alignItems="stretch" stretchContainer>
      <ExplorerActions />

      <Stack
        direction="column"
        alignItems="stretch"
        css={[commonStyles.fullHeight, commonStyles.flex.shrinkAndFitVertical]}
      >
        <Breadcrumbs css={styles.cwdBreadcrumbs}>
          {cwdStringifiedParts.map((pathPart, idx) => {
            const isFirstPart = idx === 0;
            const isLastPart = idx === cwdStringifiedParts.length - 1;
            const pathPartFormatted = isFirstPart
              ? `${pathPart[0].toLocaleUpperCase()}${pathPart.slice(1)}`
              : pathPart;

            function handleClick() {
              changeDirectory(
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
        </Breadcrumbs>

        <DataTable>
          <TableHead>
            <HeadCell>
              <TextBox fontSize="sm">Name</TextBox>
            </HeadCell>
            <HeadCell>
              <TextBox fontSize="sm">Size</TextBox>
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
      </Stack>
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
  const fileToRename = useFileToRename();
  const fileIdSelectionGotStartedWith = useFileIdSelectionGotStartedWith();
  const setIdsOfSelectedFiles = useSetIdsOfSelectedFiles();
  const setFileToRenameId = useSetFileToRenameId();
  const { changeDirectory } = useChangeDirectory(explorerId);
  const { openFile } = useOpenFile();
  const { renameFile } = useRenameFile();
  const { removeTags } = useRemoveTags();

  const [nativeIconDataURL, setNativeIconDataURL] = React.useState<string | undefined>();

  const fsPath = URI.from(fileForRow.uri).fsPath;
  const extension = fileForRow.extension;
  React.useEffect(
    function fetchIcon() {
      if (
        strings.isNullishOrEmpty(fsPath) ||
        strings.isNullishOrEmpty(extension) ||
        !USE_NATIVE_ICON_FOR_REGEX.test(extension)
      ) {
        return;
      }

      async function doFetchIcon() {
        const icon = await window.preload.getNativeFileIconDataURL({ fsPath });
        setNativeIconDataURL(icon);
      }
      doFetchIcon();
    },
    [fsPath, extension],
  );

  function openFileOrDirectory(file: FileForUI) {
    if (file.fileType === FILE_TYPE.DIRECTORY) {
      changeDirectory(file.uri.path);
    } else {
      openFile(file.uri);
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
        window.preload.onFileDragStart({ fsPath: URI.from(fileForRow.uri).fsPath })
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
          <Stack
            css={[commonStyles.fullWidth, styles.fileIcon]}
            className={nativeIconDataURL ? undefined : fileForRow.iconClasses.join(' ')}
          >
            {nativeIconDataURL && (
              <Box css={styles.icon}>
                <img
                  src={nativeIconDataURL}
                  alt="application icon"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              </Box>
            )}
            {fileToRename && fileToRename.id === fileForRow.id ? (
              <RenameInput
                file={fileForRow}
                onSubmit={(newName) => renameFileHandler(fileForRow, newName)}
                abortRename={abortRename}
              />
            ) : (
              <TextBox fontSize="sm">{formatter.file(fileForRow)}</TextBox>
            )}
          </Stack>

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
      css={commonStyles.fullWidth}
      onSubmit={() => onSubmit(value)}
      onBlur={abortRename}
      onKeyDown={(e) => {
        if (e.key === KEYS.ESC) {
          abortRename();
        }
      }}
    >
      <TextField
        fullWidth
        autoFocus
        label="Rename"
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
