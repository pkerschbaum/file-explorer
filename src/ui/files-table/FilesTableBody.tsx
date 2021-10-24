import * as React from 'react';
import { Box, Chip, TextField } from '@mui/material';
import styled, { css } from 'styled-components';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { FileForUI, FILE_TYPE } from '@app/domain/types';
import { Stack } from '@app/ui/layouts/Stack';
import { TextBox } from '@app/ui/elements/TextBox';
import { Cell } from '@app/ui/elements/DataTable/Cell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { nativeHostRef } from '@app/operations/global-modules';
import { openFile, removeTags, renameFile } from '@app/operations/file.operations';
import { changeDirectory } from '@app/operations/explorer.operations';
import {
  useExplorerId,
  useFileIdSelectionGotStartedWith,
  useFilesToShow,
  useFileToRenameId,
  useSelectedFiles,
  useSetFileToRenameId,
  useSetIdsOfSelectedFiles,
} from '@app/ui/explorer-context/Explorer.context';
import { KEYS } from '@app/ui/constants';
import { useThemeFileIconClasses } from '@app/ui/hooks/files.hooks';
import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';

const USE_NATIVE_ICON_FOR_REGEX = /(?:exe|ico|dll)/i;

export const FilesTableBody: React.FC = () => {
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

export const FilesTableRow: React.FC<FilesTableRowProps> = ({
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
      onDragStart={(e) => {
        e.preventDefault();
        nativeHostRef.current.startNativeFileDnD({ fsPath: URI.from(fileForRow.uri).fsPath });
      }}
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
        sx={{ fontSize: `${12 / 16}rem` }}
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
