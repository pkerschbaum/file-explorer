import { Box, Chip, TextField } from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { FileForUI, FILE_TYPE } from '@app/domain/types';
import { changeDirectory } from '@app/operations/explorer.operations';
import { openFile, removeTags, renameFile } from '@app/operations/file.operations';
import { nativeHostRef } from '@app/operations/global-modules';
import { KEYS } from '@app/ui/constants';
import { Cell } from '@app/ui/elements/DataTable/Cell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { TextBox } from '@app/ui/elements/TextBox';
import {
  useExplorerId,
  useFileIdSelectionGotStartedWith,
  useFilesToShow,
  useFileToRenameId,
  useSelectedFiles,
  useSetFileToRenameId,
  useSetIdsOfSelectedFiles,
} from '@app/ui/explorer-context/Explorer.context';
import { useThemeFileIconClasses } from '@app/ui/hooks/files.hooks';
import { Stack } from '@app/ui/layouts/Stack';

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
      data-window-keydownhandlers-enabled="true"
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
        <RowContent>
          <Stack spacing={0} sx={{ width: '100%' }}>
            <IconWrapper className={nativeIconDataURL ? undefined : themeFileIconClasses}>
              {nativeIconDataURL && (
                <img
                  src={nativeIconDataURL}
                  alt="application icon"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              )}
            </IconWrapper>
            {fileToRenameId === fileForRow.id ? (
              <RenameInput
                file={fileForRow}
                onSubmit={(newName) => renameFileHandler(fileForRow, newName)}
                abortRename={abortRename}
              />
            ) : (
              <FileNameFormatted fontSize="sm">{formatter.file(fileForRow)}</FileNameFormatted>
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
        </RowContent>
      </Cell>
      <Cell>
        {fileForRow.fileType === FILE_TYPE.FILE &&
          fileForRow.size !== undefined &&
          formatter.bytes(fileForRow.size)}
      </Cell>
      <Cell>{fileForRow.mtime !== undefined && formatter.date(fileForRow.mtime)}</Cell>
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
      <FileNameTextField
        fullWidth
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          abortRename();
        }}
        onKeyDown={(e) => {
          if (e.key === KEYS.ESC) {
            abortRename();
          }
        }}
      />
    </form>
  );
};

const RowContent = styled(Stack)`
  height: ${(props) => props.theme.sizes.fileRow.height};
`;

const FileNameFormattedSpacingFactor = 0.5;

const FileNameTextField = styled(TextField)`
  & .MuiInputBase-root {
    font-size: ${12 / 16}rem;
    margin-left: ${(props) => props.theme.spacing(FileNameFormattedSpacingFactor)};
  }

  & .MuiInputBase-input {
    padding-left: ${(props) => props.theme.spacing(FileNameFormattedSpacingFactor)};
    padding-top: 5px;
    padding-bottom: 4px;
  }
`;

const FileNameFormatted = styled(TextBox)`
  padding-left: ${(props) => props.theme.spacing(FileNameFormattedSpacingFactor * 2)};
`;

const iconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  max-width: 24px;
  height: 24px;
  max-height: 24px;
`;

const IconWrapper = styled(Box)`
  ${iconStyles}

  ::before {
    ${iconStyles}

    background-size: 24px 24px;
    background-repeat: no-repeat;
    -webkit-font-smoothing: antialiased;
  }
`;
