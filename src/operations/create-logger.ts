/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CustomError } from '@app/base/custom-error';
import { objects } from '@app/base/utils/objects.util';
import { JsonObject } from '@app/base/utils/types.util';
import { logWriterRef } from '@app/operations/global-modules';

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
      logWriterRef.current.debug(extendedLog.message, ...additionalParams);
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
      logWriterRef.current.info(extendedLog.message, ...additionalParams);
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
      logWriterRef.current.warn(extendedLog.message, ...additionalParams);
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
      logWriterRef.current.error(extendedLog.message, error, ...additionalParams);
    },
    group: (...args) => logWriterRef.current.group(...args),
    groupEnd: (...args) => logWriterRef.current.groupEnd(...args),
  };
}
