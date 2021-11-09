/* eslint-disable node/no-process-env -- config.ts is the only place where reading from process.env is allowed */
import { safe_window } from '@app/base/utils/electron.util';

const processEnvToUse = safe_window?.privileged?.processEnv ?? process.env;

const isDevEnviroment = processEnvToUse.NODE_ENV === 'development';

export const config = {
  isDevEnviroment,
  productName: 'file-explorer',
  featureFlags: {
    specificIconsForDirectories: false,
    tags: false,
  },
  showReactQueryDevtools:
    processEnvToUse.ELECTRONAPP_RQDEVTOOLS_ENABLED === 'true' ||
    processEnvToUse.STORYBOOK_RQDEVTOOLS_ENABLED === 'true',
} as const;
