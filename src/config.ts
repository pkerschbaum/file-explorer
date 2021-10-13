/* eslint-disable node/no-process-env -- config.ts is the only place where reading from process.env is allowed */

const isDevEnviroment = process.env.NODE_ENV === 'development';

export const config = {
  isDevEnviroment,
  featureFlags: {
    tags: false,
  },
} as const;
