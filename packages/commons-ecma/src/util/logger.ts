/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { objects } from '@pkerschbaum/commons-ecma/util/objects';

import { CustomError } from '#pkg/util/custom-error';
import type { JsonObject } from '#pkg/util/types.util';

type Logger = {
  debug: <A, B>(
    message: string,
    logPayload?: JsonObject<A>,
    verboseLogPayload?: JsonObject<B>,
  ) => void;
  info: <A, B>(
    message: string,
    logPayload?: JsonObject<A>,
    verboseLogPayload?: JsonObject<B>,
  ) => void;
  warn: <A, B>(
    message: string,
    logPayload?: JsonObject<A>,
    verboseLogPayload?: JsonObject<B>,
  ) => void;
  error: <A, B>(
    message: string,
    error?: unknown,
    logPayload?: JsonObject<A>,
    verboseLogPayload?: JsonObject<B>,
  ) => void;
  group: (groupName: string) => void;
  groupEnd: () => void;
};

export function loggerFactory(
  logWriter: () => Pick<typeof console, 'debug' | 'info' | 'warn' | 'error' | 'group' | 'groupEnd'>,
) {
  return function createLogger(context: string): Logger {
    function extendLog<A, B>(
      message: string,
      logPayload?: JsonObject<A>,
      verboseLogPayload?: JsonObject<B>,
    ) {
      /*
       * if CustomErrors get passed in a payload, extract the data prop of the error and
       * append it to the payload
       */
      const customLogPayload = objects.shallowCopy(logPayload);
      if (customLogPayload !== undefined) {
        for (const [prop, value] of Object.entries(customLogPayload)) {
          if (value instanceof CustomError) {
            customLogPayload[`${prop}_errorData`] = value.data as any;
          }
        }
      }
      const customVerboseLogPayload = objects.shallowCopy(verboseLogPayload);
      if (customVerboseLogPayload !== undefined) {
        for (const [prop, value] of Object.entries(customVerboseLogPayload)) {
          if (value instanceof CustomError) {
            customVerboseLogPayload[`${prop}_errorData`] = value.data as any;
          }
        }
      }

      return {
        message: `[${context}] ${message}`,
        logPayload: customLogPayload,
        verboseLogPayload: customVerboseLogPayload,
      };
    }

    return {
      debug: (...args) => {
        const extendedLog = extendLog(...args);

        const additionalParams: any[] = [];
        if (extendedLog.logPayload !== undefined) {
          additionalParams.push(extendedLog.logPayload);
        }
        if (extendedLog.verboseLogPayload !== undefined) {
          additionalParams.push(extendedLog.verboseLogPayload);
        }
        logWriter().debug(extendedLog.message, ...additionalParams);
      },
      info: (...args) => {
        const extendedLog = extendLog(...args);

        const additionalParams: any[] = [];
        if (extendedLog.logPayload !== undefined) {
          additionalParams.push(extendedLog.logPayload);
        }
        if (extendedLog.verboseLogPayload !== undefined) {
          additionalParams.push(extendedLog.verboseLogPayload);
        }
        logWriter().info(extendedLog.message, ...additionalParams);
      },
      warn: (...args) => {
        const extendedLog = extendLog(...args);

        const additionalParams: any[] = [];
        if (extendedLog.logPayload !== undefined) {
          additionalParams.push(extendedLog.logPayload);
        }
        if (extendedLog.verboseLogPayload !== undefined) {
          additionalParams.push(extendedLog.verboseLogPayload);
        }
        logWriter().warn(extendedLog.message, ...additionalParams);
      },
      error: <A, B>(
        message: string,
        error?: unknown,
        logPayload?: JsonObject<A>,
        verboseLogPayload?: JsonObject<B>,
      ) => {
        const extendedLog = extendLog(message, logPayload, verboseLogPayload);

        const additionalParams: any[] = [];
        if (extendedLog.logPayload !== undefined) {
          additionalParams.push(extendedLog.logPayload);
        }
        if (extendedLog.verboseLogPayload !== undefined) {
          additionalParams.push(extendedLog.verboseLogPayload);
        }
        logWriter().error(extendedLog.message, error, ...additionalParams);
      },
      group: (...args) => logWriter().group(...args),
      groupEnd: (...args) => logWriter().groupEnd(...args),
    };
  };
}
