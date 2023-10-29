/* eslint-disable n/no-process-env -- config.ts is the only place where reading from process.env is allowed */

const isDevEnviroment = process.env.NODE_ENV === 'development';

export const config = {
  isDevEnviroment,
  productName: 'file-explorer',
  featureFlags: {
    specificIconsForDirectories: false,
    tags: false,
  },
  showReactQueryDevtools:
    typeof process.env.STORYBOOK_RQDEVTOOLS_ENABLED === 'string'
      ? process.env.STORYBOOK_RQDEVTOOLS_ENABLED === 'true'
      : isDevEnviroment,
} as const;
