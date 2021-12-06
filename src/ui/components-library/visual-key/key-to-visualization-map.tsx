import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import KeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';
import * as React from 'react';

import { VisualKey } from '@app/ui/components-library/visual-key';
import { KEY } from '@app/ui/constants';

export const KEY_TO_VISUALIZATION_MAP: { [key in KEY]: React.ReactNode } = {
  [KEY.A]: (
    <VisualKey type="char" contentSize="md">
      A
    </VisualKey>
  ),
  [KEY.C]: (
    <VisualKey type="char" contentSize="md">
      C
    </VisualKey>
  ),
  [KEY.N]: (
    <VisualKey type="char" contentSize="md">
      N
    </VisualKey>
  ),
  [KEY.R]: (
    <VisualKey type="char" contentSize="md">
      R
    </VisualKey>
  ),
  [KEY.T]: (
    <VisualKey type="char" contentSize="md">
      T
    </VisualKey>
  ),
  [KEY.X]: (
    <VisualKey type="char" contentSize="md">
      X
    </VisualKey>
  ),
  [KEY.V]: (
    <VisualKey type="char" contentSize="md">
      V
    </VisualKey>
  ),
  [KEY.ARROW_UP]: (
    <VisualKey type="icon">
      <KeyboardArrowUpOutlinedIcon fontSize="inherit" />
    </VisualKey>
  ),
  [KEY.ARROW_RIGHT]: (
    <VisualKey type="icon">
      <KeyboardArrowRightOutlinedIcon fontSize="inherit" />
    </VisualKey>
  ),
  [KEY.ARROW_DOWN]: (
    <VisualKey type="icon">
      <KeyboardArrowDownOutlinedIcon fontSize="inherit" />
    </VisualKey>
  ),
  [KEY.ARROW_LEFT]: (
    <VisualKey type="icon">
      <KeyboardArrowLeftOutlinedIcon fontSize="inherit" />
    </VisualKey>
  ),
  [KEY.PAGE_UP]: (
    <VisualKey type="icon">
      <ArrowCircleUpOutlinedIcon fontSize="inherit" />
    </VisualKey>
  ),
  [KEY.PAGE_DOWN]: (
    <VisualKey type="icon">
      <ArrowCircleDownOutlinedIcon fontSize="inherit" />
    </VisualKey>
  ),
  [KEY.DELETE]: (
    <VisualKey type="char" contentSize="sm">
      Del
    </VisualKey>
  ),
  [KEY.ENTER]: (
    <VisualKey type="icon">
      <KeyboardReturnOutlinedIcon fontSize="inherit" />
    </VisualKey>
  ),
  [KEY.ESC]: (
    <VisualKey type="char" contentSize="sm">
      Esc
    </VisualKey>
  ),
  [KEY.TAB]: (
    <VisualKey type="icon">
      <KeyboardTabOutlinedIcon fontSize="inherit" />
    </VisualKey>
  ),
  [KEY.ALT]: (
    <VisualKey type="char" contentSize="sm">
      Alt
    </VisualKey>
  ),
};
