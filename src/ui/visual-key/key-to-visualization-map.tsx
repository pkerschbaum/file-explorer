import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import KeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';
import * as React from 'react';

import { KEY } from '@app/ui/constants';
import { VisualKey } from '@app/ui/visual-key';

const visualKeyFontSize = 'inherit';
export const KEY_TO_VISUALIZATION_MAP: { [key in KEY]: React.ReactNode } = {
  [KEY.A]: <VisualKey>A</VisualKey>,
  [KEY.C]: <VisualKey>C</VisualKey>,
  [KEY.N]: <VisualKey>N</VisualKey>,
  [KEY.R]: <VisualKey>R</VisualKey>,
  [KEY.T]: <VisualKey>T</VisualKey>,
  [KEY.X]: <VisualKey>X</VisualKey>,
  [KEY.V]: <VisualKey>V</VisualKey>,
  [KEY.ARROW_UP]: (
    <VisualKey type="icon">
      <KeyboardArrowUpOutlinedIcon sx={{ fontSize: visualKeyFontSize }} />
    </VisualKey>
  ),
  [KEY.ARROW_RIGHT]: (
    <VisualKey type="icon">
      <KeyboardArrowRightOutlinedIcon sx={{ fontSize: visualKeyFontSize }} />
    </VisualKey>
  ),
  [KEY.ARROW_DOWN]: (
    <VisualKey type="icon">
      <KeyboardArrowDownOutlinedIcon sx={{ fontSize: visualKeyFontSize }} />
    </VisualKey>
  ),
  [KEY.ARROW_LEFT]: (
    <VisualKey type="icon">
      <KeyboardArrowLeftOutlinedIcon sx={{ fontSize: visualKeyFontSize }} />
    </VisualKey>
  ),
  [KEY.PAGE_UP]: (
    <VisualKey type="icon">
      <ArrowCircleUpOutlinedIcon sx={{ fontSize: visualKeyFontSize }} />
    </VisualKey>
  ),
  [KEY.PAGE_DOWN]: (
    <VisualKey type="icon">
      <ArrowCircleDownOutlinedIcon sx={{ fontSize: visualKeyFontSize }} />
    </VisualKey>
  ),
  [KEY.DELETE]: <VisualKey fontSize="sm">Del</VisualKey>,
  [KEY.ENTER]: (
    <VisualKey type="icon">
      <KeyboardReturnOutlinedIcon sx={{ fontSize: visualKeyFontSize }} />
    </VisualKey>
  ),
  [KEY.ESC]: <VisualKey fontSize="sm">Esc</VisualKey>,
  [KEY.TAB]: (
    <VisualKey type="icon">
      <KeyboardTabOutlinedIcon sx={{ fontSize: visualKeyFontSize }} />
    </VisualKey>
  ),
  [KEY.ALT]: <VisualKey fontSize="sm">Alt</VisualKey>,
};
