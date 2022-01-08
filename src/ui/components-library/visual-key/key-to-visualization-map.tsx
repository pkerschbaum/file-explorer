import * as React from 'react';

import {
  ArrowCircleDownOutlinedIcon,
  ArrowCircleUpOutlinedIcon,
  KeyboardArrowDownOutlinedIcon,
  KeyboardArrowLeftOutlinedIcon,
  KeyboardArrowRightOutlinedIcon,
  KeyboardArrowUpOutlinedIcon,
  KeyboardReturnOutlinedIcon,
  KeyboardTabOutlinedIcon,
} from '@app/ui/components-library/icons';
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
  [KEY.H]: (
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
      <KeyboardArrowUpOutlinedIcon />
    </VisualKey>
  ),
  [KEY.ARROW_RIGHT]: (
    <VisualKey type="icon">
      <KeyboardArrowRightOutlinedIcon />
    </VisualKey>
  ),
  [KEY.ARROW_DOWN]: (
    <VisualKey type="icon">
      <KeyboardArrowDownOutlinedIcon />
    </VisualKey>
  ),
  [KEY.ARROW_LEFT]: (
    <VisualKey type="icon">
      <KeyboardArrowLeftOutlinedIcon />
    </VisualKey>
  ),
  [KEY.PAGE_UP]: (
    <VisualKey type="icon">
      <ArrowCircleUpOutlinedIcon />
    </VisualKey>
  ),
  [KEY.PAGE_DOWN]: (
    <VisualKey type="icon">
      <ArrowCircleDownOutlinedIcon />
    </VisualKey>
  ),
  [KEY.DELETE]: (
    <VisualKey type="char" contentSize="sm">
      Del
    </VisualKey>
  ),
  [KEY.ENTER]: (
    <VisualKey type="icon">
      <KeyboardReturnOutlinedIcon />
    </VisualKey>
  ),
  [KEY.ESC]: (
    <VisualKey type="char" contentSize="sm">
      Esc
    </VisualKey>
  ),
  [KEY.TAB]: (
    <VisualKey type="icon">
      <KeyboardTabOutlinedIcon />
    </VisualKey>
  ),
  [KEY.ALT]: (
    <VisualKey type="char" contentSize="sm">
      Alt
    </VisualKey>
  ),
};
