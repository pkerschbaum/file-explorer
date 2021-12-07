import { darken } from '@mui/material';

import { config } from '@app/config';

export const uiUtils = { darken, generateMotionLayoutId };

const MOTION_LAYOUTID_PREFIX = `${config.productName}motion-layoutid`;
let lastId = 0;
function generateMotionLayoutId() {
  lastId++;
  return `${MOTION_LAYOUTID_PREFIX}-${lastId}`;
}
