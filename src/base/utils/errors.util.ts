export const errorsUtil = { computeVerboseMessageFromError };

function computeVerboseMessageFromError(error: unknown): string | undefined {
  let errorMessage: string | undefined;

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as { stack?: unknown }).stack === 'string'
  ) {
    errorMessage = (error as { stack: string }).stack;
  }

  return errorMessage;
}
