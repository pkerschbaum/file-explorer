export const asyncUtils = { wait };

function wait(waitForMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, waitForMs));
}
