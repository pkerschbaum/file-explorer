/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CustomError } from '@app/base/custom-error';
import { objects } from '@app/base/utils/objects.util';
import type { JsonObject } from '@app/base/utils/types.util';

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

export function createLogger(context: string): Logger {
  function extendLog<A, B>(
    message: string,
    logPayload?: JsonObject<A>,
    verboseLogPayload?: JsonObject<B>,
  ) {
    // if CustomErrors get passed in a payload, extract the data prop of the error and
    // append it to the payload
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
      globalThis.modules.logWriter.debug(extendedLog.message, ...additionalParams);
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
      globalThis.modules.logWriter.info(extendedLog.message, ...additionalParams);
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
      globalThis.modules.logWriter.warn(extendedLog.message, ...additionalParams);
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
      globalThis.modules.logWriter.error(extendedLog.message, error, ...additionalParams);
    },
    group: (...args) => globalThis.modules.logWriter.group(...args),
    groupEnd: (...args) => globalThis.modules.logWriter.groupEnd(...args),
  };
}
