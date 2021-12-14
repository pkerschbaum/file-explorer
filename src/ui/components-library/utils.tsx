import { config } from '@app/config';

export const componentLibraryUtils = { generateMotionLayoutId };

const MOTION_LAYOUTID_PREFIX = `${config.productName}motion-layoutid`;
let lastId = 0;
function generateMotionLayoutId() {
  lastId++;
  return `${MOTION_LAYOUTID_PREFIX}-${lastId}`;
}

export type DataAttributes = Partial<{
  [attribute: `data-${string}`]: string;
}>;
