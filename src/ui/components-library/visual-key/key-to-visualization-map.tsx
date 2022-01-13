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
import { PRINTED_KEY } from '@app/ui/constants';

export const KEY_TO_VISUALIZATION_MAP: { [key in PRINTED_KEY]: React.ReactNode } = {
  [PRINTED_KEY.A]: (
    <VisualKey type="char" contentSize="md">
      A
    </VisualKey>
  ),
  [PRINTED_KEY.C]: (
    <VisualKey type="char" contentSize="md">
      C
    </VisualKey>
  ),
  [PRINTED_KEY.N]: (
    <VisualKey type="char" contentSize="md">
      N
    </VisualKey>
  ),
  [PRINTED_KEY.R]: (
    <VisualKey type="char" contentSize="md">
      R
    </VisualKey>
  ),
  [PRINTED_KEY.T]: (
    <VisualKey type="char" contentSize="md">
      T
    </VisualKey>
  ),
  [PRINTED_KEY.X]: (
    <VisualKey type="char" contentSize="md">
      X
    </VisualKey>
  ),
  [PRINTED_KEY.V]: (
    <VisualKey type="char" contentSize="md">
      V
    </VisualKey>
  ),
  [PRINTED_KEY.ARROW_UP]: (
    <VisualKey type="icon">
      <KeyboardArrowUpOutlinedIcon />
    </VisualKey>
  ),
  [PRINTED_KEY.ARROW_RIGHT]: (
    <VisualKey type="icon">
      <KeyboardArrowRightOutlinedIcon />
    </VisualKey>
  ),
  [PRINTED_KEY.ARROW_DOWN]: (
    <VisualKey type="icon">
      <KeyboardArrowDownOutlinedIcon />
    </VisualKey>
  ),
  [PRINTED_KEY.ARROW_LEFT]: (
    <VisualKey type="icon">
      <KeyboardArrowLeftOutlinedIcon />
    </VisualKey>
  ),
  [PRINTED_KEY.PAGE_UP]: (
    <VisualKey type="icon">
      <ArrowCircleUpOutlinedIcon />
    </VisualKey>
  ),
  [PRINTED_KEY.PAGE_DOWN]: (
    <VisualKey type="icon">
      <ArrowCircleDownOutlinedIcon />
    </VisualKey>
  ),
  [PRINTED_KEY.DELETE]: (
    <VisualKey type="char" contentSize="sm">
      Del
    </VisualKey>
  ),
  [PRINTED_KEY.ENTER]: (
    <VisualKey type="icon">
      <KeyboardReturnOutlinedIcon />
    </VisualKey>
  ),
  [PRINTED_KEY.ESC]: (
    <VisualKey type="char" contentSize="sm">
      Esc
    </VisualKey>
  ),
  [PRINTED_KEY.TAB]: (
    <VisualKey type="icon">
      <KeyboardTabOutlinedIcon />
    </VisualKey>
  ),
  [PRINTED_KEY.ALT]: (
    <VisualKey type="char" contentSize="sm">
      Alt
    </VisualKey>
  ),
};
